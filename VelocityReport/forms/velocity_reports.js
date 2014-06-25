/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A5BBFBAD-7485-4141-A998-7E8CB26EB1DB"}
 */
var chartType = "";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A9968DF1-8324-4FE5-ABD3-5C91C9E510DE"}
 */
var html = "";

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"4CE5AD54-838F-4936-A540-84F229B94B67",variableType:8}
 */
var opacity = 100.0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"31ACD6CA-4D75-4C99-941A-50D842C74AD5",variableType:4}
 */
var resolution = 1;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7B990916-68EA-4B92-8242-2FC97FE3126E",variableType:4}
 */
var useCallback = 0;

/**
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"7D00DCB4-61D9-447C-B891-77680800AF51",variableType:4}
 */
var useEastwood = 1;

/**
 * @properties={typeid:35,uuid:"CF72781D-9D87-47B3-9AB6-626C24DFB818",variableType:-4}
 */
var viewer = null;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"465BF275-7C61-4A4A-B180-F0B4B7638364"}
 */
var webMode = "HTML";

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"4F8226C3-B2D5-405E-8A36-B4B733B817F3"}
 */
function onActionTestStringTemplating(event) {
	// the 'template' here is a simple String, but we need to pull it from a real template URL:
	var template = 'Hello $!firstRecord.name_first $!firstRecord.name_last!\n\
#tablizer($foundset,"foundsetClass")\n\
#tablizer($products)\n\
#foreach($country in $countries)\n\
$velocityCount: $country.country_name\n\
#end\
$!date.format("yyyy-MM-dd",$!globals.dateTest)\n\
$math.getTotal([1,2,3,4])\n\
$number.currency(99.99)\n\
$!testI18n\n\
$!callbackTest\n\
#tablizer($dataset,"datasetClass", true)\n\
$!pieChart\n\
$!barChart\n\
$!scatterChart\n\
$!lineChart\n\
$!xyLineChart\n\
$!radarChart\n\
$!googleOMeterChart\n\
$!dialChart\n\
$!blob\n\
$!prod.get(1).products_to_product_types.description\n\
<!-- #foreach($record in $prod) -->\n\
<!-- #foreach($related in $record.products_to_product_types) -->\n\
$!related.description\n\
<!-- #end -->\n\
<!-- #end -->\n\
$!barcode\n\
$!mediaStuff\n\
$!jsObject.objectProp\n\
$number.integer($!jsObject.number2)';
	var result = plugins.VelocityReport.evaluateWithContext(template, getReportContext(), resolution);
	html = '<html><body style="width: 100%; height: 100%;">'+result+'</body></html>';
}

/**
 * @properties={typeid:24,uuid:"29D9ED15-1EB2-4928-AD58-10A89FDDCCF9"}
 */
function holywoodPrinciple() {
	return "Did you call me?";
}

/**
 * @properties={typeid:24,uuid:"57B1C8C4-AF4A-44B2-AC41-B550555DA070"}
 */
function getBarcode() {
	var barcodeDef = {
		data: "ServoyStuff",
		type: BARCODE.CODE128,
		height: 60,
		pattern: "______-_____!",
		moduleWidth: "0.17mm",
		format: "svg",
		forcedWidth: 225,
		forcedHeight: 90,
		id: "barcode1",
		font: 'Courier+New'
	}
	return plugins.VelocityReport.getBarcode(barcodeDef);
}

/**
 * @properties={typeid:24,uuid:"B18C749E-B027-40D4-844E-75C4C05BC534"}
 */
function getMediaStuff() {
	return plugins.VelocityReport.getMedia("ServoyStuff.png", "stuff");
}

/**
 * @properties={typeid:24,uuid:"5DC6B629-D0C9-4F87-B18F-2868C154763C"}
 */
function getReportContext() {
	// let's get a foundset:
	/* @type {JSFoundSet<db:/udm/products>} */
	var prod = databaseManager.getFoundSet('udm','products');
	prod.loadAllRecords();
	prod.setSelectedIndex(1);

	// and an image from that foundset:
	var blob = prod['product_image'];
	
	// the context object will hold everything we want to output in our report:
	var context = new Object();

	// we can put records directly in our report:
	context.firstRecord = foundset.getSelectedRecord();

	// we can put foundsets in it:
	context.foundset = foundset;
	context.countries = databaseManager.getFoundSet("udm","solution_preferences");
	context.prod = prod;

	// we can put charts:
	context.pieChart = getChart(CHART.PIE, getPieChartDef());
	context.barChart = getChart(CHART.BAR, getBarChartDef());
	context.scatterChart = getChart(CHART.SCATTER,getScatterChartDef());
	context.lineChart = getChart(CHART.LINE, getLineChartDef());
	context.xyLineChart = getChart(CHART.XYLINE,getXYLineChartDef());
	context.radarChart = getChart(CHART.RADAR, getRadarChartDef());
	context.googleOMeterChart = getChart(CHART.GOOGLEOMETER, getGoogleOMeterChartDef());
	context.dialChart = getChart(CHART.DIAL, getDialChartDef());

	// the plugin is i18n aware, of course:
	context.testI18n = "i18n:key.test";

	// we can put functions that will be called back during rendering:
	context.callbackTest = forms.velocity_reports.holywoodPrinciple;

	// we can put datasets:
	context.dataset = databaseManager.getDataSetByQuery(
		"udm", 
		"SELECT * FROM solution_preferences;", 
		null, 
		-1
	);
	context.products = databaseManager.getDataSetByQuery(
		"udm",
		"select product_number as ID, \
		    product_name as name, \
		    cost_each as cost, \
		    product_image as image_blob \
		    from products \
			order by ID;",
		null,
		-1
	);

	// we can put blob images:
	context.blob = blob;

	// and media images:
	context.mediaStuff = getMediaStuff();

	// we can put barcodes:
	context.barcode = getBarcode();

	// we can put any Javascript objects:
	context.jsObject = { 
		objectProp: "i18n:key.test", 
		number2: 2 
	};
	
	context.previewBounds = {x: -1, y: -1, w: 900, h: 720};
	return context;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"765B1BCB-BB6E-4414-A3DF-9CE56862FADD"}
 */
function onActionTestTemplate(event) {
	html = plugins.VelocityReport.renderTemplate("testTemplate.html", getReportContext(), resolution);
	application.output(html);
}

/**
 * Show the Viewer frame and opens a xhtml file into it.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"4894C620-70F5-4F7E-BD90-451EEC57AADE"}
 */
function onActionTestViewer(event) {
	var template = "testTemplate.html"
	//var template = "sample.xhtml";
	var previewParams = {
		showToolBar: true,
		showStatus: true
	}
	plugins.VelocityReport.setDefaultPreviewParameters(previewParams);
	var context = getReportContext();
	if (useCallback == 0) {
		viewer = plugins.VelocityReport.previewReport(template, context, webMode);
	} else {
		viewer = plugins.VelocityReport.previewReport(template, context, viewerSaveCallback, webMode);
	}
}

/**
 * @param pdf
 * 
 * @properties={typeid:24,uuid:"1FFA8392-A71B-4D21-AEAE-8C910479FEC2"}
 */
function viewerSaveCallback(pdf) {
	if (pdf) {
		var desktop = java.lang.System.getProperty("user.home") + "/Desktop/report.pdf";
		var file = plugins.file.convertToJSFile(desktop);
		application.output(file);
		plugins.file.writeFile(file,pdf);
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"AB849E6B-5D58-4C92-A794-A52D551C099A"}
 */
function onActionTestPDF(event) {
	var file = null;
	if (application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT) {
		file = "report.pdf";
	} else {
		file = plugins.file.showFileSaveDialog();
	}
	if (file) {
		var bytes = plugins.VelocityReport.getPDFReport("testTemplate.html", getReportContext(), resolution, PDF.V1_4);
		if (bytes && bytes.length > 0) {
			application.output(file);
			if (plugins.file.writeFile(file,bytes)) {
				html = "<html><body>File "+file+" saved!</body></html>";
			}
		}
	}
}

/**
 * Construct a Pie Chart definition object
 * 
 * @returns (Object) the chartDefinition
 * 
 * @properties={typeid:24,uuid:"9655CBBD-85A6-47D0-8E22-6B20CB617984"}
 */
function getPieChartDef() {
	var chartDef = {};
	chartDef.title = "i18n:piechart.title";
	chartDef.threeD = true;
	chartDef.shadow = false;
	chartDef.proportional = true;
	chartDef.labelFontSize = 10;
	chartDef.slices = [
         {percent: 29.5, color: '#FF0000', label: 'Thirty', legend: 'Thirty'},
         {percent: 25, color: '#00FF00', label: 'Twenty-Five', legend: 'Twenty-Five'},
         {percent: 15.5, color: '#0000FF', label: 'Fifteen', legend: 'Fifteen'},
         {percent: 10.2, color: '#FF00FF', label: 'Five', legend: 'Five'},
         {percent: 19.8, color: '#00FFFF', label: 'Twenty', legend: 'Twenty'}
	];
	chartDef.orientation = 45;
	chartDef.transparency = opacity;
	return chartDef;
}

/**
 * Construct a Bar Chart definition object
 * 
 * @returns (Object) the chartDefinition
 * 
 * @properties={typeid:24,uuid:"62CA1445-7AE5-4D6A-BD25-B61B64B9E88F"}
 */
function getBarChartDef() {
	// regular stuff:
	var chartDef = {};
	chartDef.titleColor = "#222222";
	chartDef.titleSize = 18;
	chartDef.background = {type: 'gradient', angle: 90, colors: [['#CCCCCC', 0], ['#FFFFFF', 100]]};
	chartDef.width = 600;
	chartDef.height = 300;
	chartDef.areaFill = {type: 'gradient', angle: 0, colors: [['#CCCCCC', 0], ['#FFFFFF', 100]]};
	chartDef.legendPosition = "right";
	chartDef.legendMargins = {horizontal: 10, vertical: 2};
	chartDef.margins = {top: 10, left: 10, right: 10, bottom: 10};
	chartDef.grid = {xAxisStepSize: 10, yAxisStepSize: 10, lengthOfLineSegment: 3, lengthOfBlankSegment:2, xOffset: 5, yOffset: 5};
	chartDef.title = "Stacked bar example:";
	chartDef.threeD = true;
	chartDef.horizontal = false;
	chartDef.barWidth = 45;
	chartDef.shadow = false;
	chartDef.spaceBetweenGroupsOfBars = 15;
	chartDef.spaceWithinGroupsOfBars = 3;
	chartDef.transparency = opacity;
	chartDef.rangeMarkers = {orientation: 'h', color: '#00CCFF55', startPoint: 80, endPoint: 120};
	chartDef.markers = [{shape: 'arrow', size: 10, color: '#FF0000', x: 40, y: 50},
				{text: 'Bad year!', size: 12, x: 44, y: 66}];
	
	// here starts the interesting thing:
	
	// set as stacked:
	chartDef.stacked = true;

	// set the values:
	var data1 = {data: [45,32,22], colors: ['#BB5555', '#DD3333', '#FF0000'], legend: 'Servoy'};
	var data2 = {data: [58,24,76], color: ['#00FFFF', '#FFFF00', '#00FF00'], legend: 'Stuff'};
	var data3 = {data: [77,100,55], color: ['#5555BB', '#3333DD', '#0000FF'], legend: 'Rules!'};
	chartDef.bars = [data1, data2, data3];
	
	// the sum of each bars by series will give (45+58+77=180, 32+24+100=156, 22+76+55=153)
	// we give the chart a max value of 200 to let it breathe ;)
	chartDef.maxValue = 200;
	
	// a simple x axis with 3 values (note the scaling):
	chartDef.xAxis = {
			labels: ['2008', '2009', '2010'],
			positions: [10, 20, 30],
			style: {textColor: '#000000', fontSize: 12, alignment: 'center', drawTickMarks: false},
			minRange: 0, maxRange: 40
		};
	
	// and the y axis: the positions are scaled in a range of 0-100 anyway, so you can use [0,10...] or [0,20...] indiferently:
	chartDef.yAxis = {
			labels: ['0','20', '40', '60', '80', '100', '120', '140', '160', '180', '200'],
			positions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
			style: {textColor: '#000000', fontSize: 12, alignment: 'right', tickMarkLength: 12, tickMarkColor: '#FF0022'},
			minRange: 0, maxRange: 100
		};
	
	return chartDef;
}

/**
 * Construct a Scatter Chart definition object
 * 
 * @returns (Object) the chartDefinition
 * 
 * @properties={typeid:24,uuid:"EF429D31-A560-4B1E-878E-31EA665CBE31"}
 */
function getScatterChartDef() {
	var chartDef = {};
	chartDef.title = "i18n:scatterChart.title";
	chartDef.scatter = {xData: [5,10,20,30,40,50,60,70,80,90], 
        yData: [5,10,20,30,40,50,60,70,80,90], 
        pointSizes: [5,10,20,30,40,50,60,70,80,90],
        color: "#FF0000",
        legend: "Galaxies"
	};
	chartDef.rangeMarkers = [{orientation: 'v', color: '#00CCFF22', startPoint: 15, endPoint: 25}, 
	                         {orientation: 'h', color: '#00CCFF22', startPoint: 70, endPoint: 80}];
	chartDef.markers = [{shape: 'arrow', size: 10, color: '#0000FF', x: 41, y: 42},
				{text: 'UGC219', size: 12, x: 40, y: 60}];
	chartDef.transparency = opacity;
	return chartDef;
}

/**
 * Callback method when form is (re)loaded.<br/>
 * Construct a common chart definition object with 'common' chart parameters.<br/>
 * Set the default report parameters<br/>
 * Set the default preview parameters
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"81457731-86BA-4201-B595-690DBB1C63CB"}
 */
function loadForm(event) {
	var version = plugins.VelocityReport.getVersion();
	application.output("Using VelocityReport v"+version);
	var limit = ((application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT) ? 2048 : -1);
	var common = {
		titleColor: "#222222",
		titleSize: 18,
		background: {type: 'gradient', angle: 90, colors: [['#CCCCCC', 0], ['#FFFFFF', 100]]},//"#FFFFFF00",
		width: 600,
		height: 300,
		areaFill: {type: 'gradient', angle: 0, colors: [['#CCCCCC', 0], ['#FFFFFF', 100]]},
		legendPosition: "right",
		legendMargins: {horizontal: 10, vertical: 2},
		margins: {top: 10, left: 10, right: 10, bottom: 10},
		grid: {xAxisStepSize: 10, yAxisStepSize: 10, lengthOfLineSegment: 3, lengthOfBlankSegment:2},
		xAxis: {
//			labels: ['2008', '2009', '2010'],
//			labels: ['0','10', '20', '30', '40', '50', '60', '70', '80', '90', '100'],
//			positions: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
			labels: ['0','10', '20', '30', '40'],
			positions: [0, 10, 20, 30, 40],
			style: {textColor: '#000000', fontSize: 12, alignment: 'center', drawTickMarks: false},
			minRange: 0, maxRange: 40
		},
		yAxis: {
//			labels: ['25', '50', '75', '100'],
//			positions: [25,50,75,100],
//			labels: ['0','10', '20', '30', '40', '45', '50', '60', '70', '80', '90', '100'],
//			positions: [0, 10, 20, 30, 40, 45, 50, 60, 70, 80, 90, 100],
			labels: ['40', '45', '50', '60', '70', '80', '90', '100'],
			positions: [40, 45, 50, 60, 70, 80, 90, 100],
			style: {textColor: '#000000', fontSize: 12, alignment: 'right', tickMarkLength: 12, tickMarkColor: '#FF0022'},
			minRange: 40, maxRange: 100
		},
		transparency: opacity,
		useLocalEngine: false,
		resolution: REPORT.RESOLUTION_LOW,
		xMin: 0,
		xMax: 40,
		yMin: 40,
		yMax: 100,
		urlLimit: limit
	};
	plugins.VelocityReport.setDefaultChartParameters(common);
	var reportDefaults = {
	    dateFormat: "yyyy-MM-dd",
	    numberFormat: "#.00' $'",
		printParams: {
			showDialog: false,
			size: PRINTSIZE.NA_LETTER,
			orientation: PRINTORIENTATION.PORTRAIT,
			sides: PRINTSIDE.ONE_SIDED,
			sheetCollate: PRINTSHEETCOLLATE.UNCOLLATED,
			copies: 1
		}
	};
	plugins.VelocityReport.setDefaultReportParameters(reportDefaults);
	var previewParams = {
		useSaveLocalPDF: true,
		useTogglePaginated: true,
		useZoom: true,
		useFontZoom: true,
		usePrint: true,
		savePDFResolution: REPORT.RESOLUTION_HIGH,
		printPDFResolution: REPORT.RESOLUTION_HIGH,
		bounds: {x: 10, y: 10, w: 400, h: 500},
		openInPaginated: false
	}
	plugins.VelocityReport.setDefaultPreviewParameters(previewParams);
	application.setValueListItems("VL_charts", [CHART.PIE, 
	                                            CHART.BAR, 
	                                            CHART.SCATTER, 
	                                            CHART.LINE,
	                                            CHART.XYLINE,
	                                            CHART.RADAR,
	                                            CHART.GOOGLEOMETER,
	                                            CHART.DIAL,
	                                            BARCODE.CODE128]);
	
}

/**
 * Construct a chart of type type with the definition object chartDef
 * 
 * @param {String} type One of: pie|bar|scatter|line|xyLine
 * @param {Object} chartDef The chart definition object
 * 
 * @return (Object) the chart constructed
 * 
 * @properties={typeid:24,uuid:"31CE9830-55A8-4516-BAB1-E586CA88BDFB"}
 */
function getChart(type, chartDef) {
	return plugins.VelocityReport.getChart(type, chartDef, (useEastwood == 1), resolution);
}

/**
 * Update the HTML area field to display a chart.
 * 
 * @param {String} type One of: pie|bar|scatter|line|xyLine
 * @param {Object} chartDef The chart definition object
 * 
 * @properties={typeid:24,uuid:"29E5B4E9-0ECC-4FA3-B12C-AE63DBB1E043"}
 */
function updateChart(type, chartDef) {
	try {
		var chart = getChart(type, chartDef);
		if (chart != null)  {
			application.output(chart);
			html = '<html><body style="width: 100%; height: 100%; text-align: center; vertical-align: center">'+chart+'</body></html>';
		}
	} catch (e) {
		application.output(e);
	}
}

/**
 * Construct a Line Chart definition object
 * 
 * @returns (Object) the chartDefinition
 * 
 * @properties={typeid:24,uuid:"AA2DFEA7-5487-4F8B-A262-B8A11C9DAE25"}
 */
function getLineChartDef() {
	var chartDef = {};
	chartDef.title = "i18n:lineChart.title";
	chartDef.isSparkline = false;
	chartDef.rangeMarkers = {orientation: 'vertical', color: '#00CCFF22', startPoint: 40, endPoint: 60};
	chartDef.markers = [{shape: 'arrow', size: 10, color: '#FF0000', x: 50, y: 33},
				{text: 'Bad year!', size: 12, color: '#000000', x: 54, y: 49}];
	var line1 = {data: [45,32,55], color: '#FF0000', legend: 'i18n:bar1.legend1', fillAreaColor: '#FF000033'};
	var line2 = {data: [58,24,76], color: '#00FF00', legend: 'i18n:bar1.legend2', lineStyle: {lineThickness: 5, 
					lengthOfLineSegment: 5, lengthOfBlankSegment: 2}};
	var line3 = {data: [87,91,22], color: '#0000FF', legend: 'i18n:bar1.legend3', lineStyle: {lineThickness: 3}, 
	             	markers: [{shape: 'diamond', size: 12, color: '#0000FF'}]};
	chartDef.lines = [ line1, line2, line3 ];
	chartDef.transparency = opacity;
	return chartDef;
}

/**
 * Construct a XYLine Chart definition object
 * 
 * @returns (Object) the chartDefinition
 * 
 * @properties={typeid:24,uuid:"AC4D63AD-4E24-4043-8F11-7CDB074814E1"}
 */
function getXYLineChartDef() {
	var chartDef = {};
	chartDef.title = "i18n:xyLineChart.title";
	chartDef.rangeMarkers = [{orientation: 'vertical', color: '#00CCFF22', startPoint: 15, endPoint: 25},
	                         {orientation: 'horizontal', color: '#00CCFF22', startPoint: 65, endPoint: 80}];
	var line1 = {xData: [10,20,40,80,90,95,99], yData: [20,30,40,50,60,70,80], color: '#FF0000', legend: 'i18n:bar1.legend1', 
	             	markers: [{shape: 'diamond', size: 12, color: '#0000FF'}]};
	var line3 = {xData: [0,0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5,9.5,10.5,11.5,12.5,13.5,14.5,15.5,16.5,17.5,18.5,19.5,20.5,21.5,
	                     22.5,23.5,24.5,25.5,26.5,27.5,28.5,29.5,30.5,31.5,32.5,33.5,34.5,35.5,36.5], yData: [45.5684091,48.55809206,
	                     52.72610659,55.7734505,58.23744339,60.33646905,62.18260807,63.84166131,65.35583849,66.75397985,68.05674555,
	                     69.27949219,70.43397431,71.52941204,72.57318381,73.57129631,74.5287119,75.44958259,76.3374214,77.19523002,
	                     78.02559584,78.83076661,79.61270882,80.37315285,81.11363482,81.83551818,82.58135344,83.31105283,84.02609006,
	                     84.72769162,85.41688027,86.09451745,86.76133892,87.41798587,88.06503203,88.70300745,89.33241837,89.95376886], 
	                     color: '#FF0000', legend: 'Chart Test', 
	             	markers: [{shape: 'x', size: 12, color: '#0000FF'}]};
	var line4 = {xData: [0,0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5,9.5,10.5], yData: [45.5684091,48.55809206,
	                     52.72610659,55.7734505,58.23744339,60.33646905,62.18260807,63.84166131,65.35583849,66.75397985,68.05674555,
	                     69.27949219], 
	                     color: '#0000FF', legend: 'Chart Test'};
	var line5 = {xData: [0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36], 
	             yData: [45,48,52,55,58,60,62,63,65,66,68,69,70,71,72,73,74,75,76,77,78,78,79,80,81,81,82,83,84,84,85,86,86,87,88,88,
	                     89,89], color: '#FF0000', legend: 'Chart Test'};
	var line2 = {xData: [5,10,22,35,85], yData: [10,30,50,70,90], color: '#00FF00', legend: 'i18n:bar1.legend2', 
	             	lineStyle: {lineThickness: 5, lengthOfLineSegment: 5, lengthOfBlankSegment: 2}, fillAreaColor: '#00FF0033'};
	chartDef.lines = [ line5 ];
	chartDef.markers = [{shape: 'x', size: 10, color: '#FF0000', x: 0, y: 45}, {shape: 'x', size: 10, color: '#0000FF', x: 0, y: 48},
	                     {shape: 'x', size: 10, color: '#00FF00', x: 1, y: 52}, {shape: 'x', size: 10, color: '#000000', x: 2, y: 55},
	                     {shape: 'x', size: 10, color: '#FF0000', x: 3, y: 58}, {shape: 'x', size: 10, color: '#0000FF', x: 4, y: 60},
	                     {shape: 'x', size: 10, color: '#00FF00', x: 5, y: 62}, {shape: 'x', size: 10, color: '#000000', x: 6, y: 63},
	                     {shape: 'x', size: 10, color: '#FF0000', x: 7, y: 65}, {shape: 'x', size: 10, color: '#0000FF', x: 8, y: 66},
	                     {shape: 'x', size: 10, color: '#00FF00', x: 9, y: 68}, {shape: 'x', size: 10, color: '#000000', x: 10, y: 69},
	                     {shape: 'x', size: 10, color: '#FF0000', x: 11, y: 70}, {shape: 'x', size: 10, color: '#0000FF', x: 12, y: 71},
	                     {shape: 'x', size: 10, color: '#00FF00', x: 13, y: 72}, {shape: 'x', size: 10, color: '#000000', x: 14, y: 73},
	                     {shape: 'x', size: 10, color: '#FF0000', x: 15, y: 74}, {shape: 'x', size: 10, color: '#0000FF', x: 16, y: 75},
	                     {shape: 'x', size: 10, color: '#00FF00', x: 17, y: 76}, {shape: 'x', size: 10, color: '#000000', x: 18, y: 77},
	                     {shape: 'x', size: 10, color: '#FF0000', x: 19, y: 78}, {shape: 'x', size: 10, color: '#0000FF', x: 20, y: 78},
	                     {shape: 'x', size: 10, color: '#00FF00', x: 21, y: 79}, {shape: 'x', size: 10, color: '#000000', x: 22, y: 80},
	                     {shape: 'x', size: 10, color: '#FF0000', x: 23, y: 81}, {shape: 'x', size: 10, color: '#0000FF', x: 24, y: 81},
	                     {shape: 'x', size: 10, color: '#00FF00', x: 25, y: 82}, {shape: 'x', size: 10, color: '#000000', x: 26, y: 83},
	                     {shape: 'x', size: 10, color: '#FF0000', x: 27, y: 84}, {shape: 'x', size: 10, color: '#0000FF', x: 28, y: 84},
	                     {shape: 'x', size: 10, color: '#00FF00', x: 29, y: 85}, {shape: 'x', size: 10, color: '#000000', x: 30, y: 86},
	                     {shape: 'x', size: 10, color: '#FF0000', x: 31, y: 86}, {shape: 'x', size: 10, color: '#0000FF', x: 32, y: 87},
	                     {shape: 'x', size: 10, color: '#00FF00', x: 33, y: 88}, {shape: 'x', size: 10, color: '#000000', x: 34, y: 88},
	                     {shape: 'x', size: 10, color: '#FF0000', x: 35, y: 89}, {shape: 'x', size: 10, color: '#0000FF', x: 36, y: 89}, 
	                     {text: 'Bad year!', size: 12, x: 54, y: 59}];
	chartDef.transparency = opacity;
	return chartDef;
}

/**
 * Construct a XYLine Chart definition object
 * 
 * @returns (Object) the chartDefinition
 * 
 * @properties={typeid:24,uuid:"D921CBDC-94BE-4A04-BB06-98686B967183"}
 */
function getRadarChartDef() {
	var chartDef = {};
	chartDef.title = "i18n:radar.title";
	chartDef.spline = false;
	chartDef.areaFill = "#FFFFFF00";
	chartDef.radars = [
		{data: [40, 40, 50, 60, 80, 40], color: '#6633CC', legend: 'Servoy', 
			lineStyle: {lineThickness: 4}, fillAreaColor: '#6633CC33', 
			markers: [{shape: 'circle', size: 12, color: '#6633CC'}, {shape: 'circle', size: 10, color: '#FFFFFF'}]},
 		{data: [80, 50, 50, 85, 60, 80], color: '#CC3366', legend: 'Stuff', 
				lineStyle: {lineThickness: 4}, fillAreaColor: '#CC336633', 
				markers: [{shape: 'square', size: 12, color: '#CC3366'}, {shape: 'square', size: 10, color: '#FFFFFF'}]}
 	];
	
	chartDef.concentricAxis = {
		labels: ['0', '20', '40', '60', '80', '100'],
		style: {textColor: '#000000', fontSize: 12, alignment: 'right'}
	};
	chartDef.radialAxis = {
			labels: ['Maths', 'Arts', 'French', 'German', 'Music'],
			style: {textColor: '#000000', fontSize: 12}
	};
	
	chartDef.transparency = opacity;
	return chartDef;
}

/**
 * @properties={typeid:24,uuid:"E532D523-8AF7-4F88-85DF-406B6A6A70B7"}
 */
function getGoogleOMeterChartDef() {
	var chartDef = {};
	chartDef.title = "i18n:googleometer.title";
	chartDef.data = 70;
	chartDef.colors = ["#FF0000", "#00FF00", "#0000FF"];
	chartDef.steps = 33;
	chartDef.interpolation = "linear";
	//chartDef.startColor = "#FF0000";
	//chartDef.endColor = "#00FF00";
	chartDef.label = "Hello world!";
	chartDef.transparency = opacity;
	return chartDef;
}

/**
 * @properties={typeid:24,uuid:"5D92CAD0-5D89-4E31-BFD0-3DA0352C75B8"}
 */
function getDialChartDef() {
	var chartDef = {};
	chartDef.title = "i18n:dial.title";
	chartDef.data = 33;
	chartDef.legend = "Speedometer!";
	chartDef.ranges = [
				{startPoint: 0, endPoint: 50, color: '#00FF00'},
				{startPoint: 50, endPoint: 80, color: '#FF9900'},
				{startPoint: 80, endPoint: 100, color: '#FF0000'}
			];
	chartDef.minorTicks = 5;
	chartDef.majorTicks = 10;
	chartDef.lowerBounds = 0;
	chartDef.upperBounds = 100;
	chartDef.proportional = true;
	chartDef.transparency = opacity;
	return chartDef;
}

/**
 * @properties={typeid:24,uuid:"2F2AE950-305C-46BF-B53A-0BE785B70D09"}
 */
function getBarcodeImage() {
	var barcodeDef = {
		data: "ServoyStuff",
		gray: true,
		type: BARCODE.CODE128,
		height: 60,
		pattern: "______-_____!",
		moduleWidth: "0.18mm",
		wideFactor: 3,
		format: "png",
		fontSize: 8,
		forcedWidth: 225,
		forcedHeight: 90,
		id: "barcode1",
		font: 'Courier+New',
		resolution: REPORT.RESOLUTION_HIGH
	}
	return plugins.VelocityReport.getBarcode(barcodeDef);
}

/**
 * Shows a barcode sample
 *
 * @properties={typeid:24,uuid:"A4D9F778-FDDB-4DD9-BCCE-D8982A7237A9"}
 */
function createBarcode() {
	try {
		var barcode = getBarcodeImage();
		if (barcode != null)  {
			application.output(barcode);
			html = '<html><body style="width: 100%; height: 100%; text-align: center; vertical-align: center">'+barcode+'</body></html>';
		}
	} catch (e) {
		application.output(e);
	}
}

/**
 * Handle changed data.
 *
 * @param {Object} oldValue old value
 * @param {Object} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"79F8410A-6B00-45F2-B249-4559C22BDCFA"}
 */
function onSelectChart(oldValue, newValue, event) {
	showChart(newValue)
	return true;
}

/**
 * @properties={typeid:24,uuid:"4E4FFE7B-A6C5-45D5-BC2F-1CC8015D4577"}
 */
function showChart(whichOne) {
	switch (whichOne) {
		case CHART.PIE:
			updateChart(whichOne, getPieChartDef());
			break;
		case CHART.BAR:
			updateChart(whichOne, getBarChartDef());
			break;
		case CHART.SCATTER:
			updateChart(whichOne, getScatterChartDef());
			break;
		case CHART.LINE:
			updateChart(whichOne, getLineChartDef());
			break;
		case CHART.XYLINE:
			updateChart(whichOne, getXYLineChartDef());
			break;
		case CHART.RADAR:
			updateChart(whichOne, getRadarChartDef());
			break;
		case CHART.GOOGLEOMETER:
			updateChart(whichOne, getGoogleOMeterChartDef());
			break;
		case CHART.DIAL:
			updateChart(whichOne, getDialChartDef());
			break;
		case BARCODE.CODE128:
			createBarcode();
			break;
	}
}

/**
 * Handle changed data.
 *
 * @param {Object} oldValue old value
 * @param {Object} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"F6E987D8-BF1A-4404-8FCE-D5244137F8CF"}
 */
function onChangeEngine(oldValue, newValue, event) {
	if (currentcontroller.getName() == forms.component_test.controller.getName()) {
		forms.component_test.updateComponent();
	} else {
		if (chartType && chartType != CHART.DIAL && chartType != BARCODE.CODE128) {
			showChart(chartType);
		}
	}
	return true;
}

/**
 * Handle changed data.
 *
 * @param {Object} oldValue old value
 * @param {Object} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"3346ED65-B54B-488F-B91C-EDFB91629E0E"}
 */
function onChangeResolution(oldValue, newValue, event) {
	if (chartType && useEastwood == 1 && chartType != BARCODE.CODE128) {
		showChart(chartType);
	}
	return true
}

/**
 * @properties={typeid:24,uuid:"83EE0F0B-85DC-4302-83C9-DDF51BD28DE7"}
 */
function onDataChangeOpacity(oldValue, newValue) {
	if (currentcontroller.getName() == forms.component_test.controller.getName()) {
		forms.component_test.updateComponent();
	} else {
		if (chartType && chartType != BARCODE.CODE128) {
			showChart(chartType);
		}
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"C625A241-7D71-4F3F-9170-C91328E010DA"}
 */
function onShow(firstShow, event) {
	elements.parentGroup.visible = true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"D2607081-DE0D-48A6-B1A4-E00B38B26FB0"}
 */
function onActionUpdateViewer(event) {
	if (application.getApplicationType() == APPLICATION_TYPES.SMART_CLIENT && viewer) {
		var file = plugins.file.convertToJSFile("d:/reports/sample.xhtml");
		var report = plugins.file.readTXTFile(file, "UTF-8");
		viewer.update(report, {fromString: true, baseHREF: 'file:///'+file.getParentFile().getAbsolutePath()});
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B22D2462-C681-4DEA-976F-29040D2004B4"}
 */
function onActionPrint(event) {
	plugins.VelocityReport.printReport("testTemplate.html", getReportContext(), {showDialog: true});
	// you can also try silent print with different values:
	/*
	plugins.VelocityReport.printReport("testTemplate.html", getReportContext(),
		{
			showDialog: false,
			size: PRINTSIZE.NA_LEGAL, 
			orientation: PRINTORIENTATION.LANDSCAPE,
			sides: PRINTSIDE.DUPLEX,
			sheetCollate: PRINTSHEETCOLLATE.COLLATED,
			copies: 2
		}
	); */
}

/**
 * // TODO generated, please specify type and doc for the params
 * @param {Object} id
 *
 * @properties={typeid:24,uuid:"7DD1D39B-DFB9-4255-BE0A-34784CEEF5FE"}
 */
function select_record(id) {
	plugins.dialogs.showInfoDialog("Selected","You selected record "+id,"OK");
}
