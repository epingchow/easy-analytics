requirejs.config({
	urlArgs: "v=" + (new Date()).getTime(),
	baseUrl: '/',
	paths: {
		underscore: 'libs/underscore-min',
		backbone: 'libs/backbone-min', 
		jquery: "libs/jquery-2.0.3.min",
		jqueryui: "libs/jquery-ui-1.10.3/ui/jquery-ui",
		css: "libs/css",
		domReady: "libs/domReady",
		text: "libs/text",
		d3: "libs/d3/d3.v3.min",
		angular: "libs/angular.min",
		heatmap: "libs/heatmap",
		highcharts: "libs/highcharts/js/highcharts",
		bootstrap: "/bootstrap/dist/js/bootstrap.min"
	},
	//	map:{  
	//		'*': { 'jquery': 'libs/jquery-private' },
	//      	'libs/jquery-private': { 'jquery': 'jquery' }
	//	},
	shim: {
		'backbone': {
			deps: ['libs/iefix', 'underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		"bootstrap": {
			deps: ["jquery"]
		},
		"highcharts": {
			deps: ["jquery"],
			exports: 'jQuery'
		},
		"jqueryui": {
			deps: ["jquery"],
			exports: 'jQuery'
		},
		"bootstrap": {
			deps: ["jquery"],
			exports: 'jQuery'
		},
		'angular': {
            exports: 'angular'
        },
		'heatmap': {
            exports: 'h337'
        }
	}
});

