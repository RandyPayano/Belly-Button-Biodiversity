import os
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

# Connect to SQLite File
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
db = SQLAlchemy(app)
Base = automap_base()
Base.prepare(db.engine, reflect=True)

# Reflect Tables
Samples_Metadata = Base.classes.sample_metadata
Samples = Base.classes.samples

# Render index template
@app.route("/")
def index():
    """Render index template"""
    return render_template("index.html")

# Returns all names (numbers) in dataset
@app.route("/names")
def names():
    """returns all names (numbers) in dataset"""
    # Query Samples
    samples_query = db.session.query(Samples).statement
    # Convert Query into DataFrame
    df = pd.read_sql_query(samples_query, db.session.bind)
    # Return Sliced 
    return jsonify(list(df.columns)[2:])

 # Return MetaData for specific sample
@app.route("/metadata/<sample>")
def sample_metadata(sample):
    """Return individual sample"""
    columns_wanted = [
        Samples_Metadata.sample,
        Samples_Metadata.ETHNICITY,
        Samples_Metadata.GENDER,
        Samples_Metadata.AGE,
        Samples_Metadata.LOCATION,
        Samples_Metadata.BBTYPE,
        Samples_Metadata.WFREQ,
    ]
    # Query Samples MetaData
    metadata_query= db.session.query(*columns_wanted).filter(Samples_Metadata.sample == sample).all()
    # Create Dictionary with data to be returned
    dict_metadata = {}
    for result in metadata_query:
        dict_metadata["sample"] = result[0]
        dict_metadata["ETHNICITY"] = result[1]
        dict_metadata["GENDER"] = result[2]
        dict_metadata["AGE"] = result[3]
        dict_metadata["LOCATION"] = result[4]
        dict_metadata["BBTYPE"] = result[5]
        dict_metadata["WFREQ"] = result[6]

    # Return Metadata
    return jsonify(dict_metadata)


@app.route("/samples/<sample>")
def samples(sample):
    """labels, values and ids"""
    samples_query = db.session.query(Samples).statement
    # Conver query into DataFrame
    samples_df = pd.read_sql_query(samples_query, db.session.bind)
    # Sliced DataFrame
    sample_data = samples_df.loc[samples_df[sample] > 1, ["otu_id", "otu_label", sample]]

    # Sort Values
    sample_data.sort_values(by=sample, ascending=False, inplace=True)
    # Create Dictionary with data to be returned
    data = {
        "otu_ids": sample_data.otu_id.values.tolist(),
        "sample_values": sample_data[sample].values.tolist(),
        "otu_labels": sample_data.otu_label.tolist(),
    }
    return jsonify(data)


if __name__ == "__main__":
    app.run()
