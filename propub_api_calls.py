from propub_config import PROPUB_KEY
import json
import requests
import csv
import pandas as pd

headers = {
    "X-API-Key": PROPUB_KEY
}

for i in range(104, 116):
    baseURL = f"https://api.propublica.org/congress/v1/{i}/senate/members.json"
    
    response = requests.get(baseURL, headers=headers).json()
    
    print(response["status"])
    print(response["results"][0]["congress"])
    print(response["results"][0]["members"][90])

    with open(f'testfile_{i}.json', 'w') as outfile:
        json.dump(response, outfile)