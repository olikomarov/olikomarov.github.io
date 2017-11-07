/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice(); // 

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null;

        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null;

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null;

        /**Ui mapping */
        this.ui = {};
        this.ui.$goalHeader = d3.select('#goalHeader')
            .append('svg')
            .attr('width', 150);

        this.ui.$tableBody = d3.select('#matchTable > tbody');

       

    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        let width = this.ui.$goalHeader.property('clientWidth')
        // Create the x axes for the goalScale.


        var goalScale = d3.scaleBand().rangeRound([0, width]);
        var goalsMax = d3.max(this.teamData, d => d.value["Goals Made"]);
        goalScale.domain(d3.range(0, goalsMax + 1));
        let axisX = d3.axisBottom(goalScale).tickValues(d3.range(0, goalsMax + 1, 2));

        this.ui.$goalHeader
            .call(axisX);

        this.goalScale = goalScale;

        
        //add GoalAxis to header of col 1.

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable(). 

 d3.select('#TeamNameSort')
            .on('click', e => {
                this.collapseList();

                if (this.sort == 'Name_A') {
                    this.sort = 'Name_D';
                }
                else {
                    this.sort = 'Name_A';
                }

                this.tableElements = this.tableElements.sort((a, b) => {
                    return this.sort === 'Name_A' ? a.key.localeCompare(b.key, "en") : b.key.localeCompare(a.key, "en");
                })
                this.updateTable();
                if (this.selected) {

                    this.tableElements.forEach(function (element, i) {
                        if (element.key === this.selected)
                            this.updateList(i);
                    }, this);

                }
            });

        d3.select('#GoalsSort')
            .on('click', e => {
                this.collapseList();

                if (this.sort == 'GoalsSort_A') {
                    this.sort = 'GoalsSort_D';
                }
                else {
                    this.sort = 'GoalsSort_A';
                }

                this.tableElements = this.tableElements.sort((a, b) => {
                    return this.sort === 'GoalsSort_A' ? a.value["Goals Made"] < b.value["Goals Made"] : a.value["Goals Made"] > b.value["Goals Made"];
                })
                this.updateTable();
                if (this.selected) {

                    this.tableElements.forEach(function (element, i) {
                        if (element.key === this.selected)
                            this.updateList(i);
                    }, this);

                }
            });

        d3.select('#WinsSort')
            .on('click', e => {
                this.collapseList();

                if (this.sort == 'WinsSort_A') {
                    this.sort = 'WinsSort_D';
                }
                else {
                    this.sort = 'WinsSort_A';
                }

                this.tableElements = this.tableElements.sort((a, b) => {
                    return this.sort === 'WinsSort_A' ? a.value["Wins"] < b.value["Wins"] : a.value["Wins"] > b.value["Wins"];
                })
                this.updateTable();
                if (this.selected) {

                    this.tableElements.forEach(function (element, i) {
                        if (element.key === this.selected)
                            this.updateList(i);
                    }, this);

                }
            });

        d3.select('#LosesSort')
            .on('click', e => {
                this.collapseList();

                if (this.sort == 'LosesSort_A') {
                    this.sort = 'LosesSort_D';
                }
                else {
                    this.sort = 'LosesSort_A';
                }

                this.tableElements = this.tableElements.sort((a, b) => {
                    return this.sort === 'LosesSort_A' ? a.value["Losses"] < b.value["Losses"] : a.value["Losses"] > b.value["Losses"];
                })
                this.updateTable();
                if (this.selected) {

                    this.tableElements.forEach(function (element, i) {
                        if (element.key === this.selected)
                            this.updateList(i);
                    }, this);

                }
            });


        d3.select('#TotalSort')
            .on('click', e => {
                this.collapseList();

                if (this.sort == 'TotalSort_A') {
                    this.sort = 'TotalSort_D';
                }
                else {
                    this.sort = 'TotalSort_A';
                }

                this.tableElements = this.tableElements.sort((a, b) => {
                    return this.sort === 'TotalSort_A' ? a.value["TotalGames"] < b.value["TotalGames"] : a.value["TotalGames"] > b.value["TotalGames"];
                })
                this.updateTable();
                if (this.selected) {

                    this.tableElements.forEach(function (element, i) {
                        if (element.key === this.selected)
                            this.updateList(i);
                    }, this);

                }
            });

    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable(needSort = true) {
        // ******* TODO: PART III *******
        //Create table rows
        var rows = this.ui.$tableBody
            .selectAll('tr')
            .data(this.tableElements, d => d.value.type == 'game' ? d.unique : d.key);


        rows.exit()
            .remove();


        let new_rows = rows.enter()
            .append('tr')
            .on("click", (d) => {
                // Здесь добавить обработку при шелчке на игру в 1/8 чм

                if (d.value.type == 'aggregate') {
                    this.tableElements.forEach((elem, i) => {
                        if (d.key === elem.key) {
                            this.updateList(i);
                            this.selected = d.key;
                            this.tree.updateTree(d)
                        }

                    })
                }
            })
            .attr('title', d => "Total Score: " + (d.value.Wins * 3 + (d.value.TotalGames - d.value.Wins - d.value.Losses) * 1))


        if (this.sort && needSort) {
            rows.sort((a, b) => {
                switch (this.sort) {
                    case 'Name_A':
                        return a.key.localeCompare(b.key, "en");

                    case 'Name_D':
                        return b.key.localeCompare(a.key, "en");
                    case "LosesSort_A":
                    case "LosesSort_D":
                        return this.sort === 'LosesSort_A' ? a.value["Losses"] < b.value["Losses"] : a.value["Losses"] > b.value["Losses"];
                    case "GoalsSort_A":
                    case "GoalsSort_D":
                        return this.sort === 'GoalsSort_A' ? a.value["Goals Made"] < b.value["Goals Made"] : a.value["Goals Made"] > b.value["Goals Made"];
                    case "WinsSort_A":
                    case "WinsSort_D":
                        return this.sort === 'WinsSort_A' ? a.value["Wins"] < b.value["Wins"] : a.value["Wins"] > b.value["Wins"];
                    case "TotalSort_A":
                    case "TotalSort_B":
                        return this.sort === 'TotalSort_A' ? a.value["TotalGames"] < b.value["TotalGames"] : a.value["TotalGames"] > b.value["TotalGames"];

                }

            });
        }

        //Appnd th elements for the Team Names

        var cells = new_rows.selectAll('td')
            .data(row => [
                { type: row.value.type, value: [row.key], vis: 'team_name' },
                { type: row.value.type, value: [row.value["Goals Made"], row.value["Goals Conceded"]], vis: 'goals' },
                { type: row.value.type, value: [row.value.Result.label], vis: 'round_result' },
                { type: row.value.type, value: [row.value.Wins], vis: 'wins' },
                { type: row.value.type, value: [row.value.Losses], vis: 'loses' },
                { type: row.value.type, value: [row.value.TotalGames], vis: 'total_games' },
            ]);

        var new_cells = cells.enter()
            .append('td')
            .text(d => {
                switch (d.vis) {
                    case "team_name":
                    case "round_result":
                        return d.value[0];
                }
            })
            .attr("class", d => {
                return d.type == 'game' ? "game" : ''
            });

        var width = 70, //new_cells.property('clientWidth'),
            height = 20;



        var g;
        var xScale = d3.scaleBand().rangeRound([0, width])
        var colorScale = d3.scaleLinear()
            .domain(0, width)
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#ece2f0"), d3.rgb('#016450')]);

        // Goals statistics

        g = new_cells.filter(d => d.vis == 'goals' && d.value[0] - d.value[1] != 0)
            .append('svg')
            .attr('width', this.ui.$goalHeader.property('clientWidth'))
            .attr('height', height)
            .append('g');


        g.append("rect")
            .attr("fill", d => d.value[0] - d.value[1] < 0 ? "#e07477" : "#6794af")
            .attr("width", d => {
                let minMax = d3.extent(d.value);
                return this.goalScale(minMax[1] - minMax[0]);
            })
            .attr('x', d => this.goalScale(d3.min(d.value)))
            .attr("height", 10)
            .attr("y", 6);


        g.append("circle")
            .attr("fill", d => d3.max(d.value) == d.value[0] ? '#cb181d' : '#034e7b')
            .attr("r", 6)
            .attr('cx', d => this.goalScale(d3.min(d.value)))
            .attr("cy", 11);

        g.append("circle")
            .attr("fill", d => d3.max(d.value) == d.value[1] ? '#cb181d' : '#034e7b')
            .attr("r", 6)
            .attr('cx', d => this.goalScale(d3.max(d.value)) + 6.5)
            .attr("cy", 11);


        g = new_cells.filter(d => d.vis == 'goals' && d.value[0] - d.value[1] == 0)
            .append('svg')
            .attr('width', this.ui.$goalHeader.property('clientWidth'))
            .attr('height', height)
            .append('g');

        g.append("circle")
            .attr("fill", 'gray')
            .attr("r", 6)
            .attr('cx', d => this.goalScale(d3.min(d.value)))
            .attr("cy", 11);

        // Games statistics

        xScale.domain(d3.range(0, d3.max(this.teamData, d => d.value.Wins) + 1));


        g = new_cells.filter(d => d.vis == 'wins')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g');

        g.append("rect")
            .attr("fill", d => colorScale(xScale(d.value[0])))
            .attr("width", function (d) { return xScale(d.value[0]); })
            .attr("height", height);

        g.append('text')
            .attr('x', function (d) { return xScale(d.value[0]) - 4; })
            .attr('y', 13)
            .attr('font-size', 12)
            .attr('fill', 'white')
            .attr('text-anchor', 'end')
            .text(d => d.value[0]);



        xScale.domain(d3.range(0, d3.max(this.teamData, d => d.value.Losses) + 1));

        g = new_cells.filter(d => d.vis == 'loses')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g');

        g.append("rect")
            .attr("fill", d => colorScale(xScale(d.value[0])))
            .attr("width", function (d) { return xScale(d.value[0]); })
            .attr("height", height);

        g.append('text')
            .attr('x', function (d) { return xScale(d.value[0]) - 4; })
            .attr('y', 13)
            .attr('font-size', 12)
            .attr('fill', 'white')
            .attr('text-anchor', 'end')
            .text(d => d.value[0]);


        xScale.domain(d3.range(0, d3.max(this.teamData, d => d.value.TotalGames) + 1));


        g = new_cells.filter(d => d.vis == 'total_games')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g');

        g.append("rect")
            .attr("fill", d => colorScale(xScale(d.value[0])))
            .attr("width", function (d) { return xScale(d.value[0]); })
            .attr("height", height);

        g.append('text')
            .attr('x', function (d) { return xScale(d.value[0]) - 4; })
            .attr('y', 13)
            .attr('font-size', 12)
            .attr('fill', 'white')
            .attr('text-anchor', 'end')
            .text(d => d.value[0]);

        cells.exit()
            .remove();

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}

        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

        //Only update list for aggregate clicks, not game clicks

        this.collapseList();
        let data = this.tableElements[i];

        let games = data.value.games.map(g => {
            return { key: 'x' + g.key, value: g.value, unique: g.key + "-" + data.key };
        })

        games.unshift(0);
        games.unshift(i + 1);

        this.tableElements.splice.apply(this.tableElements, games);
        this.updateTable(false);

    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        for (let i = 0; i < this.tableElements.length; i++) {
            let game = this.tableElements[i];

            if (game.value.type == 'game') {
                this.tableElements.splice(i, 1);
                i--;
            }
        }
    }


}
