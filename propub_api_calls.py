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

for i in range(104, 115):
    baseURL = f"https://api.propublica.org/congress/v1/{i}/house/members.json"

    response = requests.get(baseURL, headers=headers).json()
