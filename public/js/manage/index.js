/**
 *@description:
 *@author: Sulfer
 *@date: 2/10 0010
 */
$(function () {

    $(".datepicker").datepicker({
        "language":"zh-CN",
        "format":"yyyy-mm",
        "startView": 1,
        "maxViewMode":1,
        "minViewMode":1,
        "autoclose":true
    });
    /* ChartJS
     * -------
     * Here we will create a few charts using ChartJS
     */

    //--------------
    //- AREA CHART -
    //--------------

    // Get context with jQuery - using jQuery's .get() method.

    var init = false;
    var pieInit = false;
    var prevLineChart;
    var areaChartOptions = {
        //Boolean - If we should show the scale at all
        showScale: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: false,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve: true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.3,
        //Boolean - Whether to show a dot for each point
        pointDot: false,
        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,
        //Boolean - Whether to fill the dataset with a color
        datasetFill: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: true,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true
    };

    function drawLineChart(){
        var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var areaChart = new Chart(areaChartCanvas);
        var date = $(".datepicker").val() ? new Date($(".datepicker").val()) : new Date();
        $.post("/statistics/getVisitors", {"date":(date.getFullYear() + "-" + (date.getMonth() + 1))}, function(result){
            $(".line-chart-title .year").text(date.getFullYear());
            $(".line-chart-title .month").text((date.getMonth() + 1));
                                                                                                var areaChartData = {
                labels: result.label,
                datasets: [
                    {
                        fillColor: "rgba(60,141,188,0.9)",
                        strokeColor: "rgba(60,141,188,0.8)",
                        pointColor: "#3b8bba",
                        pointStrokeColor: "rgba(60,141,188,1)",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(60,141,188,1)",
                        data: result.data
                    }
                ]
            };
            if(!init){
                lineChart = areaChart.Line(areaChartData, areaChartOptions);
                init = true;
            } else {
                lineChart.destroy();
                lineChart = areaChart.Line(areaChartData, areaChartOptions);
            }

        })

    }




    //-------------
    //- PIE CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.

    var pieOptions = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,
        //String - The colour of each segment stroke
        segmentStrokeColor: "#fff",
        //Number - The width of each segment stroke
        segmentStrokeWidth: 2,
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 50, // This is 0 for Pie charts
        //Number - Amount of animation steps
        animationSteps: 100,
        //String - Animation easing effect
        animationEasing: "easeOutBounce",
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    };
    //Create pie or douhnut chart
    // You can switch between pie and douhnut using the method below.
    function drawPieChart(){
        var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
        var pieChart = new Chart(pieChartCanvas);

        var date = $(".datepicker").val() ? new Date($(".datepicker").val()) : new Date();
        $.post("/statistics/getPieData", {"date":(date.getFullYear() + "-" + (date.getMonth() + 1))}, function(result){
            $(".pie-chart-title .year").text(date.getFullYear());
            $(".pie-chart-title .month").text((date.getMonth() + 1));
            var PieData = [
                {
                    value: result[0],
                    color: "#f56954",
                    highlight: "#f56954",
                    label: "Android"
                },
                {
                    value: result[1],
                    color: "#00a65a",
                    highlight: "#00a65a",
                    label: "IOS"
                },
                {
                    value: result[2],
                    color: "#f39c12",
                    highlight: "#f39c12",
                    label: "Windows"
                },
                {
                    value: result[3],
                    color: "#00c0ef",
                    highlight: "#00c0ef",
                    label: "Linux"
                }
            ];

            $(".deviceData .info-box").each(function(index, value){
                $(".info-box-number-custom", this).text(result[index])
            })
            if(!pieInit){
                pieChart.Doughnut(PieData, pieOptions);
                pieInit = true;
            } else {
                pieChart.destroy();
                pieChart.Doughnut(PieData, pieOptions);
            }

        })

    }

    $("#getLineData").click(function(){
        drawLineChart();
        drawPieChart();
    });

    drawLineChart();
    drawPieChart();


});