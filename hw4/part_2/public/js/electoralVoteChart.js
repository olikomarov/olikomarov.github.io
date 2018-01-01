
class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor (shiftChart){
        this.shiftChart = shiftChart;

        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width",this.svgWidth)
            .attr("height",this.svgHeight)


    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (party) {
        if (party == "R"){
            return "republican";
        }
        else if (party == "D"){
            return "democrat";
        }
        else if (party == "I"){
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

   update (electionResult, colorScale){

        // ******* TODO: PART II *******

        //Group the states based on the winning party for the state;
        //then sort them based on the margin of victory
        let independentStates = [];
        let RDstates = [];
        electionResult.forEach(function(element) {
          if(element.RD_Difference == 0) {
            independentStates.push(element);
          }
          else { RDstates.push(element); }
        })
        RDstates.sort(function(a,b) {
          return d3.ascending(parseFloat(a.RD_Difference), parseFloat(b.RD_Difference));
        })
        let sortedResults = [];
        sortedResults = sortedResults.concat(independentStates)
        sortedResults = sortedResults.concat(RDstates);
        console.log(sortedResults)


    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.
    let length = 0;
    let scaleNum = 3.3;
    this.svg.selectAll('rect').remove()
    this.svg.selectAll('rect')
            .data(sortedResults)
            .enter()
            .append('rect')
            .attr('class', 'electoralVotes')
            .attr('id', (d) => {
              return d.Abbreviation;
            })
            .attr('x', (d) => {
              let temp = length;
              length += d.Total_EV*scaleNum;
              return temp+25;
            })
            .attr('width', (d) => {
              return d.Total_EV*scaleNum;
            })
            .attr('height', 40)
            .attr('y', 60)
            .attr('fill', (d) => {
              if(d.RD_Difference == 0) {return '#45AD6A'}
              else {
                return colorScale(d.RD_Difference)
              }
            })


    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary
    let R_total = sortedResults[0].R_EV_Total;
    let D_total = sortedResults[0].D_EV_Total;
    let I_total = sortedResults[0].I_EV_Total;
    let totals = [[I_total, 'I'], [D_total, 'D'], [R_total, 'R']];
    length = 0;
    this.svg.selectAll('svg').remove()
    let svgs = this.svg.selectAll('svg')
            .data(totals)
            .enter()
            .append('svg')
            .attr('width', (d) => {
              if(d[0]=="") { return 0; }
              return parseInt(d[0])*scaleNum;
            })
            .attr('height', 40)
            .attr('x', (d) => {
              if(d[0]=="") {return 0;}
              let temp = length;
              length += parseInt(d[0])*scaleNum;
              return temp+25;
            })
            .attr('y', 20)
      let count = 0;
      svgs.append('text')
            .attr('class', (d) => {
              return this.chooseClass(d[1])
            })
            .text(function(d) {
              return d[0];
            })
            .style('font-size', "25px")
            .attr('y', 30)
            .attr('x', (d) => {
              if (count < 2) {
                count += 1;
                return 0;
              }
              else {
                return "99%";
              }
            })

        let middlesvg = this.svg.append('svg')
                  .attr('width', 300)
                  .attr('height', 100)
                  .attr('x', length/2-140)
                  .attr('y', 25)
        middlesvg.append('text')
                  .text('Electoral Vote (270 needed to win)')
                  .attr('class', 'electoralVotesNote')
                  .attr('x', '50%')
                  .attr('y', 15)
                  .style('font-size', "16px")
        middlesvg.append('rect')
                  .attr('width', 2)
                  .attr('height', 60)
                  .attr('x', '50%')
                  .attr('y', 25)
                  .attr('class', 'middlePoint')

    console.log(sortedResults[0].state)
    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
    // console.log(+this.svg.attr("width"))
    //  var maxX  = +this.svg.attr("width")
    // var maxY = +this.svg.attr("height")
    let shiftChart = this.shiftChart;
    let brushed = function() {
       let selection = d3.event.selection;
       let nextIndex = 0
       let beginning=0;
       let end = 25;
       let selectedStates = [];
       let regionBool = false;
       let selectionIndex = 0;
      for(let j=0; j<sortedResults.length; j++) {
        beginning = end;
        end = beginning+ parseInt(sortedResults[j].Total_EV)*scaleNum;
        if(selection[0]>=beginning && selection[0]<=end) {
          selectedStates.push(sortedResults[j].State)
          regionBool = true;
          selectionIndex = 1;
        }
        else if(selection[1]>=beginning && selection[1]<=end && regionBool==true) {
          selectedStates.push(sortedResults[j].State)
          break;
        }
        else if(regionBool==true) {
          selectedStates.push(sortedResults[j].State)
        }
      }
      shiftChart.update(selectedStates)
     }


    if(I_total =="") {
      I_total = "0";
    }
    var maxScale = (parseInt(I_total) + parseInt(R_total) + parseInt(D_total))*scaleNum;
    maxScale = Math.floor(maxScale)
    let brush = d3.brushX()
        .extent([[25, 50], [maxScale+25, 110]])
        .on("end", brushed);
        this.svg.append("g")
              .attr("class", "brush")
              .call(brush)
    };



}
