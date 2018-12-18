
var barChart = dc.barChart("#BarChart");
var lineChart = dc.lineChart('#LineChart');
var pieChart = dc.pieChart("#piechart");
var overviewChart1 = dc.lineChart("#overview1");
var rowchart = dc.rowChart("#rowchart");
d3.csv("data/co2_sector.csv", function(data) {
    data.forEach(function(d){
        d.Country = d.Country;
        d.Year = d.Year;
        d.Agriculture = +d.Agriculture;
        d.Energy = +d.Energy;
        d.Industry = +d.Industry;
        d.Residential = +d.Residential;
        d.Transport = +d.Transport;
        d.Waste = +d.Waste;
        d.Other = +d.Other;
        d.total = +d.total;


    });
    // group by country sum the emission
    var ndx = crossfilter(data);
    //Create Dimention
    var dimensionCountry = ndx.dimension(item => item.Country);
    var dimensionYear = ndx.dimension(item => item.Year);

    // group by country
    var AgriByCountry = dimensionCountry.group().reduceSum(item => item.Agriculture);
    var EnergyByCountry = dimensionCountry.group().reduceSum(item => item.Energy);
    var IndustByCountry = dimensionCountry.group().reduceSum(item => item.Industry);
    var ResidByCountry = dimensionCountry.group().reduceSum(item => item.Residential);
    var TransByCountry = dimensionCountry.group().reduceSum(item => item.Transport);
    var WasteByCountry = dimensionCountry.group().reduceSum(item => item.Waste);
    var OtherByCountry = dimensionCountry.group().reduceSum(item => item.Other);
    var totalByCountry = dimensionCountry.group().reduceSum(item => item.total);

    //finding top 10
    function getTops(source_group) {
        return {
            all: function () {
                return source_group.top(10);
            }
        };
    }
    var toptotalByCountry = getTops(totalByCountry);

    // group by year
    var AgriByYear = dimensionYear.group().reduceSum(item => item.Agriculture);
    var EnergyByYear = dimensionYear.group().reduceSum(item => item.Energy);
    var IndustByYear = dimensionYear.group().reduceSum(item => item.Industry);
    var ResidByYear = dimensionYear.group().reduceSum(item => item.Residential);
    var TransByYear = dimensionYear.group().reduceSum(item => item.Transport);
    var WasteByYear = dimensionYear.group().reduceSum(item => item.Waste);
    var OtherByYear = dimensionYear.group().reduceSum(item => item.Other);
    var totalByYear = dimensionYear.group().reduceSum(item => item.total);



    //Charts
    barChart
        .width(768)
        .height(380)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .xAxisLabel('Country')
        .yAxisLabel('CO2')
        .dimension(dimensionCountry)
        .barPadding(0.1)
        .outerPadding(0.05)
        .group(toptotalByCountry)
        .ordering(function(d) { return -d.value; });
    //.cap(20025616.435)
    //barChart.rowsCap(10);
    barChart.render()


    lineChart
        .width(768)
        .height(380)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .brushOn(true)
        .xAxisLabel('Country')
        .yAxisLabel('Total CO2 Emission')
        .dimension(dimensionYear)
        .group(totalByYear);
    lineChart.render();


    pieChart
        .width(800)
        .height(800)
        .slicesCap(4)
        .innerRadius(100)
        .externalLabels(50)
        .externalRadiusPadding(50)
        .drawPaths(true)
        .dimension(dimensionCountry)
        .group(totalByCountry)
        .legend(dc.legend());
    pieChart.on('pretransition', function(pieChart) {
        pieChart.selectAll('.dc-legend-item text')
            .text('')
            .append('tspan')
            .text(function(d) { return d.name; })
            .append('tspan')
            .attr('x', 100)
            .attr('text-anchor', 'end')
            .text(function(d) { return d.data; });
    });
    pieChart.render();


    rowchart
        .width(768)
        .height(480)
        .x(d3.scaleLinear().domain([6,20]))
        .elasticX(true)
        .dimension(dimensionCountry)
        .group(toptotalByCountry)
        .on('pretransition', function(rowchart) {
            var x_vert = 45;
            var extra_data = [
                {x: rowchart.x()(x_vert), y: 0},
                {x: rowchart.x()(x_vert), y: rowchart.effectiveHeight()}
            ];
            var line = d3.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                .curve(d3.curveLinear);
            var chartBody = rowchart.select('g');
            var path = chartBody.selectAll('path.extra').data([extra_data]);
            path = path.enter()
                .append('path')
                .attr('class', 'oeExtra')
                .attr('stroke', 'red')
                .attr('id', 'oeLine')
                .attr("stroke-width", 1)
                .style("stroke-dasharray", ("10,3"))
                .merge(path);
            path.attr('d', line);
        });
    rowchart.render();


    overviewChart1
        .width(1000)
        .height(200)
        .chart(function(c) { return dc.lineChart(c).curve(d3.curveCardinal); })
        .x(d3.scaleTime().domain([new Date(1990, 1, 1), new Date(2010, 0, 0)]))
        .brushOn(true)
        .elasticY(true)
        .xAxisLabel("Year")
        .clipPadding(10)
        .dimension(dimensionYear)
        .group(totalByYear)
        .title(function(d){
            return dtgFormat2(d.data.key)
                + "\nNumber of Events: " + d.data.value;
        })
        //.seriesAccessor(function(d) {return "Expt: " + d.key[0];})
        // .keyAccessor(function(d) {return +d.key[1];})
        // .valueAccessor(function(d) {return +d.value;})
        .xAxis();
    dc.renderAll();

});


