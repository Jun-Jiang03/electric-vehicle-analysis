//fetch ev charging points data
d3.json("http://127.0.0.1:5000/api/v1.0/ev_sales_history").then((data) => {
    console.log(data);

    // Extract unique years and regions
    const years = [...new Set(data.map(row => row.year))];
    const regions = [...new Set(data.map(row => row.region))];

    // Populate the dropdown menus
    const regionDropdown = d3.select("#countryDropdown");
    regions.forEach(region => {
        regionDropdown.append("option").text(region).attr("value", region);
    });

    function updateBarChart(selectedRegion) {
        // Filter data for the selected region
        const filteredData = data.filter(row => row.region === selectedRegion);
    
        // Create a mapping of years 
        const yearData = {};
        filteredData.forEach(row => {
            if (!yearData[row.year]) {
                yearData[row.year] = 0; // Initialize if not present
            }
            yearData[row.year] += parseFloat(row.volume, 0); 
        });
    
        // Prepare x and y arrays for the bar chart
        const years = Object.keys(yearData); // Get years as an array
        const sales_volumes = Object.values(yearData); 
    
        const trace = {
            x: years, // Use years array here
            y: sales_volumes, // Use charging points array here
            name: selectedRegion,
            type: 'bar',
            marker: {
                color: '#1f77b4'
            }
        };
    
        const layout = {
            title: `Sales volumes of EVs in ${selectedRegion} over years`,
            xaxis: { title: 'Year' },
            yaxis: { title: 'Sales volumes' },
            barmode: 'group',
            margin: { l: 100, r: 100, t: 100, b: 100 }
        };
        console.log("Filtered Data:", filteredData);
        console.log("Year Data:", yearData);
        console.log("Sales Volumes:", sales_volumes);
        // Render the plot
        Plotly.newPlot("barChart2", [trace], layout);
    }

    // Initial plot for bar chart
    updateBarChart(regions[0]);

    regionDropdown.on("change", function () {
        const selectedRegion = d3.select(this).property("value");
        updateBarChart(selectedRegion);
    });

});
