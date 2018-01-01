
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners, shiftChart) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        // the data
        this.electionWinners = electionWinners;
        this.shiftChart = shiftChart;
        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass (data) {
        if (data == "R") {
            return "yearChart republican";
        }
        else if (data == "D") {
            return "yearChart democrat";
        }
        else if (data == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update () {

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

        //Global colorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

       // ******* TODO: PART I *******

    // Create the chart by adding circle elements representing each election year
    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.
    let circleCenter = 30;
    this.svg.selectAll('line')
            .data(this.electionWinners)
            .enter()
            .append('line')
            .attr('class', 'lineChart')
            .attr('x1', function(d,i) {return 135*i+85})
            .attr('x2', function(d,i) {return 135*i+205})
            .attr('y1', circleCenter)
            .attr('y2', circleCenter)
    this.svg.append('line')
            .attr('class', 'lineChart')
            .attr('x1', 15)
            .attr('x2', 70)
            .attr('y1', circleCenter)
            .attr('y2', circleCenter)
    this.svg.selectAll('circle')
            .data(this.electionWinners)
            .enter()
            .append('circle')
            .attr('class', (d) => {
              return this.chooseClass(d['PARTY']);
              })
            .attr('r', 20)
            .attr('cy', circleCenter)
            .attr('cx', function(d,i) {return 135*i+70;})
            .attr('cursor', "pointer")

            .on('click', (d,i) => {
              d3.csv('data/Year_Timeline_'+d['YEAR']+'.csv', (error, electionResults) => {
                this.tileChart.update(electionResults, this.colorScale)
                this.electoralVoteChart.update(electionResults, this.colorScale)
                this.votePercentageChart.update(electionResults[i], this.colorScale)
              });
              this.svg.selectAll('.highlighted').remove()
              this.svg.selectAll('.highlighted2').remove()

              this.svg.append('circle')
                      .attr('class', this.chooseClass(d['PARTY'])+" highlighted2")
                      .attr('r', 22)
                      .attr('cy', circleCenter)
                      .attr('cx', 135*i+70)
                      .attr('cursor', "pointer")

              this.svg.append('circle')
                      .attr('fill', 'none')
                      .classed('highlighted', true)
                      .attr('cx', i*135+70)
                      .attr('cy', circleCenter)
                      .attr('r', 22)
                      .attr('cursor', "pointer")
            })

            .on('mouseover', (d,i) => {
              this.svg.selectAll('.highlighted3').remove()
              this.svg.append('circle')
                      .attr('fill', 'none')
                      .classed('highlighted3', true)
                      .attr('cx', i*135+70)
                      .attr('cy', circleCenter)
                      .attr('r', 20)
                      .attr('stroke', '#404040')
                      .attr('stroke-width', 3)

            })

            .on('mouseout', (d) => {
              this.svg.selectAll('.highlighted3').remove()
            })


    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements
    this.svg.selectAll('text')
            .data(this.electionWinners)
            .enter()
            .append('text')
            .classed('.yeartext', true)
            .attr('y', circleCenter+40)
            .attr('x', function(d,i) {return 135*i+52;})
            .text(function(d) {return d['YEAR']})
    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
    let space = 135;
    let shiftChart = this.shiftChart;
    let winners = this.electionWinners;
    let brushed = function() {
       let selection = d3.event.selection;


       let center = 70;
       let nextCenter = space+center;
       let selectedYears = [];
       let regionBool = false;
      for(let j=0; j<winners.length; j++) {

        if(selection[0]<=center && regionBool == false) {

          selectedYears.push(winners[j]['YEAR'])
          regionBool = true;
        }
        else if(selection[1]>=center && selection[1]<nextCenter && regionBool==true) {

          selectedYears.push(winners[j]['YEAR'])
          break;
        }
        else if (regionBool==true) {

          selectedYears.push(winners[j]['YEAR'])
        }
        center = center + space;
        nextCenter = nextCenter+space;
      }
      
      shiftChart.update(selectedYears)
     }

    var maxScale = 2600;
    let brush = d3.brushX()
        .extent([[14, 50], [maxScale+25, 80]])
        .on("end", brushed);
        this.svg.append("g")
              .attr("class", "brush")
              .call(brush)
    };

};
