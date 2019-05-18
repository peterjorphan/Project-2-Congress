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

# get your own api key: https://www.propublica.org/datastore/api/propublica-congress-api

from propub_config import PROPUB_KEY

# begin extracting data from api

headers = {
    "X-API-Key": PROPUB_KEY
}

members_list = []

# repeat api calls for senate and house

for chamber in ['senate', 'house']:
    
    # repeat for each different congress
    
    for i in range(104, 117):
        baseURL = f"https://api.propublica.org/congress/v1/{i}/{chamber}/members.json"

        response = requests.get(baseURL, headers=headers).json()
        
        # drill down to the member data section within json
        
        for member in response["results"][0]["members"]:

            data = {}

            data["CongressID"] = response["results"][0]["congress"]
            data["Chamber"] = response["results"][0]["chamber"]

            data["FirstName"] = member["first_name"]
            data["LastName"] = member["last_name"]
            
            data["DateOfBirth"] = member["date_of_birth"]
            
            data["Gender"] = member["gender"]
            data["Party"] = member["party"]
            data["State"] = member["state"]

            # this converts congress number to calendar year
            
            data["Year"] = 1787 + (int(data["CongressID"]) * 2)
            
            # math to determine age (in years, rounded to 2 decimal places) at time of being sworn into congress
            # we use the date provided by US Constitution for this, actual date for congress inaguration might be off by 3 or 4 days
            # thank god this API uses ISO-8601 format

            sworn_in_date = date(data["Year"], 1, 3)

            DOB = data["DateOfBirth"].split('-')
            dob_dt = date(int(DOB[0]), int(DOB[1]), int(DOB[2]))
            
            # because having a "difference in years" method in the datetime package would make things far too easy...

            data["SwornInAge"] = round((sworn_in_date - dob_dt).days/365.25, 2)

            members_list.append(data)

# confirming data, can probably comment out later to speed things along

for i in range(0, len(members_list)):
    print(members_list[i])

# create database table, if it doesn't already exist

engine = create_engine('sqlite:///db/db_congress.db')

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
    Year = Column(Integer)
    SwornInAge = Column(Float)

Members.__table__.create(bind=engine, checkfirst=True)

Session = sessionmaker(bind=engine)

session = Session() 

# (finally) entering data
# WARNING: THIS WILL APPEND DATA IF THE DATABASE ALREADY EXISTS.
# IT WILL NOT REWRITE THE DATABASE.

for item in members_list:
    row = Members(**item)
    session.add(row)

session.commit()