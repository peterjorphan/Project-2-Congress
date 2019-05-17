from propub_config import PROPUB_KEY
import json
import requests
import csv
import pandas as pd
from datetime import date
import datetime as datetime
import sqlalchemy
from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import *

engine = create_engine('sqlite:///demo.db')

Base = declarative_base()
 
class Members(Base):
    __tablename__ = "members"
    UserId = Column(Integer, primary_key=True)
    CongressID = Column(Integer)
    Chamber = Column(String)
    FirstName = Column(String)
    LastName = Column(String)
    DateOfBirth = Column(String)
    Gender = Column(String)
    Party = Column(String)
    State = Column(String)
    SwornInAge = Column(Integer)

headers = {
    "X-API-Key": PROPUB_KEY
}

members = []

for chamber in ['senate', 'house']:
    for i in range(104, 116):
        baseURL = f"https://api.propublica.org/congress/v1/{i}/{chamber}/members.json"

        response = requests.get(baseURL, headers=headers).json()
        
        for member in response["results"][0]["members"]:

            data = {}

            data["congress"] = response["results"][0]["congress"]
            data["chamber"] = response["results"][0]["chamber"]

            data["first_name"] = member["first_name"]
            data["last_name"] = member["last_name"]
            
            data["date_of_birth"] = member["date_of_birth"]
            
            data["gender"] = member["gender"]
            data["party"] = member["party"]
            data["state"] = member["state"]

            data["year"] = 1787 + (int(data["congress"]) * 2)
            
            sworn_in_date = date(data["year"], 1, 3)

            DOB = data["date_of_birth"].split('-')
            dob_dt = date(int(DOB[0]), int(DOB[1]), int(DOB[2]))
            
            data["sworn_in_age"] = round((sworn_in_date - dob_dt).days/365.25, 2)

            members.append(data)

for i in range(0, len(members)):
    print(members[i])