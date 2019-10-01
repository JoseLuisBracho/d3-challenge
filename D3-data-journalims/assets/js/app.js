// @TODO: YOUR CODE HERE!

function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }

    var svgWidth = parseInt(d3.select("#scatter").style("width"));
    var svgHeight = svgWidth - svgWidth / 4;

    var margin = {
        top: 65,
        right: 65,
        bottom: 100,
        left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG element,
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    // =============  Functions to render object when event click happens ==============

    // Function to update y scale when click on variable y.
    function xScale(dataSet, xAxisSelected) {
    // Create scale
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(dataSet, d => d[xAxisSelected]) * 0.9,
        d3.max(dataSet, d => d[xAxisSelected]) * 1.1])
        .range([0, width]);

    return xLinearScale;
    }

    // Function to update y scale when click on variable y.
    function yScale(dataSet, yAxisSelected) {
        // Create y scale
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(dataSet, d => d[yAxisSelected]) * 0.9,
            d3.max(dataSet, d => d[yAxisSelected]) * 1.1])
        .range([height, 0]);

    return yLinearScale;
    }

    // Update X position of circles when click on variable
    function renderXCircles(circlesGroup, newXScale, xAxisSelected) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[xAxisSelected]));
        return circlesGroup;
    }

    // Update Y position of circles when click on variable
    function renderYCircles(circlesGroup, newYScale, yAxisSelected) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cy", d => newYScale(d[yAxisSelected]));
        return circlesGroup;
    }

    // Update X position of text when click on variable
    function renderXText(textGroup, newXScale, xAxisSelected) {

        textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[xAxisSelected]));
        return textGroup;
    }

    // Update Y position of text when click on variable
    function renderYText(textGroup, newYScale, yAxisSelected) {

        textGroup.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[yAxisSelected]));
        return textGroup;
    }

// Read CSV
d3.csv("assets/data/data.csv")
    .then(function(journalData) {

    // Inicializacion de parametros
    var dataSet = journalData;
    var xAxisSelected = "poverty";
    var yAxisSelected = "healthcare";


    // parse data
    dataSet.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = parseInt(data.income);
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.obesity = parseInt(data.obesity);
        console.log(data.poverty);
      });
      
    // create scales
    var xLinearScale = xScale(dataSet, xAxisSelected);
    var yLinearScale = yScale(dataSet, yAxisSelected);

    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);


    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[xAxisSelected]))
        .attr("cy", d => yLinearScale(d[yAxisSelected]))
        .attr("r", "10")
        .classed("stateCircle", true);
         
    var textGroup = chartGroup.selectAll("text")
        .data(dataSet)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[xAxisSelected]))
        .attr("y", d => yLinearScale(d[yAxisSelected]))
        .classed("stateText", true)
        .style("font-size", "10px")
        .attr("dy", "0.35em")
        .text(function(d) {
            return (d.abbr);
        });

    // append axes
    var xx = chartGroup.append("g");
    xx
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    var yy = chartGroup.append("g");
    yy
        .call(yAxis);

    // Create group for x- axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .style("font-size", "16px")
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .style("font-size", "16px")
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .style("font-size", "16px")
        .classed("inactive", true)
        .text("Household Income (Median)");

    // create and append y axis
    var yLabelsGroup = chartGroup.append("g");
    var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height / 2))
        .attr("value", "healthcare")
        .attr("dy", "1em")
        .style("font-size", "16px")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    var smokesLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 30)
        .attr("x", 0 - (height / 2))
        .attr("value", "smokes")
        .attr("dy", "1em")
        .style("font-size", "16px")
        .classed("inactive", true)
        .text("Smokes (%)");

    var obesityLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("value", "obesity")
        .attr("dy", "1em")
        .style("font-size", "16px")
        .classed("inactive", true)
        .text("Obese (%)");


    // Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);
        })
        .attr("class", "d3-tip");

    // Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
    // Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });

    // Change paragraph texts
    
    var paragraph = d3.select(".article").selectAll("p");
    var texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
                "This plot shows that healthcare increases as poverty increases. It is more obvious in southeast states from Florida to Kentucky.",
                ""];
    paragraph
        .data(texts)
        .text(d => d);


// ===============================================================

    // x axis labels event listener
    xLabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== xAxisSelected) {

        // replaces x variable with value
        xAxisSelected = value;

        // updates x scale for new data
        xLinearScale = xScale(dataSet, xAxisSelected);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, xAxisSelected);
        textGroup = renderXText(textGroup, xLinearScale, xAxisSelected);

        // Create x new axis
        xAxis = d3.axisBottom(xLinearScale);

        // append new x axes with a transition
        xx.transition().duration(1000).call(xAxis);

        // Change formatting in x label
        if (xAxisSelected === "poverty"){
            povertyLabel
                .classed("active", true)
                .classed("inactive", false);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (xAxisSelected === "age"){
            console.log("Existe el objeto poverty");
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", true)
                .classed("inactive", false);
            incomeLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (xAxisSelected === "income"){
            povertyLabel
                .classed("active", false)
                .classed("inactive", true);
            ageLabel
                .classed("active", false)
                .classed("inactive", true);
            incomeLabel
                .classed("active", true)
                .classed("inactive", false);
        };

        if (xAxisSelected=="poverty" && yAxisSelected=="healthcare"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that healthcare increases as poverty increases. It is more obvious in southeast states from Florida to Kentucky.",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="poverty" && yAxisSelected=="smokes"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that smokers increases as poverty increases. The most smokers states are West Virginia, Kentucky, Arkansas, Tennessee and Louissiana. About 25% of the population smoke in those states. Again, Utah is the less smokers state",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="poverty" && yAxisSelected=="obesity"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that obesity increases as poverty increases. As usual there some exceptions like a Washington DC, Colorado, Hawaii and Massachusetts whose obesity stay low",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="age" && yAxisSelected=="healthcare"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that healthcare decreases as age increases. We can say that Texas in out of the trend, it's a state with a great amount of healthcare. Although there are some exception like a Arkansas, Utah, Washington and North Dakota with low healthcare at relatively low age",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="age" && yAxisSelected=="smokes"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that there is no a correlation between the age of the people and the % of smokers indicating that young people in the United States smoke with an exception that is Utah state. ",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="age" && yAxisSelected=="obesity"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that there is no correlation betwee obesity and age. Again, a point is that many young people is obese in some states like Arkansas and Texas, a situation to take into account. Again, in states like Washington DC, Colorado and Hawaii people is not obese regarding the age",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="income" && yAxisSelected=="healthcare"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that there is a no clear relationship because the data is very spread out, although in general, we can say that healthcare decreases as income increases.",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="income" && yAxisSelected=="smokes"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that smokers decreases as income increases. The states with the greater income are Maryland, New Jersey, Washington DC, Connecticut, Hawaii and Massachusetts; Eastern states but Hawaii",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="income" && yAxisSelected=="obesity"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that obesity decreases as income increases. The states with the lowest income are from the southeast part of the country",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }

        }

    }); // Close on.click

// =============================================================

    // y axis labels event listener
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== yAxisSelected) {

        // replaces y variable with value
        yAxisSelected = value;

        // updates y scale for new data
        yLinearScale = yScale(dataSet, yAxisSelected);

        // updates circles with new x values
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, yAxisSelected);
        textGroup = renderYText(textGroup, yLinearScale, yAxisSelected);

        // Make new y axis
        yAxis = d3.axisLeft(yLinearScale);

        // Make a transtion when render new y axis
        yy.transition().duration(1000).call(yAxis);

        // Change formatting in x label
        if (yAxisSelected === "healthcare"){
            healthcareLabel
                .classed("active", true)
                .classed("inactive", false);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (yAxisSelected === "smokes"){
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", true)
                .classed("inactive", false);
            obesityLabel
                .classed("active", false)
                .classed("inactive", true);
        }
        else if (yAxisSelected === "obesity"){
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            obesityLabel
                .classed("active", true)
                .classed("inactive", false);
        };

        if (xAxisSelected=="poverty" && yAxisSelected=="healthcare"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that healthcare increases as poverty increases. It is more obvious in southeast states from Florida to Kentucky.",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="poverty" && yAxisSelected=="smokes"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that smokers increases as poverty increases. The most smokers states are West Virginia, Kentucky, Arkansas, Tennessee and Louissiana. About 25% of the population smoke in those states. Again, Utah is the less smokers state",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="poverty" && yAxisSelected=="obesity"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that obesity increases as poverty increases. As usual there some exceptions like a Washington DC, Colorado, Hawaii and Massachusetts whose obesity stay low",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="age" && yAxisSelected=="healthcare"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that healthcare decreases as age increases. We can say that Texas in out of the trend, it's a state with a great amount of healthcare. Although there are some exception like a Arkansas, Utah, Washington and North Dakota with low healthcare at relatively low age",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="age" && yAxisSelected=="smokes"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that there is no a correlation between the age of the people and the % of smokers indicating that young people in the United States smoke with an exception that is Utah state. ",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="age" && yAxisSelected=="obesity"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that there is no correlation betwee obesity and age. Again, a point is that many young people is obese in some states like Arkansas and Texas, a situation to take into account. Again, in states like Washington DC, Colorado and Hawaii people is not obese regarding the age",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="income" && yAxisSelected=="healthcare"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that there is a no clear relationship because the data is very spread out, although in general, we can say that healthcare decreases as income increases.",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="income" && yAxisSelected=="smokes"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that smokers decreases as income increases. The states with the greater income are Maryland, New Jersey, Washington DC, Connecticut, Hawaii and Massachusetts; Eastern states but Hawaii",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }
        else if (xAxisSelected=="income" && yAxisSelected=="obesity"){
            texts = ["This chart shows the relationships between health risks and personal social conditions. In the United Sates every state is different in this concerns, that is the reason why we did the analysis by state",
            "This plot shows that obesity decreases as income increases. The states with the lowest income are from the southeast part of the country",
            ""];
            paragraph
                .data(texts)
                .text(d => d);
        }

        }

    }); // Close on.click

    }); // Close csv. then
    
} // Close makeresponsive

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

