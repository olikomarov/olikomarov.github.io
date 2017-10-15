
var cnt = 0;
var curr_header = '';

var years_files = 'countries_1995_2012.json';
var file = 'countries_2012.json';


d3.json(years_files, function (errorYears, yearsData) {

    d3.json(file, function (error, data) {

        var desired_cols = ['name', 'continent', 'gdp', 'life_expectancy', 'population', 'year']

        var columns = desired_cols;

        var maxYear, minYear;

        // ultra HARD year finder
        yearsData.forEach(function (countryModel) {
            countryModel.years.forEach(function (model) {
                if (model.year > maxYear || !maxYear) {
                    maxYear = model.year;
                }

                if (model.year < minYear || !minYear) {
                    minYear = model.year;
                }
            })
        }, this);


        d3.select('.range-selector')
            .attr('min', minYear)
            .attr('value', minYear)
            .attr('max', maxYear);


        d3.select('.max-year-value')
            .text(maxYear);


        d3.select('.min-year-value')
            .text(minYear);


        var table = d3.select("body").append("table"),
            thead = table.append("thead")
                .attr("class", "thead");
        tbody = table.append("tbody");

        table.append("caption")
            .html("World Countries Ranking");

        d3.selectAll(".myCheckbox").on("change", update);

        d3.selectAll('.agg-selector').on("change", update);
        d3.select('.range-selector').on("change", update);

        var aggType = 'none';

        function setAgg() {

            d3.selectAll(".agg-selector").each(function (d) {
                rb = d3.select(this);
                if (rb.property('checked')) {
                    aggType = rb.property("value");
                }
            });

        }

        function update() {

            d3.select('thead').remove();
            d3.select('tbody').remove();


            thead = table.append("thead")
                .attr("class", "thead");

            tbody = table.append("tbody");

            var yearSlider = d3.select('.range-selector'),
                selectedYear = +yearSlider.property('value');

            var choices = [];
            d3.selectAll(".myCheckbox").each(function (d) {
                cb = d3.select(this);
                if (cb.property("checked")) {
                    choices.push(cb.property("value"));
                }
            });

            setAgg();


            if (choices.length == 0) {
                choices = ['Americas', 'Africa', 'Asia', 'Europe', 'Oceania'];
            }


            var filteredData = data.filter(function (model) {
                return choices.indexOf(model.continent) != -1
            })

            var resultData = filteredData;

            resultData = resultData.map(function (countryModel) {
                var yearData;
                yearsData.forEach(function (yearsInfoModel) {
                    if (countryModel.name == yearsInfoModel.name) {
                        yearsInfoModel.years.forEach(function (yearInfo) {
                            if (yearInfo.year == selectedYear)
                                yearData = yearInfo
                        })
                    }

                });

                return Object.assign(countryModel, yearData);

            });



            if (aggType == 'byCont') {
                resultData = d3.nest()
                    .key(function (d) { return d.continent; })
                    .rollup(function (leaves) {
                        var resultModel = {
                            gdp: 0,
                            continent: leaves[0].continent,
                            name: leaves[0].continent,
                            life_expectancy: 0,
                            population: 0,
                            year: leaves[0].year
                        };
                        leaves.forEach(function (model) {
                            resultModel.gdp += model.gdp;
                            resultModel.population += model.population;
                        });

                        resultModel.life_expectancy = d3.mean(leaves, function (l) { return l.life_expectancy })

                        return resultModel;
                    }) // Where aggregation happens
                    .entries(resultData);

                //adapt data;
                resultData = resultData.map(function (obj) {
                    return obj.value
                });
            }


            var rows = tbody.selectAll("tr.row")
                .data(resultData)
                .enter()
                .append("tr").attr("class", "row");



            var cells = rows.selectAll("td")
                .data(function (row) {
                    return d3.range(columns.length).map(function (column, i) {
                        if (column == 2) {
                            return d3.format(".3s")(row[columns[i]]);
                        }
                        if (column == 3) {
                            return d3.format(".1f")(row[columns[i]]);
                        }
                        if (column == 4) {
                            return d3.format(",")(row[columns[i]]);
                        }

                        return row[columns[i]];
                    });
                });
            cells.enter()
                .append("td")
                .text(function (d) { return d; });

            cells.exit().remove();

            var normalizedColumns = columns.map(c => c.replace("_", ' '));


            thead.append("tr").selectAll("th")
                .data(normalizedColumns).enter().append("th").text(function (d) { return d; }).on("click", function (header, i) {

                    d3.select("img").remove();

                    if (header == curr_header) {
                        cnt++;

                        if (cnt % 2 == 1) {
                            d3.select(this).append('img').attr('src', '2.png');
                            d3.select(this).style("cursor", "n-resize");
                            tbody.selectAll("tr").sort(function (a, b) {
                                if (header == 'continent') {

                                    return d3.ascending(a[header] + a['name'], b[header] + b['name']);
                                }
                                return d3.ascending(a[header], b[header]);
                            });

                        }
                        else {
                            d3.select(this).append('img').attr('src', '1.png');

                            tbody.selectAll("tr").sort(function (a, b) {
                                if (header == 'continent') {
                                    return d3.descending(a[header] + a['name'], b[header] + b['name']);
                                }

                                return d3.descending(a[header], b[header]);
                            });
                        }
                    }

                    else {

                        d3.select(this).append('img').attr('src', '1.png');
                        cnt = 0;
                        curr_header = header;
                        tbody.selectAll("tr").sort(function (a, b) {
                            if (header == 'continent') {
                                return d3.descending(a[header] + a['name'], b[header] + b['name']);
                            }
                            return d3.descending(a[header], b[header]);
                        });
                    }

                });

        }

        update();

    });
})
