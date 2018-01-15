d3.select("input[value=\"force\"]").on("click", force_layout);
d3.select("input[value=\"circular\"]").on("click", circular_layout);
d3.select("input[value=\"grouped\"]").on("click", grouped_layout);  
d3.select("input[value=\"norank\"]").on("click", force_layout);
d3.select("input[value=\"rank\"]").on("click", force_layout);
d3.select("input[value=\"growth\"]").on("click", force_layout);
d3.select("input[value=\"location\"]").on("click", force_layout);
d3.select("input[value=\"cir_gdp\"]").on("click", circular_layout);
d3.select("input[value=\"cir_pop\"]").on("click", circular_layout);
d3.select("input[value=\"cir_none\"]").on("click", circular_layout);
d3.select("input[value=\"cir_grouped\"]").on("click", circular_layout);
d3.select("input[value=\"gr_horizontal\"]").on("click", grouped_layout);
d3.select("input[value=\"gr_pie\"]").on("click", grouped_layout);
d3.select("input[value=\"gr_none\"]").on("click", grouped_layout);

var dataset = []; 
var selectedYear = ""; 
var selDataset = []; 
var selKey = "gdp"; 
var group_shape = "none"
var continents = ["Americas","Africa","Asia","Europe","Oceania"];

var margin = {top: 5, bottom: 5, left: 10, right: 10};
var width = 1500 - margin.left - margin.right;
var height = 1500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

var fill = d3.scale.category10();

var graph = {nodes: [], links: []};
var centroid_xy =[];

var nameScale = d3.scale.ordinal().rangeRoundBands([0, height], .8, 0);

var xScale = d3.scale.linear();
var yScale = d3.scale.linear();
var xScale_loc = d3.scale.linear();
var yScale_loc = d3.scale.linear();
var xyScale = d3.scale.linear();

var node_scale = d3.scale.linear();

var tmp_links = [];
var circular_layout_checked = false;

graph.nodes = d3.range(119).map(function() {  
  return { 
    cat: 1
  }; 
})

graph.nodes.forEach(function(d, i) {
    graph.links.push({"source": i, "target": 0 })
});


var force = d3.layout.force()
    .size([1200, 1000])
    .charge(-50)     
    .gravity(0.07) 
    .friction(0.9) 
    .on("tick", tick)
    .on("start", function(d) {}) 
    .on("end", function(d) {}) 

var diameter = 740,
    radius = diameter / 2,
    innerRadius = radius - 120;

var bundle = d3.layout.bundle();

var link = svg.selectAll(".link")

var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g").attr("class", "node")
    .on("mouseover", mouseovered)
    .on("mouseout", mouseouted);

node.append("circle")
    .attr("r", 5);

node.append("text")
		.attr("x", 10)
		.attr("y", 4)
		.attr("class","text")
		.text("test");

d3.json("data/countries_1995_2012.json", function(error, data){

		data.map(function(d,i){
		    for (i = 0; i < d.years.length; i++) {
            
            tmp_links = [];
            for (j = 0; j < d.years[i].top_partners.length; j++) {
                tmp_links.push({"source": d.country_id, "target": d.years[i].top_partners[j].country_id});
            }
		        var dat = {
		          name: d.name,
		          continent: d.continent,
		          gdp: d.years[i].gdp,
		          life_expectancy: d.years[i].life_expectancy,
		          population: d.years[i].population,
		          year: d.years[i].year,
              latitude: d.latitude,
              longitude: d.longitude,
              country_id: d.country_id,
              top_partners: tmp_links
		        };

            dataset.push(dat);
		    }

		});

		rangechanged("2012");

    force.nodes(graph.nodes)
       .start();

    sortingdata(selDataset,"gdp");
		graph_update_norank();

}); 

function tick(e) {


  switch(group_shape){
      case "gr_none":
        
        break;
      case "gr_horizontal":
        var k = 10 * e.alpha;
        graph.nodes.forEach(function(o, i) {
            switch(o.cont){
                case continents[0]: 
                    o.x -= k*2;
                    break;
                 case continents[1]: 
                    o.x -= k;
                    break;
                case continents[2]: 
                    //o.x +- 0
                    break;
                case continents[3]: 
                    o.x += k;
                    break;
                case continents[4]:
                    o.x += k*2;
                    break;             
            }
        });
        break;
      case "gr_pie":
          var k = 6 * e.alpha;

          graph.nodes.forEach(function(o, i) {

              switch(o.cont){
                  case continents[0]:
                      o.x += xyScale(centroid_xy[0].x)*k
                      o.y += xyScale(centroid_xy[0].y)*k
                      break;
                  case continents[1]:
                      o.x += xyScale(centroid_xy[1].x)*k
                      o.y += xyScale(centroid_xy[1].y)*k
                      break;
                  case continents[2]:
                      o.x += xyScale(centroid_xy[2].x)*k
                      o.y += xyScale(centroid_xy[2].y)*k
                      break;
                  case continents[3]:
                      o.x += xyScale(centroid_xy[3].x)*k
                      o.y += xyScale(centroid_xy[3].y)*k
                      break;
                  case continents[4]:
                      o.x += xyScale(centroid_xy[4].x)*k
                      o.y += xyScale(centroid_xy[4].y)*k
                      break;
                }
          });
          break;
  }

  node
    .attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })
  
}

function sortingdata(vdataset,keyval){
    selDataset = selDataset.sort(function(a, b) {
            return d3.descending(a[keyval], b[keyval]);
    });
}

function graph_update(duration) {

  node.transition().duration(duration)
      .attr("transform", function(d) { 
        return "translate("+d.x+","+d.y+")"; 
      })
      .attr("id",function(d){
      	return d.cat;
      })
      .select("text")
      .text(function(d){ return d.cat})

  
  var line = d3.svg.line.radial()
      .interpolate("bundle")
      .tension(.85)
      .radius(function(d) { return d.y; })
      .angle(function(d) { return d.x / 180 * Math.PI; });

  link = svg.selectAll(".link")
      .data(graph.links);

  link.enter().insert("line", "g.node") 
      .attr("class", "link")
      .attr("d", line); 

  var link = svg.selectAll(".link")
  link.transition().duration(duration)
    .attr("x1", function(d) { return d.target.x; })
    .attr("y1", function(d) { return d.target.y; })
    .attr("x2", function(d) { return d.source.x; })
    .attr("y2", function(d) { return d.source.y; });
}

function graph_update_norank() { 

  force.stop();

  nameScale.domain(selDataset.map(function(d) {
       return d.name;
  }));

  graph.nodes.forEach(function(d, i) {
    d.x = width/3;
    d.y = nameScale(selDataset[i].name);
    d.cat = selDataset[i].name;
    d.cont = selDataset[i].continent;
    d.pop = selDataset[i].population;
    d.gdp = selDataset[i].gdp;
    d.conid = selDataset[i].country_id;
  })

  graph_update(500);
}

function graph_update_rank() { 

  force.stop();

  var min = 0;
  if(selKey == "life_expectancy"){
      min = selDataset[selDataset.length-1][selKey];
  }

  node_scale
      .domain([min, selDataset[0][selKey]])
      .range([5, height-10]);

  graph.nodes.forEach(function(d, i) {
    d.x = width/3;
    d.y = height - node_scale(selDataset[i][selKey]);
    d.cat = selDataset[i].name;
  })

  graph_update(500);
}

function graph_update_growth() { 

  force.stop();

    xScale
      .domain([0,d3.max(selDataset.map(function(d) { return d.gdp; }))])
      .range([5, height-100]);
    yScale
      .domain([0,d3.max(selDataset.map(function(d) { return d.population; }))])
      .range([5, width-50]);

  graph.nodes.forEach(function(d, i) {
    d.x = xScale(selDataset[i].gdp);
    d.y = height - yScale(selDataset[i].population);
    d.cat = selDataset[i].name;
  })

  graph_update(500);
}

function graph_update_location() { 

  force.stop();

    xScale_loc
      .domain([-180,180])
      .range([0, width-20]);
    yScale_loc
      .domain([-180,180])
      .range([0, height]);

  graph.nodes.forEach(function(d, i) {
    d.x = xScale_loc(selDataset[i].longitude) -200;
    d.y = height - yScale_loc(selDataset[i].latitude);
    d.cat = selDataset[i].name;
  })
  graph_update(500);
}

function keyChanged(selVal){
    
    selKey = selVal.value 

    var selGraph = "";
    
    sortingdata(selDataset,selKey); 

    force_layout();
}

function force_layout(){

    var width = 1500 - margin.left - margin.right;
    var height = 1500 - margin.top - margin.bottom;

    circular_layout_checked = false; //mouse hover off

    var link = svg.selectAll(".link") 
            .attr("visibility","hidden"); 

    var selGraph = "";
    
    sortingdata(selDataset,selKey); 

    d3.selectAll("input").each(function(d) {
        if(d3.select(this).attr("name") == "ranking" && d3.select(this).node().checked) {
            selGraph = d3.select(this).attr("value");
        }
        if(d3.select(this).attr("value") == "force"){
            d3.select(this).property('checked', true);
        }
    });

    switch(selGraph){
      case("norank"):
          graph_update_norank();
          break;
      case("rank"):
          graph_update_rank();
          break;
      case("growth"):
          graph_update_growth();
          break;
      case("location"):
          graph_update_location();
          break;
    };
}

function circular_layout(){

    width = 1200 - margin.left - margin.right;
    height = 1200 - margin.top - margin.bottom;

    var link = svg.selectAll(".link")
            .attr("visibility","visible"); 

    graph.links = [];
    selDataset.forEach(function(e, i){
        e.top_partners.forEach(function(f){
            var sourceNode = graph.nodes.filter(function(n) { return n.conid === e.country_id; })[0];
            var targetNode = graph.nodes.filter(function(n) { return n.conid === f.target; })[0];
            graph.links.push({source: sourceNode, target: targetNode});
             
        });
    });
  
    link = svg.selectAll(".link")
            .data(graph.links);      

    force.nodes(graph.nodes)
        .links(graph.links)
        .start();

    force.stop();
   

    var sortkey_circle
    var grouped_circle
    d3.selectAll("input").each(function(d) {
        if(d3.select(this).attr("name") == "circle" && d3.select(this).node().checked) {
            sortkey_circle = d3.select(this).attr("value");
        }else if(d3.select(this).attr("name") == "circle2" && d3.select(this).node().checked) {
            grouped_circle = d3.select(this).attr("value");
        }
        if(d3.select(this).attr("value") == "circular"){
            d3.select(this).property('checked', true);
            circular_layout_checked = true;
        }
    });

    var arc = d3.svg.arc()
            
    var pie = d3.layout.pie()
    switch(sortkey_circle){
        case "cir_gdp":
            pie.sort(function(a, b) { return a.gdp - b.gdp;}) 
            break;
        case "cir_pop":
            pie.sort(function(a, b) { return a.pop - b.pop;}) 
            break;
    }
    pie.value(function(d, i) { 
        return 1;  
    });

    switch(grouped_circle){
        case "cir_none":
            var r = Math.min(height, width)/1.3;
            arc.outerRadius(r);

            pie(graph.nodes).map(function(d, i) {
              
              d.innerRadius = 0;
              d.outerRadius = r;

              
              d.data.x = arc.centroid(d)[0]+width/2;
              d.data.y = arc.centroid(d)[1]+height/2;

              return d.data;
            })
            break;
        case "cir_grouped":
            var r = 200;
            arc.outerRadius(r);

            get_centroid();

            continents.forEach(function(o,j){
                  pie(graph.nodes.filter(function(d){return d.cont == o })).map(function(d, i) {
                   
                  d.innerRadius = 0;
                  d.outerRadius = r;        

                  
                  d.data.x = arc.centroid(d)[0] + (centroid_xy[j].x *3) + width/2;
                  d.data.y = arc.centroid(d)[1] + (centroid_xy[j].y *3) + height/2;

                  return d.data;
                })
            });
            
            break;
    }

    graph_update(500);
}

function grouped_layout(){

  circular_layout_checked = false; 

  var link = svg.selectAll(".link") 
            .attr("visibility","hidden"); 

  
  d3.selectAll("input").each(function(d) {
      if(d3.select(this).attr("name") == "group" && d3.select(this).node().checked) {
          group_shape = d3.select(this).attr("value");
      }
      if(d3.select(this).attr("value") == "grouped"){
          d3.select(this).property('checked', true);
      }
  });

  if(group_shape == "gr_pie"){
      get_centroid();
  }

  graph.links = {target:1, source:1}
  force.nodes(graph.nodes)
    .links(graph.links)
    .start();
}

function create_piedata(){
    var piedata = [];
    
    continents.forEach(function(e){
        var count = selDataset.filter(function(d){return d.continent == e});
        piedata.push(count.length);
    })
 
    return piedata;
}

function get_centroid(){
    
    var piedata = create_piedata();

    var outerRadius = 250;
    var innerRadius = 0;
    var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
    
    var pie = d3.layout.pie();
    
    var arcs = svg.selectAll("g.arc")
            .data(pie(piedata))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
    
    
    arcs.append("path")
        .attr("fill", "transparent")
        .attr("stroke","black")
        .attr("d", arc)
        .attr("visibility","hidden"); 
    
    
    arcs.append("text")
        .attr("transform", function(d,i) {
          centroid_xy.push({x:arc.centroid(d)[0],y:arc.centroid(d)[1]})
          //console.log(centroid_xy)
          return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
          return d.value;
        })
        .attr("visibility","hidden");

    xyScale
          .domain([-125,125])
          .range([-2,2]);
}

function rangechanged(newVal){

    var indexed_data = []
    var tmpdata = []

    
    selectedYear = newVal;

    dataset.map(function(d,i){
        if (d.year == newVal){
            tmpdata.push(d);  
        }
        indexed_data[newVal] = tmpdata
    });

    
    selDataset = indexed_data[newVal];
    
    
};

function mouseovered(d) {
  if (circular_layout_checked == false){
    return;
  }
  node 
      .each(function(n) { 
        n.colored = false; });

  link = svg.selectAll(".link")
      .classed("link--colored", function(l) { 
         
          if (l.source === d) 
            return l.source.colored = true,l.target.colored = true; 
      })
      .filter(function(l) { 
        
        return l.source === d; 
      });

  node
      .classed("node--colored", function(n) { return n.colored; })
}

function mouseouted(d) {
  link
      .classed("link--colored", false)

  node
      .classed("node--colored", false)

}