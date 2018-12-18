google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);


function drawSheetName(sheetName, query, responseHandler) {

    let queryString = encodeURIComponent(query);
    let query = new google.visualization.Query(
        'https://docs.google.com/spreadsheets/d/1ujfP3409RcISl0KbMB3evs6jJgJ1A54SQDFPXvtTCbc/gviz/tq?sheet='
        + sheetName + '&headers=1&tq=' + queryString);
    query.send(responseHandler);
} //drawSheetName

function drawAllSheets() {
//Left-sidetotalForest
    drawSheetName('TotalForest', 'SELECT A,B', ForestLine);
    drawSheetName('AvgTmp', 'SELECT A,B', avgTemp);
}

function ForestLine(response) {

    let data = response.getDataTable();
    data.sort({column: 1, desc: true});

    let options = {
        height: 400,
        annotations: {alwaysOutside: true},
        vAxis: {title: 'Average Spending in Billions $'},
        hAxis: {title: 'Country'},
        isStacked: true,
        crosshair: {
            color: '#000',
            trigger: 'selection'
        }
    };

    let chart = new google.visualization.LineChart(document.getElementById('forestline_div'));

    chart.draw(data, options);
} //ForestLine


function avgTemp(response) {

    let data = response.getDataTable();
    data.sort({column: 1, desc: true});
    data.LandAverageTemperature
    let options = {
        height: 400,
        annotations: {alwaysOutside: true},
        vAxis: {title: 'Land Average Temperature(C)'},
        hAxis: {title: 'Year'},
    };

    let chart = new google.visualization.ColumnChart(document.getElementById('temp_div'));

    chart.draw(data, options);
} //avgTemp





