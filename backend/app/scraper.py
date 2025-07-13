# backend/app/scraper.py
import os
import re
import requests
import time
from app.db import insert_architecture
from app.parser import parse_architecture_page
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from app.db import get_largest_page_value

BROWSE_URL = "https://learn.microsoft.com/en-us/azure/architecture/browse/"
page_str = "?skip="


def get_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--user-data-dir=/tmp/chrome-user-data")

    # on windows
    # return webdriver.Chrome(options=chrome_options)
    
    # on linux, Docker
    service = Service(executable_path="/usr/bin/chromedriver")
    return webdriver.Chrome(service=service, options=chrome_options)

def get_architecture_results_count():
    driver = get_driver()
    
    print("Fetching architecture results count...")
    driver.get(BROWSE_URL)
    time.sleep(5)  # Wait for JS to render content

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    title_tag = soup.find("h2", class_="title is-6")
    if title_tag:
        number = r"([\d]+)"
        hits = re.match(number, title_tag.text.strip())
        if hits:
            os.environ["ARCHITECTURE_RESULTS_COUNT"] = hits.group(1)
            return int(hits.group(1))
    return None


def scrape_architecture_links_dynamic(page_no = 0):
    driver = get_driver()

    if page_no < 0:
        raise ValueError("Page number cannot be negative")
    elif page_no == 0:
        driver.get(BROWSE_URL)
    else:
        driver.get(f"{BROWSE_URL}{page_str}{page_no * 6}")
    time.sleep(5)  # Wait for JS to render content

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    links = []
    for card in soup.find_all("article", class_="card", attrs={"data-bi-name": "card"}):
        a_tag = card.find("a", class_="card-content-title")
        if a_tag and "/azure/architecture/" in a_tag.get("href"):
            links.append(f"https://learn.microsoft.com{a_tag['href']}")

    return list(set(links))


def scrape_and_parse_all():
    if not os.getenv("ARCHITECTURE_RESULTS_COUNT"):
        get_architecture_results_count()
    
    pages = int(os.getenv("ARCHITECTURE_RESULTS_COUNT", 0)) // 6
    
    start_page = get_largest_page_value()
    print(f"Starting scrape from page {start_page} to {pages+1}")
    
    for page in range(start_page+7, pages + 1):
        arch_urls = scrape_architecture_links_dynamic(page_no=page)
        print(f"Found {len(arch_urls)} architecture links on page {page+1}.")
        for url in arch_urls[:6]:  # Limit for testing
            try:
                arch_data = parse_architecture_page(url)
                arch_data['page'] = page
                insert_architecture(arch_data)
            except Exception as e:
                print(f"Failed to scrape {url}: {e}")
        break
    print("Scraping complete.")
    