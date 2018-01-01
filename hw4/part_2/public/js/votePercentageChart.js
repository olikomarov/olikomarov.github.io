/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor(){
	    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
	    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

	    //fetch the svg bounds
	    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
	    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
	    this.svgHeight = 200;

	    //add the svg to the div
	    this.svg = divvotesPercentage.append("svg")
	        .attr("width",this.svgWidth)
	        .attr("height",this.svgHeight)

    }


	/**
	 * Returns the class that needs to be assigned to an element.
	 *
	 * @param party an ID for the party that is being referred to.
	 */
	chooseClass(data) {
	    if (data == "R"){
	        return "republican";
	    }
	    else if (data == "D"){
	        return "democrat";
	    }
	    else if (data == "I"){
	        return "independent";
	    }
	}

	/**
	 * Renders the HTML content for tool tip
	 *
	 * @param tooltip_data information that needs to be populated in the tool tip
	 * @return text HTML content for toop tip
	 */
	tooltip_render (tooltip_data) {
	    let text = "<ul>";
	    tooltip_data.result.forEach((row)=>{
        if(row.votecount != "") {
          text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+" ("+row.percentage+")" + "</li>"
        }
	    });
	    return text;
	}

	/**
	 * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
	 *
	 * @param electionResult election data for the year selected
	 */
	update (electionResult, colorScale){


	        //for reference:https://github.com/Caged/d3-tip
	        //Use this tool tip element to handle any hover over the chart
	        let tip = d3.tip().attr('class', 'd3-tip')
	            .direction('s')
	            .offset(function() {
	                return [0,0];
	            })
	            .html((d)=> {

	                // populate data in the following format
	                 let tooltip_data = {
  	                  "result":[
  	                  {"nominee": electionResult['D_Nominee_prop'],"votecount": electionResult['D_Votes_Total'],"percentage": electionResult['D_PopularPercentage'],"party":"D"} ,
  	                  {"nominee":  electionResult['R_Nominee_prop'],"votecount": electionResult['R_Votes_Total'],"percentage": electionResult['R_PopularPercentage'],"party":"R"} ,
  	                  {"nominee": electionResult['I_Nominee_prop'],"votecount": electionResult['I_Votes_Total'],"percentage": electionResult['I_PopularPercentage'],"party":"I"}
  	                  ]
	                  }
	                  // pass this as an argument to the tooltip_render function then,
	                  // return the HTML content returned from that method.
	                 return this.tooltip_render(tooltip_data)

	            });


   			  // ******* TODO: PART III *******

		    //Create the stacked bar chart.
		    //Use the global color scale to color code the rectangles.
		    //HINT: Use .votesPercentage class to style your bars.
        this.svg.call(tip)
        let data = [['I_Nominee_prop', 'I_PopularPercentage', 'I_Votes_Total'],
          ['D_Nominee_prop', 'D_PopularPercentage', 'D_Votes_Total'], ['R_Nominee_prop', 'R_PopularPercentage', 'R_Votes_Total']]
        let count = 0;
        let length = 0;
        let totalLength = 1800;
        this.svg.selectAll('rect').remove();
        this.svg.selectAll('rect')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', (d)=>{
                 return this.chooseClass(d[0].substring(0,1))
                })
                .attr('x', (d) => {

                  let percent = parseFloat(electionResult[d[1]].substring(0,electionResult[d[1]].length-1));
                  percent = percent/100
                  if(isNaN(percent)) { return 0; }
                  if(count==0) {
                    count += 1;
                    length += 25+percent*totalLength;
                    return 25;
                  }
                  else{

                    let temp = length
                    length += percent*totalLength;

                    return temp;
                  }
                })
                .attr('y', 125)
                .attr('width', (d) => {

                  let percent = parseFloat(electionResult[d[1]].substring(0,electionResult[d[1]].length-1));
                  percent = percent/100
                  if (!isNaN(percent)) {
                    return percent*totalLength;
                  }
                  else { return 0; }
                  //return Math.floor(electionResult[d[1]])// /100
                })
                .attr('height', 40)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
        length = 0;
        count = 0;
        let count2 = 0;
        this.svg.selectAll('svg').remove()
        let svgs = this.svg.selectAll('svg')
                .data(data)
                .enter()
                .append('svg')
                .attr('x', (d) => {

                  let percent = parseFloat(electionResult[d[1]].substring(0,electionResult[d[1]].length-1));
                  percent = percent/100
                  if(isNaN(percent)) { return 0; }
                  if(count==0) {
                    count += 1;
                    length += 25+percent*totalLength;
                    return 25;
                  }
                  else {
                    count += 1;
                    let temp = length
                    length += percent*totalLength;
                    return temp;
                  }

                })
                .attr("width", (d) => {
                  let percent = parseFloat(electionResult[d[1]].substring(0,electionResult[d[1]].length-1));

                  percent = percent/100
                  if (!isNaN(percent)) {
                    if(count2==0) {
                      count2 += 1;
                      return percent*length+electionResult[d[1]].length*20;
                    }

                    count2 += 1;
                    return percent*length;
                  }
                  else { return 0; }
                })
                .attr("height",80)
                .attr('y', 50)
        count = 0;
              svgs.append('text')
                .text((d) => {

                  return electionResult[d[1]]
                })
                .attr('x',(d) => {

                  if (count < 2) {
                    count += 1;
                    return 5;
                  }
                  else {
                    return "98%"
                  }
                })
                .attr('y', 70)
                .attr('class', (d)=>{
                  return this.chooseClass(d[0].substring(0,1))
                })
                .style('font-size', "25px")
              count = 0;

              svgs.append('text')
                .text((d) => {

                  return electionResult[d[0]]
                })
                .attr('x',(d) => {

                  if (count == 0) {
                    count += 1;
                    return 5;
                  }
                  else if (count == 1) {
                    count += 1;
                    return '15%';
                  }
                  else {
                    return "99%"
                  }
                })
                .attr('y', 30)
                .attr('class', (d)=>{
                  return this.chooseClass(d[0].substring(0,1))
                })
                .style('font-size', "25px")

      let middlesvg = this.svg.append('svg')
                .attr('width', 200)
                .attr('height', 100)
                .attr('x', length/2-105)
                .attr('y', 90)
      middlesvg.append('text')
                .text('Popular Vote 50%')
                .attr('class', 'yeartext')
                .attr('x', '50%')
                .attr('y', 15)
                .style('font-size', "16px")
      middlesvg.append('rect')
                .attr('width', 2)
                .attr('height', 60)
                .attr('x', '50%')
                .attr('y', 25)
                .attr('class', 'middlePoint')



		    //Display the total percentage of votes won by each party
		    //on top of the corresponding groups of bars.
		    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
		    // chooseClass to get a color based on the party wherever necessary

		    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
		    //HINT: Use .middlePoint class to style this bar.

		    //Just above this, display the text mentioning details about this mark on top of this bar
		    //HINT: Use .votesPercentageNote class to style this text element

		    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
		    //then, vote percentage and number of votes won by each party.

		    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

	};


}
