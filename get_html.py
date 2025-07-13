import requests
from bs4 import BeautifulSoup

url = "https://learn.microsoft.com/en-us/azure/architecture/networking/architecture/hub-spoke-virtual-wan-architecture"
res = requests.get(url)
soup = BeautifulSoup(res.text, "html.parser")

content  = soup.find("main")
with open("debug.html", "w") as f:
    f.write(content.prettify())
with open("debug.txt", "w") as f:
    f.write(content.get_text(separator="\n", strip=True))
    