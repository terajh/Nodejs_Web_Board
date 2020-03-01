from bs4 import BeautifulSoup
import requests
import pymysql
import json # import json module

conn = pymysql.connect(host='localhost',user='root',password='dkd352487',db='board',charset='utf8')
curs=conn.cursor()
url = 'https://comic.naver.com/webtoon/detail.nhn?'

with open("webtoon.json") as json_file:
    json_data=json.load(json_file)
    webtoonlist=json_data["webtoonsList"]
    for webtoonname in webtoonlist:
        lastepi=json_data[webtoonname]["episode"]
        
        sql ="INSERT INTO webtoonlist (title,Lastepisode) VALUES (%s,%s) ON DUPLICATE KEY UPDATE title=%s, Lastepisode=%s"
        curs.execute(sql,(webtoonname,lastepi,webtoonname,lastepi))
        conn.commit()

        for epi in range(1,lastepi+1):
            option={'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36'}
            req= requests.get(url+'titleId='+str(json_data[webtoonname]["titleId"])+'&no='+str(epi)+'&weekday=sat').text
            soup=BeautifulSoup(req,'html.parser')
            arr = soup.select('.wt_viewer > img')
            
            for i in arr:
                img_src = i.get("src")
                print(img_src);
                print('download {title} {epi}화'.format(title=webtoonname,epi=epi))
                sql = "INSERT INTO webtoon (title,episode,src) VALUES (%s,%s,%s) ON DUPLICATE KEY UPDATE title=%s, src=%s"
                curs.execute(sql,(webtoonname,epi,img_src,webtoonname,img_src))
                conn.commit()
        
conn.close()
