import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/db_congress.db"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Members_Metadata = Base.classes.members

# def create_app():

#     with app.app_context():
#         app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/db_congress.db"
#         db = SQLAlchemy(app)

#         # reflect an existing database into a new model
#         Base = automap_base()
#         # reflect the tables
#         Base.prepare(db.engine, reflect=True)

#         # Save references to each table
#         Members_Metadata = Base.classes.members
#         # init_db()

#     return app

# create_app()

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/line/<state>")
def line(state):
    stmt = db.session.query(Members_Metadata).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    
    # Filter the data for the states selected
#     df_filtered = pd.DataFrame()
    
    df_filtered = df.loc[df['State'] == state].reset_index()
    
    # Group the dataframes
    df_filtered_grouped = df_filtered['SwornInAge'].groupby(df_filtered['Year'])
    df_grouped = df['SwornInAge'].groupby(df['Year'])
    df_ByState = df['SwornInAge'].groupby([df['State'], df['Year']])
#     d = df_filtered_grouped.mean().unstack()

    # Format the data to send as json
    data = {
        "Year": list(df_filtered_grouped.groups.keys()),
        "AverageAge": list(df_filtered_grouped.mean()), 
        "AverageTotal": list(df_grouped.mean())
    }
    
#     for index, row in d.iterrows():
#         data = {
# #             "State": [index],
#             "Year": list(d.columns),
#             "AverageAge": list(row)
#         }

    print (df_filtered_grouped.mean())
    print(data)
#     print(df_ByState.mean())

    return jsonify(data)
    # return data

# with app.app_context():
#     line('MO')

@app.route("/bar/<int:year>")
def bar(year):
    stmt = db.session.query(Members_Metadata).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    
    # Filter the data for the year selected
    
    df_filtered = df.loc[df['Year'] == year].reset_index()
        
    # Group the dataframes
    df_filtered_grouped = df_filtered['SwornInAge'].groupby(df_filtered['State'])
    df_grouped = df['SwornInAge'].groupby(df['State'])
    df_ByYear = df['SwornInAge'].groupby([df['Year'], df['State']])
    df_filtered_party = df_filtered['Party'].groupby(df_filtered['State'])
    
    # Get Majority Party for each State

    df_party = df_filtered_party.value_counts().reset_index(name='count')

    df_pivot = df_party.pivot(index='State', columns='Party', values='count')

    df_pivot = df_pivot.fillna(0)

    df_pivot['Majority'] = np.where(df_pivot['D']> df_pivot["R"], 'D', 'R')

    # Format the data to send as json
    data = {
        "State": list(df_filtered_grouped.groups.keys()),
        "AverageAge": list(df_filtered_grouped.mean()), 
        "Party": df_pivot.Majority.values.tolist()
    }

    return jsonify(data)

@app.route("/map/<year>")
def map(year):
    stmt = db.session.query(Members_Metadata).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    
    # Filter the data for the states selected
#     df_filtered = pd.DataFrame()
    
    df_filtered = df.loc[df['Year'] == year].reset_index()
        
    # Group the dataframes
    df_filtered_grouped_State = df_filtered['SwornInAge'].groupby(df_filtered['State'])
   
#     d = df_filtered_grouped.mean().unstack()

    # Format the data to send as json
    data = {
        "Year": list(df_filtered_grouped_State),
    }
    

    # print(df_filtered_grouped.mean())
    #print(data)
#     print(df_ByState.mean())

    return jsonify(data)
    # return data

# with app.app_context():
#     map(2019)

# @app.route("/names")
# def names():
#     """Return a list of sample names."""

#     # Use Pandas to perform the sql query
#     stmt = db.session.query(Samples).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Return a list of the column names (sample names)
#     return jsonify(list(df.columns)[2:])


# @app.route("/metadata/<sample>")
# def sample_metadata(sample):
#     """Return the MetaData for a given sample."""
#     sel = [
#         Samples_Metadata.sample,
#         Samples_Metadata.ETHNICITY,
#         Samples_Metadata.GENDER,
#         Samples_Metadata.AGE,
#         Samples_Metadata.LOCATION,
#         Samples_Metadata.BBTYPE,
#         Samples_Metadata.WFREQ,
#     ]

#     results = db.session.query(*sel).filter(Samples_Metadata.sample == sample).all()

#     # Create a dictionary entry for each row of metadata information
#     sample_metadata = {}
#     for result in results:
#         sample_metadata["sample"] = result[0]
#         sample_metadata["ETHNICITY"] = result[1]
#         sample_metadata["GENDER"] = result[2]
#         sample_metadata["AGE"] = result[3]
#         sample_metadata["LOCATION"] = result[4]
#         sample_metadata["BBTYPE"] = result[5]
#         sample_metadata["WFREQ"] = result[6]

#     print(sample_metadata)
#     return jsonify(sample_metadata)


# @app.route("/samples/<sample>")
# def samples(sample):
#     """Return `otu_ids`, `otu_labels`,and `sample_values`."""
#     stmt = db.session.query(Samples).statement
#     df = pd.read_sql_query(stmt, db.session.bind)

#     # Filter the data based on the sample number and
#     # only keep rows with values above 1
#     sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]
#     # Format the data to send as json
#     data = {
#         "otu_ids": sample_data.otu_id.values.tolist(),
#         "sample_values": sample_data[sample].values.tolist(),
#         "otu_labels": sample_data.otu_label.tolist(),
#     }
#     return jsonify(data)


if __name__ == "__main__":
    app.run()
