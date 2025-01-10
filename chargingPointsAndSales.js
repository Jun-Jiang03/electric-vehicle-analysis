// Load both datasets
Promise.all([
    d3.json("http://127.0.0.1:5000/api/v1.0/ev_charging_history"),
    d3.json("http://127.0.0.1:5000/api/v1.0/ev_sales_history")
]).then(([chargingData, salesData]) => {

    //console.log(chargingData); // Verify the data
    //console.log(salesData);    // Verify the data

    // Extract country names for the dropdown
    const countries = [...new Set(chargingData.map(d => d.region))];
    const dropdown = d3.select("#countrySelect");

    // Populate dropdown menu
    dropdown.selectAll("option")
        .data(countries)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // Set default country to "World" 
    const defaultCountry = "World";
    dropdown.property("value", defaultCountry);
    updateChart(defaultCountry);

    // Add event listener to update the chart on dropdown change
    dropdown.on("change", function () {
        const selectedCountry = this.value;
        updateChart(selectedCountry);
    });

    // Function to update chart based on selected country
    function updateChart(region) {
        const filteredSales = salesData.filter(d => d.region === region && d.year >= 2019 && d.year <=2023);
        const filteredCharging = chargingData.filter(d => d.region === region && d.year >= 2019 && d.year <=2023);

        // Prepare data for visualization
        const years = filteredSales.map(d => d.year);
        const sales = filteredSales.map(d => +d.volume);  // Ensure it's a number
        const chargingPoints = filteredCharging.map(d => +d.charging_points);  // Ensure it's a number

        // Prepare traces for Plotly
        const trace1 = {
            x: years,
            y: sales,
            type: 'bar',
            name: 'EV Sales',
            marker: {
                color: 'steelblue'
            },
            yaxis: 'y1',
            hovertemplate: 
                '<b>Year: %{x}</b><br>' + 
                'EV Sales: %{y}<br>' +
                '<extra></extra>'  // Hide the default trace name from the hover
        };

        const trace2 = {
            x: years,
            y: chargingPoints,
            mode: 'markers',
            name: 'Charging Points',
            marker: {
                color: 'orange',
                size: 10
            },
            yaxis: 'y2',
            hovertemplate: 
                '<b>Year: %{x}</b><br>' + 
                'Charging Points: %{y}<br>' +
                '<extra></extra>'  // Hide the default trace name from the hover
        };

        // Layout with dual y-axes
        const layout = {
            title: `EV Sales and Charging Points Over Time in ${region}`,
            xaxis: {
                title: 'Year'
            },
            yaxis: {
                title: 'EV Sales',
                side: 'left',
                showgrid: true,
                zeroline: false,
                //tickformat: ',.0f',
                //range: [0,50]
            },
            yaxis2: {
                title: 'Charging Points',
                side: 'right',
                overlaying: 'y',
                showgrid: false,
                zeroline: false
            },
            barmode: 'group',
            showlegend: false //remove legend
        };

        // Create the chart with Plotly
        Plotly.newPlot('salesAndChargingchart', [trace1, trace2], layout);
    }
});
