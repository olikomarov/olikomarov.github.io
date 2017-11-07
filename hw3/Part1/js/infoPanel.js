/** Class implementing the infoPanel view. */
class InfoPanel {
    /**
     * Creates a infoPanel Object
     */
    constructor() {
    }

    /**
     * Update the info panel to show info about the currently selected world cup
     * @param oneWorldCup the currently selected world cup
     */
    updateInfo(oneWorldCup) {

        // ******* TODO: PART III *******

        // Update the text elements in the infoBox to reflect:
        // World Cup Title, host, winner, runner_up, and all participating teams that year

        // Hint: For the list of teams, you can create an list element for each team.
        // Hint: Select the appropriate ids to update the text content.

        //Set Labels

        d3.select('#host').text(oneWorldCup.host);
        d3.select('#winner').text(oneWorldCup.winner);
        d3.select('#silver').text(oneWorldCup.runner_up);
        var teams = d3.select("#teams")
            .selectAll('li')
            .data(oneWorldCup.teams_names);

        teams.enter()
             .append("li")
             .sort( d3.ascending )
            .text(d=>d);

        teams.exit().remove();
           


    }

}