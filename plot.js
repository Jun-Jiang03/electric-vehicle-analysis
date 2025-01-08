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

//fetch ev charging points data
d3.json("http://127.0.0.1:5000/api/v1.0/ev_charging_history").then((data) => {
    console.log(data);

    // Extract unique years and regions
    const years = [...new Set(data.map(row => row.year))];
    const regions = [...new Set(data.map(row => row.region))];

    // Populate the dropdown menus
    const yearDropdown = d3.select("#yearDropdown");
    yearDropdown.append("option").text("All Years").attr("value", "all");
    years.forEach(year => {
        yearDropdown.append("option").text(year).attr("value", year);
    });

    const regionDropdown = d3.select("#countryDropdown");
    regions.forEach(region => {
        regionDropdown.append("option").text(region).attr("value", region);
    });

    function updateBarChart(selectedRegion) {
        // Filter data for the selected region
        const filteredData = data.filter(row => row.region === selectedRegion);
    
        // Create a mapping of years to charging points
        const yearData = {};
        filteredData.forEach(row => {
            if (!yearData[row.year]) {
                yearData[row.year] = 0; // Initialize if not present
            }
            yearData[row.year] += parseFloat(row.charging_points, 0); // Accumulate charging points
        });
    
        // Prepare x and y arrays for the bar chart
        const years = Object.keys(yearData); // Get years as an array
        const chargingPoints = Object.values(yearData); // Get corresponding charging points
    
        const trace = {
            x: years, // Use years array here
            y: chargingPoints, // Use charging points array here
            name: selectedRegion,
            type: 'bar',
            marker: {
                color: '#1f77b4'
            }
        };
    
        const layout = {
            title: `Charging Points of EVs in ${selectedRegion} over years`,
            xaxis: { title: 'Year' },
            yaxis: { title: 'Charging Points' },
            barmode: 'group',
            margin: { l: 100, r: 100, t: 100, b: 100 }
        };
    
        // Render the plot
        Plotly.newPlot("barChart", [trace], layout); // Pass an array with a single trace
    }

    // Initial plot for bar chart
    updateBarChart(regions[0]);

    regionDropdown.on("change", function () {
        const selectedRegion = d3.select(this).property("value");
        updateBarChart(selectedRegion);
    });

    // --- Pie Chart ---
    function updatePieChart(selectedYear) {
        let filteredData;
        if (selectedYear === "all") {
            filteredData = data;
        } else {
            filteredData = data.filter(row => row.year == selectedYear);
        }

         // Define regions to ignore
        const excludedRegions = ["World", "Europe", "EU27"];

        const regionData = regions.map(region => {
            // Skip excluded regions
            if (excludedRegions.includes(region)) {
                return null; // Return null for excluded regions
            } 
            const totalChargingPoints = filteredData
                .filter(row => row.region === region)
                .reduce((sum, row) => sum + parseFloat(row.charging_points), 0);
            return { region, charging_points: totalChargingPoints };
        }).filter(d => d !== null); // Filter out null values

        const validData = regionData.filter(d => d.charging_points > 0);

        // Sort the valid data and get the top 5 regions
        const top5Data = validData.sort((a, b) => b.charging_points - a.charging_points).slice(0, 5);

        const labels = top5Data.map(d => d.region);
        const values = top5Data.map(d => d.charging_points);

        // Create hover information for all valid data
        const hoverLabels = validData.map(d => d.region);
        const hoverValues = validData.map(d => d.charging_points);

        const trace = {
            labels: labels,
            values: values,
            type: 'pie',
            textinfo: 'label+percent',
            hoverinfo: 'label+value+percent',
            text: hoverValues.map((value, index) => `${hoverLabels[index]}: ${value}`),
            marker: {
                colors: [
                    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
                    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
                ]
            }
        };

        const layout = {
            title: `Top 5 Countries with Most EV Charging Points (${selectedYear === "all" ? "All Years" : selectedYear})`,
            margin: { l: 50, r: 50, t: 100, b: 50 }
        };

        Plotly.newPlot("pieChart", [trace], layout);
        console.log("Filtered Data:", filteredData);
        console.log("Region Data:", regionData);
        console.log("Valid Data:", validData);
    }

    // Initial plot for pie chart
    updatePieChart("all");

    yearDropdown.on("change", function () {
        const selectedYear = d3.select(this).property("value");
        updatePieChart(selectedYear);
    });
});