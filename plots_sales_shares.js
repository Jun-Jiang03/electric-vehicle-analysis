d3.json("http://127.0.0.1:5000/api/v1.0/ev_sales_history").then((data) => {
    //console.log(data);

    // Extract unique years and regions
    const years = [...new Set(data.map(row => row.year))];
    const regions = [...new Set(data.map(row => row.region))];

    // Populate the dropdown menus
    const regionDropdown = d3.select("#salesShareDropdown");
    regions.forEach(region => {
        regionDropdown.append("option").text(region).attr("value", region);
    });
    //console.log(regionDropdown);

    function updateSalesBarChart(selectedRegion) {
        // Filter data for the selected region
        const filteredData = data.filter(row => row.region === selectedRegion);
    
        // Create a mapping of years to sales
        const yearData = {};
        filteredData.forEach(row => {
            if (!yearData[row.year]) {
                yearData[row.year] = 0; // Initialize if not present
            }
            yearData[row.year] += parseFloat(row.sales_shares, 0); // Accumulate sales
        });
    
        // Prepare x and y arrays for the bar chart
        const years = Object.keys(yearData); // Get years as an array
        const salesShares = Object.values(yearData); // Get corresponding sales
    
        const trace = {
            x: years, // Use years array here
            y: salesShares, // Use sales array here
            name: selectedRegion,
            type: 'bar',
            marker: {
                color: '#1f77b4'
            },
            hovertemplate: 
                '<b>Year: %{x}</b><br>' + 
                'Sales: %{y}<br>' +
                '<extra></extra>'  // Hide the default trace name from the hover
        };
    
        const layout = {
            title: `Sales of EVs in ${selectedRegion}`,
            xaxis: { title: 'Year' },
            yaxis: { title: 'Sales (%)' , range: [0,50]},
            barmode: 'group',
            margin: { l: 50, r: 50, t: 50, b: 50 },
            responsive: true // Ensure the chart resizes properly
        };
    
        // Render the plot
        Plotly.newPlot("sales_shares_chart", [trace], layout); // Pass an array with a single trace
    }
    // Initial plot for bar chart
    updateSalesBarChart(regions[0]);

    // Dropdown change handler for updating the chart
    regionDropdown.on("change", function () {
        const selectedRegion = d3.select(this).property("value");
        updateSalesBarChart(selectedRegion);
    });

});    