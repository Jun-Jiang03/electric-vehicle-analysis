# Import the dependencies.
import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
from flask_cors import CORS
#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///ev_db.sqlite")
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(autoload_with=engine)
# Save references to each table
sales_vol_his=Base.classes.sales_vol_his
ev_sales_his=Base.classes.ev_sales_his
ev_charging_his=Base.classes.ev_chargingpoint_his
sales_vol_pro=Base.classes.sales_vol_pro
ev_sales_pro=Base.classes.ev_sales_pro
ev_charging_pro=Base.classes.ev_chargingpoint_pro
# Create our session (link) from Python to the DB
session = Session(bind=engine)
#################################################
# Flask Routes
#################################################
app = Flask(__name__)
CORS(app)

@app.route("/")
def welcome():
    """List all available API routes."""
    return (
        f"Available Routes: <br/>"
        f"/api/v1.0/sales_volume_history <br/>"
        f"/api/v1.0/ev_sales_history <br/>"
        f"/api/v1.0/ev_charging_history <br/>"
        f"/api/v1.0/sales_volume_projection <br/>"
        f"/api/v1.0/ev_sales_projection <br/>"
        f"/api/v1.0/ev_charging_projection"
    )

@app.route("/api/v1.0/sales_volume_history")
def sales_volume_history():
    """Return sales volume history data."""
    results = session.query(sales_vol_his).all()
    session.close()
    # Convert results to a list of dictionaries
    sales_volume_data = [{"region":row.region, "year":row.year, "powertrain": row.powertrain, "volume": row.sales_volumes} for row in results]
    return jsonify(sales_volume_data)

@app.route("/api/v1.0/ev_sales_history")
def ev_sales_history():
    """Return EV sales history data."""
    results = session.query(ev_sales_his).all()
    session.close()
    # Convert results to a list of dictionaries
    ev_sales_data = [{"region":row.region, "year":row.year, "powertrain": row.powertrain, "sales_shares": row.sales_shares, "volume": row.sales_volumes} for row in results]
    return jsonify(ev_sales_data)

@app.route("/api/v1.0/ev_charging_history")
def ev_charging_history():
    """Return EV charging history data."""
    results = session.query(ev_charging_his).all()
    session.close()
    # Convert results to a list of dictionaries
    ev_charging_data = [{"region":row.region, "year":row.year, "charging_points":row.charging_points} for row in results]
    return jsonify(ev_charging_data)
@app.route("/api/v1.0/sales_volume_projection")
def sales_volume_projection():
    """Return sales volume projection data."""
    results = session.query(sales_vol_pro).all()
    session.close()
    # Convert results to a list of dictionaries
    sales_volume_projection_data = [{"region":row.region, "year":row.year, "powertrain": row.powertrain, "volume": row.sales_volumes} for row in results]
    return jsonify(sales_volume_projection_data)

@app.route("/api/v1.0/ev_sales_projection")
def ev_sales_projection():
    """Return EV sales projection data."""
    results = session.query(ev_sales_pro).all()
    session.close()
    # Convert results to a list of dictionaries
    ev_sales_projection_data = [{"region":row.region, "year":row.year, "powertrain": row.powertrain, "sales_shares": row.sales_shares, "volume": row.sales_volumes} for row in results]
    return jsonify(ev_sales_projection_data)

@app.route("/api/v1.0/ev_charging_projection")
def ev_charging_projection():
    """Return EV charging projection data."""
    results = session.query(ev_charging_pro).all()
    session.close()
    # Convert results to a list of dictionaries
    ev_charging_projection_data = [{"region":row.region, "year":row.year, "charging_points":row.charging_points} for row in results]
    return jsonify(ev_charging_projection_data)
   

if __name__ == "__main__":
    app.run(debug=True)