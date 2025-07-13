# backend/app/parser.py
import re
from datetime import datetime
from typing import List, Tuple

import requests
from bs4 import BeautifulSoup, NavigableString, Tag


HEADERS = {
    # Learn sometimes blocks the default python-requests UA
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        " AppleWebKit/537.36 (KHTML, like Gecko)"
        " Chrome/126.0.0.0 Safari/537.36"
    )
}


def _extract_description(soup: BeautifulSoup) -> str:
    """
    1.  <meta name="description">  (most reliable)
    2.  <div class="lead"> …        (some older docs)
    3.  First <p> under the main H1 (fallback)
    """
    meta = soup.find("meta", attrs={"name": "description"})
    if meta and meta.get("content"):
        return meta["content"].strip()

    lead = soup.select_one("div.lead")
    if lead and lead.get_text(strip=True):
        return lead.get_text(strip=True)

    # first paragraph after the page title
    h1 = soup.find("h1")
    if h1:
        p = h1.find_next("p")
        if p and p.get_text(strip=True):
            return p.get_text(strip=True)

    return "No description found"


def _extract_resources(soup: BeautifulSoup) -> List[str]:
    """
    Look for the 'Components' section (id='components' on Learn)
    and return every <li> text inside the next <ul>.
    """
    header: Tag | None = soup.find(id="components")
    if header is None:
        # older pages: <h3>Components</h3> without id
        header = soup.find("h3", string=re.compile(r"components?", re.I))

    if header:
        ul = header.find_next("ul")
        if ul:
            items: list[str] = [
                " ".join(li.stripped_strings) for li in ul.find_all("li") if li.get_text(strip=True)
            ]
            return items

    return []  # section missing on some pages


def parse_architecture_page(url: str) -> dict:
    """
    Scrape a Microsoft Learn Architecture article and return a Mongo-ready dict.
    """
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    title_tag = soup.find("h1")
    if not title_tag:
        raise ValueError(f"Could not locate <h1> title on {url!r}")

    title = title_tag.get_text(strip=True)
    # TODO: get text from <main /> and send it AI to geenrate description and resources
    description = _extract_description(soup)
    resources = _extract_resources(soup)

    return {
        "title": title,
        "description": description,
        "resources": resources,
        "source_url": url,
        "timestamp": datetime.utcnow().isoformat(timespec="seconds") + "Z",
    }
