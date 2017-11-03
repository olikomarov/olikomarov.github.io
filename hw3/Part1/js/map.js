/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {

        this.projection = d3.geoConicConformal().scale(155).translate([400, 350]);
        this.map = d3.select('#map');
        this.mapPoints = d3.select('#points');

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css
        this.mapPoints.selectAll('circle')
            .remove();
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.

        this.map.selectAll('.team')
            .classed('team', false);

        this.map.selectAll('.host')
            .classed('host', false);

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.
        worldcupData.teams_iso.forEach(function(iso) {
            this.map.select(`#country-${iso}`)
                .classed("team",true);
        }, this);

        this.map.select(`#country-${worldcupData.host_country_code}`) 
            .classed('host', true);

        // Select the host country and change it's color accordingly.

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.



        // Add a marker for gold/silver medalists

        this.mapPoints
        .data([worldcupData.win_pos])
        .append('circle')        
		.attr("cx",  (d) => { return this.projection(d)[0]; })
		.attr("cy",  (d) => { return this.projection(d)[1]; })
		.attr("r", "8px")
		.classed("gold", true);

        this.mapPoints
        .data([worldcupData.ru_pos])
        .append('circle')
		.attr("cx",  (d) =>{ return this.projection(d)[0]; })
		.attr("cy",  (d) => { return this.projection(d)[1]; })
		.attr("r", "8px")
		.classed("silver", true);

    }

    /**
     * Renders the actual map
     * @param world the json data with the shape of all countries
     */
    drawMap(world) {

        //(note that projection is a class member
        // updateMap() will need it to add the winner/runner_up markers.)

        // ******* TODO: PART IV *******

        // Draw the background (country outlines; hint: use #map)
        // Make sure and add gridlines to the map


        var path = d3.geoPath().projection(this.projection);

        this.map.selectAll("path")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append("path")
            .attr('id', d => `country-${d.id}`)
            .classed("countries", true)
            .attr("d", path);

        var graticule = d3.geoGraticule();

        this.map.append("path")
            .datum(graticule)
            .style("fill", "none")
            .style("stroke", '#777')
            .style("stroke-width", '.5px')
            .style("stroke-opacity", 0.5)
            .attr("d", path);




        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's .id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

    }


}
