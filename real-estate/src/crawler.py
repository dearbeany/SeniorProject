from urllib.request import urlopen
from bs4 import BeautifulSoup
import requests

#html = urlopen("https://realestate.daum.net/news")
#soup = BeautifulSoup(html, "html.parser")

def daum_crawling():
    url = 'https://realestate.daum.net/news'
    
    response = requests.get(url)

    soup = BeautifulSoup(response.text, "html.parser")
    
​    

for link in soup.select('a'):
    print(link.get('href')) # a태그의 href를 전부 찾기
    