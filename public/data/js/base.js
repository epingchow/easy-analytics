define(["jquery", "highcharts"], function($) {
	var reportScreen = function(results) {
		var categories=[];
		var values=[];
		$(results).each(function() {
			categories.push(this.screen);
			values.push(this.count);
		});
		console.log(categories,values);
		$('#report-screen').highcharts({
			chart: {
				type: 'column'
			},
			title: {
				text: '用户屏幕分辨率统计'
			},
			xAxis: {
				categories: categories
			},
			yAxis: {
				min: 0,
				title: {
					text: '访问次数'
				}
			},
			tooltip: {
				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
					'<td style="padding:0"><b>{point.y:.0f} </b></td></tr>',
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
				name: '用户屏幕分辨率',
				data: values
			}]
		});

	}


	var reportBrowser = function(results) {
		var amount = 0;
		$(results).each(function() {
			amount += this.value.count;
		})


		var colors = Highcharts.getOptions().colors;
		// Build the data arrays
		var browserData = [];
		var versionsData = [];
		for (var i = 0; i < results.length; i++) {

			// add browser data
			browserData.push({
				name: results[i].value.browser,
				y: (results[i].value.count/amount*100).toFixed(2)*1,
				color: colors[i]
			});

			// add version data
			var j = 0;
			for (var key in results[i].value.versions) {
				var len = Object.getOwnPropertyNames(results[i].value.versions).length;
				var brightness = 0.2 - (j / len) / 5;
				versionsData.push({
					name: key,
					y: (results[i].value.versions[key]/amount*100).toFixed(2)*1,
					color: Highcharts.Color(colors[i]).brighten(brightness).get()
				});
				j++;
			}
		}
		// Create the chart
		$('#report-browser').highcharts({
			chart: {
				type: 'pie'
			},
			title: {
				text: '用户浏览器使用统计'
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
				name: '浏览器',
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
				name: '版本',
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

	var reportOS = function(results) {
		var data=[];
		var amount=0;
		$(results).each(function() {
			amount += this.count;
		});
		$(results).each(function() {
			data.push([this.os,(this.count/amount*100).toFixed(2)*1]);
		});
		$('#report-os').highcharts({
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false
			},
			title: {
				text: '用户操作系统使用统计'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						color: '#000000',
						connectorColor: '#000000',
						format: '<b>{point.name}</b>: {point.percentage:.2f} %'
					}
				}
			},
			series: [{
				type: 'pie',
				name: '用户操作系统',
				data: data
			}]
		});
	}

	$(function() {

		$.get("/rest/" + window._KEY + "/base", function(data) {
			console.log(data);
			reportOS(data.os);
			reportScreen(data.screens);
			reportBrowser(data.browsers);
		});
	});
});