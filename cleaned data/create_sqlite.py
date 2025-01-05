import sqlite3
import pandas as pd

from pathlib import Path

# Create a new SQLite database called ev_db
database_path = "ev_db.sqlite"
conn = sqlite3.connect(database_path)
c = conn.cursor()

# Create the tables
c.execute('''
CREATE TABLE ev_sales_his (
    region VARCHAR(50),           
    year INT,                     
    powertrain VARCHAR(10),       
    sales_shares DECIMAL(20, 10), 
    sales_volumes DECIMAL(20, 2), 
    PRIMARY KEY (region, year) 
);
''')

c.execute('''
CREATE TABLE ev_sales_pro (
    region VARCHAR(50),           
    year INT,                     
    powertrain VARCHAR(10),       
    sales_shares DECIMAL(20, 10), 
    sales_volumes DECIMAL(20, 2), 
    PRIMARY KEY (region, year) 
);
''')

c.execute('''
CREATE TABLE sales_vol_his (
    region VARCHAR(50),           
    year INT,                     
    powertrain VARCHAR(10),       
    sales_volumes DECIMAL(20, 2), 
    PRIMARY KEY (region, year, powertrain) 
);
''')

c.execute('''
CREATE TABLE sales_vol_pro (
    region VARCHAR(50),           
    year INT,                     
    powertrain VARCHAR(10),       
    sales_volumes DECIMAL(20, 2), 
    PRIMARY KEY (region, year, powertrain) 
);
''')

c.execute('''
CREATE TABLE ev_chargingpoint_his (
    region VARCHAR(50),           
    year INT,                         
    charging_points DECIMAL(20, 2), 
    PRIMARY KEY (region, year) 
);
''')

c.execute('''
CREATE TABLE ev_chargingpoint_pro (
    region VARCHAR(50),           
    year INT,                         
    charging_points DECIMAL(20, 2), 
    PRIMARY KEY (region, year) 
);
''')

# Commit changes and close the connection
conn.commit()

# Import data from CSV files into the corresponding tables
csv_files = {
    "ev_sales_his": "/Users/junjiang/electric-vehicle-analysis/cleaned data/ev_sales_his.csv",
    "ev_sales_pro": "/Users/junjiang/electric-vehicle-analysis/cleaned data/ev_sales_pro.csv",
    "sales_vol_his": "/Users/junjiang/electric-vehicle-analysis/cleaned data/sales_vol_his_bytype.csv",
    "sales_vol_pro": "/Users/junjiang/electric-vehicle-analysis/cleaned data/sales_vol_pro_bytype.csv",
    "ev_chargingpoint_his": "/Users/junjiang/electric-vehicle-analysis/cleaned data/ev_chargingpoint_his.csv",
    "ev_chargingpoint_pro": "/Users/junjiang/electric-vehicle-analysis/cleaned data/ev_chargingpoint_pro.csv"
}

for table_name, csv_file in csv_files.items():
    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_file)
    
    # Import the DataFrame into the SQLite table
    df.to_sql(table_name, conn, if_exists='append', index=False)

# Close the connection
conn.close()