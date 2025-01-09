// Fetch both datasets
Promise.all([
    d3.json("http://127.0.0.1:5000/api/v1.0/ev_charging_history"),
    d3.json("http://127.0.0.1:5000/api/v1.0/ev_sales_history")
]).then(([chargingData, salesData]) => {
    console.log(chargingData); // Verify the data
    console.log(salesData);    // Verify the data

    // Extract unique years for the dropdown
    const years = [...new Set(chargingData.map(d => d.year))].sort((a, b) => a - b);
    const dropdown = d3.select("#yearSelect");

    // Populate dropdown menu for years
    dropdown.selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // Set default year to the first year in the list
    const defaultYear = years[0];
    dropdown.property("value", defaultYear);
    updateScatterChart(defaultYear);

    // Add event listener to update the chart on dropdown change
    dropdown.on("change", function () {
        const selectedYear = +this.value;
        updateScatterChart(selectedYear);
    });

    // Function to update the chart based on selected year
    function updateScatterChart(year) {

        const excludedRegions = ["World", "Europe", "EU27"];

        // Filter data based on the selected year
        const filteredSales = salesData.filter(d => d.year === year);
        const filteredCharging = chargingData.filter(d => d.year === year);

        console.log(filteredSales)
        console.log(filteredCharging)

        // Join data on the region field
        const mergedData = filteredSales.map(sale => {
            const charging = filteredCharging.find(ch => ch.region === sale.region);
            return charging && !excludedRegions.includes(sale.region) ? {
                region: sale.region,
                sales_volume: parseFloat(sale.volume), 
                charging_points: parseFloat(charging.charging_points)
            } : null;
        }).filter(d => d); // Remove nulls

        console.group(mergedData)

        // Extract data for plotting
        const regions = mergedData.map(d => d.region);
        const salesVolume = mergedData.map(d => d.sales_volume);
        const chargingPoints = mergedData.map(d => d.charging_points);


        console.group(regions)
        console.group(salesVolume)
        console.group(chargingPoints)
        
        // Check if there is any data for the selected year
        if (mergedData.length === 0) {
            alert("No data found for the selected year.");
            Plotly.newPlot('scatterChart', [], { title: 'No Data Available', xaxis: {}, yaxis: {} });
            return;
        }


        // Perform Linear Regression (using a simple linear regression formula)
        const linearRegression = (x, y) => {
            const n = x.length;
            const sumX = x.reduce((sum, value) => sum + value, 0);
            const sumY = y.reduce((sum, value) => sum + value, 0);
            const sumXY = x.reduce((sum, value, i) => sum + value * y[i], 0);
            const sumX2 = x.reduce((sum, value) => sum + value * value, 0);

            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;

            return { slope, intercept };
    };

    const { slope, intercept } = linearRegression(chargingPoints, salesVolume);

    //  // Calculate the Pearson correlation coefficient using simple-statistics
    //  const correlation = simpleStats.sampleCorrelation(salesShare, chargingPoints);

    //  console.log("Pearson correlation coefficient:", correlation);

    function pearsonCorrelation(x, y) {
        const n = x.length;
        const sumX = x.reduce((acc, val) => acc + val, 0);
        const sumY = y.reduce((acc, val) => acc + val, 0);
        const sumX2 = x.reduce((acc, val) => acc + val * val, 0);
        const sumY2 = y.reduce((acc, val) => acc + val * val, 0);
        const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
    
        const numerator = n * sumXY - (sumX * sumY);
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
        return numerator / denominator;
    }
    
    const correlation = pearsonCorrelation(salesVolume, chargingPoints);
    console.log("Pearson Correlation Coefficient: ", correlation);
    
    


    // Generate the regression line (y = slope * x + intercept)
    const regressionLineX = salesVolume;
    const regressionLineY = regressionLineX.map(xVal => slope * xVal + intercept);

    // Prepare traces for Plotly
    const scatterTrace = {
        x: chargingPoints,
        y: salesVolume,
        mode: 'markers',
        type: 'scatter',
        text: regions, // Display region names on hover
        marker: {
            size: 10,
            color: 'steelblue'
        }
    };

    const regressionTrace = {
        x: regressionLineX,
        y: regressionLineY,
        mode: 'lines',
        type: 'scatter',
        line: {
            color: 'orange',
            width: 2
        },
        name: 'Linear Regression',
        hovertemplate: `y = ${slope.toFixed(0)}x + ${intercept.toFixed(0)} <br> Pearson Correlation: ${correlation.toFixed(2)}`
    };

    const layout = {
        title: `EV Sales Shares vs Charging Points - Year ${year}`,
        xaxis: { title: 'Charging Points'},
        yaxis: { title: 'Sales Volume' },
        hovermode: 'closest',
        showlegend: false
    };

        // Create the chart with Plotly
        Plotly.newPlot('scatterChart', [scatterTrace, regressionTrace], layout);
    }
})
