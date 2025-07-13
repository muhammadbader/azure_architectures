import re
import os
from datetime import datetime
from typing import List, Tuple
import json

import requests
from bs4 import BeautifulSoup, Tag
import openai

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        " AppleWebKit/537.36 (KHTML, like Gecko)"
        " Chrome/126.0.0.0 Safari/537.36"
    )
}

openai.api_key = os.environ.get("OPENAI_API_KEY",)


def _extract_with_chatgpt(main_content: str) -> Tuple[str, List[str]]:
    prompt = f"""
You are an assistant that reads technical architecture documentation and returns:

1) A very short summary description (1-2 sentences).
2) A list of components or resources mentioned in the document.

Please respond in strict JSON format with two keys:
"description": string,
"resources": list of strings.

Here is the document content:
\"\"\"
{main_content}
\"\"\"
"""

    response = openai.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=500,
    )

    content = response.choices[0].message.content

    try:
        data = json.loads(content)
        description = data.get("description", "No description found")
        resources = data.get("resources", [])
        if not isinstance(resources, list):
            resources = []
    except Exception:
        description = "No description found"
        resources = []

    return description, resources



def parse_architecture_page(url: str) -> dict:
    """
    Scrape a Microsoft Learn Architecture article and return a Mongo-ready dict,
    using ChatGPT to generate description and resources from <main>.
    """
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    title_tag = soup.find("h1")
    if not title_tag:
        raise ValueError(f"Could not locate <h1> title on {url!r}")

    title = title_tag.get_text(strip=True)

    main_tag: Tag | None = soup.find("main")
    if not main_tag:
        raise ValueError(f"Could not locate <main> element on {url!r}")

    main_content = main_tag.get_text(separator="\n", strip=True)

    description, resources = _extract_with_chatgpt(main_content)

    return {
        "title": title,
        "description": description,
        "resources": resources,
        "source_url": url,
        "timestamp": datetime.utcnow().isoformat(timespec="seconds") + "Z",
    }
