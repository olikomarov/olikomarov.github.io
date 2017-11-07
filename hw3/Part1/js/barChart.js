/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;

        this.selectedIndex = null;
        this.selectedModel = null;

    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {



        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes

        // Create colorScale

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)

        var svg = d3.select("#barChart"),
            margin = { top: 20, right: 20, bottom: 30, left: 80 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svg.select("#bars")
            .attr("transform", "translate(" + margin.left + ", 0)");


        var maxDimensionValue = d3.max(this.allData, function (d) { return d[selectedDimension]; });

        x.domain(this.allData.sort((a, b) => d3.ascending(a.year, b.year)).map(function (d) { return d.year; }));
        y.domain([0, maxDimensionValue]);

        svg.select("#xAxis")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(" + margin.left + "," + height + ")")
            .call(d3.axisBottom(x).ticks(10, "%"))
            .selectAll('text')
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr('dy', -1);


        svg.select("#yAxis")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .attr("class", "axis axis--y")
            .transition()
            .ease(d3.easeSin)
            .duration(300)
            .call(d3.axisLeft(y));

        svg.select("#yAxis").append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text(selectedDimension + "");

        var bars = g.selectAll(".bar")
            .data(this.allData);

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", (d) => `rgba(50, 50, ${Math.round(200 - (130 / maxDimensionValue) * d[selectedDimension]) + 35}, 1)`)
            .attr("x", function (d) { return x(d.year); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return height - y(d[selectedDimension]); })
            .attr("y", function (d) { return y(d[selectedDimension]); })
            .on('click', (d, idx) => {
                if (this.selectedIndex !== null) {
                    g.select(`rect:nth-child(${this.selectedIndex + 1})`)
                        .classed('selected', false);
                }

                this.selectedIndex = idx;
                this.selectedModel = d;

                g.select(`rect:nth-child(${this.selectedIndex + 1})`)
                    .classed('selected', true);


                this.infoPanel && this.infoPanel.updateInfo(this.selectedModel);
                this.worldMap && this.worldMap.updateMap(this.selectedModel);
            })
            .exit()
            .remove();

        bars.transition()
            .duration(400)
            .attr("height", function (d) { return height - y(d[selectedDimension]); })
            .attr("y", function (d) { return y(d[selectedDimension]); })
            .attr("fill", (d) => `rgba(50, 50, ${Math.round(200 - (130 / maxDimensionValue) * d[selectedDimension]) + 35}, 1)`);




        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

    }
}