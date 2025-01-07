-- Drop table if exists
DROP TABLE IF EXISTS ev_sales_his;
DROP TABLE IF EXISTS ev_sales_pro;
DROP TABLE IF EXISTS sales_vol_his;
DROP TABLE IF EXISTS sales_vol_pro;
DROP TABLE IF EXISTS ev_chargingpoint_his;
DROP TABLE IF EXISTS ev_chargingpoint_pro;

-- Create new tables to import data
CREATE TABLE ev_sales_his (
    region VARCHAR(50),           
    year INT,                     
    powertrain VARCHAR(10),       
    sales_shares DECIMAL(20, 10), 
    sales_volumes DECIMAL(20, 2), 
    PRIMARY KEY (region, year) -- Composite primary key
);

CREATE TABLE ev_sales_pro (
    region VARCHAR(50),           
    year INT,                     
    powertrain VARCHAR(10),       
    sales_shares DECIMAL(20, 10), 
    sales_volumes DECIMAL(20, 2), 
    PRIMARY KEY (region, year) -- Composite primary key
);

CREATE TABLE sales_vol_his (
    region VARCHAR(50),           
    year INT,                     
    powertrain VARCHAR(10),       
    sales_volumes DECIMAL(20, 2), 
    PRIMARY KEY (region, year, powertrain) -- Composite primary key
);

CREATE TABLE sales_vol_pro (
    region VARCHAR(50),           
    year INT,                     
    powertrain VARCHAR(10),       
    sales_volumes DECIMAL(20, 2), 
    PRIMARY KEY (region, year, powertrain) -- Composite primary key
);

CREATE TABLE ev_chargingpoint_his (
    region VARCHAR(50),           
    year INT,                         
    charging_points DECIMAL(20, 2), 
    PRIMARY KEY (region, year) -- Composite primary key
);

CREATE TABLE ev_chargingpoint_pro (
    region VARCHAR(50),           
    year INT,                         
    charging_points DECIMAL(20, 2), 
    PRIMARY KEY (region, year) -- Composite primary key
);

-- Import data from ev_sales_his.csv;
-- View the table to ensure data has been imported correctly
SELECT * FROM ev_sales_his limit 10;

-- Import data from ev_sales_pro.csv;
-- View the table to ensure data has been imported correctly
SELECT * FROM ev_sales_pro limit 10;

-- Import data from sales_vol_his_bytype.csv;
-- View the table to ensure data has been imported correctly
SELECT * FROM sales_vol_his limit 10;

-- Import data from sales_vol_pro_bytype.csv;
-- View the table to ensure data has been imported correctly
SELECT * FROM sales_vol_pro limit 10;

-- Import data from ev_chargingpoint_his.csv;
-- View the table to ensure data has been imported correctly
SELECT * FROM ev_chargingpoint_his limit 10;

-- Import data from ev_chargingpoint_pro.csv;
-- View the table to ensure data has been imported correctly
SELECT * FROM ev_chargingpoint_pro limit 10;

