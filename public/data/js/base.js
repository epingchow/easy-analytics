define(["jquery", "highcharts"], function($) {
	var reportScreen = function(){
		$('#report-screen').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: 'Monthly Average Rainfall'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Rainfall (mm)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Tokyo',
                data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    
            }, {
                name: 'New York',
                data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
    
            }, {
                name: 'London',
                data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
    
            }, {
                name: 'Berlin',
                data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
    
            }]
        });

	}


	var reportBrowser = function() {
		var colors = Highcharts.getOptions().colors,
			categories = ['MSIE', 'Firefox', 'Chrome', 'Safari', 'Opera'],
			name = 'Browser brands',
			data = [{
				y: 55.11,
				color: colors[0],
				drilldown: {
					name: 'MSIE versions',
					categories: ['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0'],
					data: [10.85, 7.35, 33.06, 2.81],
					color: colors[0]
				}
			}, {
				y: 21.63,
				color: colors[1],
				drilldown: {
					name: 'Firefox versions',
					categories: ['Firefox 2.0', 'Firefox 3.0', 'Firefox 3.5', 'Firefox 3.6', 'Firefox 4.0'],
					data: [0.20, 0.83, 1.58, 13.12, 5.43],
					color: colors[1]
				}
			}, {
				y: 11.94,
				color: colors[2],
				drilldown: {
					name: 'Chrome versions',
					categories: ['Chrome 5.0', 'Chrome 6.0', 'Chrome 7.0', 'Chrome 8.0', 'Chrome 9.0',
						'Chrome 10.0', 'Chrome 11.0', 'Chrome 12.0'
					],
					data: [0.12, 0.19, 0.12, 0.36, 0.32, 9.91, 0.50, 0.22],
					color: colors[2]
				}
			}, {
				y: 7.15,
				color: colors[3],
				drilldown: {
					name: 'Safari versions',
					categories: ['Safari 5.0', 'Safari 4.0', 'Safari Win 5.0', 'Safari 4.1', 'Safari/Maxthon',
						'Safari 3.1', 'Safari 4.1'
					],
					data: [4.55, 1.42, 0.23, 0.21, 0.20, 0.19, 0.14],
					color: colors[3]
				}
			}, {
				y: 2.14,
				color: colors[4],
				drilldown: {
					name: 'Opera versions',
					categories: ['Opera 9.x', 'Opera 10.x', 'Opera 11.x'],
					data: [0.12, 0.37, 1.65],
					color: colors[4]
				}
			}];


		// Build the data arrays
		var browserData = [];
		var versionsData = [];
		for (var i = 0; i < data.length; i++) {

			// add browser data
			browserData.push({
				name: categories[i],
				y: data[i].y,
				color: data[i].color
			});

			// add version data
			for (var j = 0; j < data[i].drilldown.data.length; j++) {
				var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5;
				versionsData.push({
					name: data[i].drilldown.categories[j],
					y: data[i].drilldown.data[j],
					color: Highcharts.Color(data[i].color).brighten(brightness).get()
				});
			}
		}

		// Create the chart
		$('#report-browser').highcharts({
			chart: {
				type: 'pie'
			},
			title: {
				text: 'Browser market share, April, 2011'
			},
			yAxis: {
				title: {
					text: 'Total percent market share'
				}
			},
			plotOptions: {
				pie: {
					shadow: false,
					center: ['50%', '50%']
				}
			},
			tooltip: {
				valueSuffix: '%'
			},
			series: [{
				name: 'Browsers',
				data: browserData,
				size: '60%',
				dataLabels: {
					formatter: function() {
						return this.y > 5 ? this.point.name : null;
					},
					color: 'white',
					distance: -30
				}
			}, {
				name: 'Versions',
				data: versionsData,
				size: '80%',
				innerSize: '60%',
				dataLabels: {
					formatter: function() {
						// display only if larger than 1
						return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
					}
				}
			}]
		});
	}

	var reportOS=function(){
		$('#report-os').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Browser market shares at a specific website, 2010'
        },
        tooltip: {
    	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                {
                    name: 'Chrome',
                    y: 12.8,
                    sliced: true,
                    selected: true
                },
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['Others',   0.7]
            ]
        }]
    });
	}

	$(function() {
		reportOS();
		reportScreen();
		reportBrowser();
	});
});