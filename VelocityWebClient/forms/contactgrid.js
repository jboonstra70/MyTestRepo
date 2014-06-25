/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"38075B08-1AA7-4010-ACF7-B5644AF0FAE3"}
 */
var theme = "blue";

/**
 * @param request
 * 
 * @properties={typeid:24,uuid:"2E811CEF-831A-4692-A912-4FC60C61CC2C"}
 */
function vr_getContext(request) {
		
	var params = request.parameters;
	
	if (request.method == "POST") {
		return doPost(params);
		
	} else {
		return doGet(params);
		
	}
	
}

/**
 * @param params
 * 
 * @properties={typeid:24,uuid:"E107889E-47B9-4BFC-B795-801C3F725121"}
 */
function doGet(params) {
	var context = {};
	context.title = "Contact grid";
	context.theme = theme;

	if (params.q && params.q == 'data') {
	
		var count = databaseManager.getFoundSetCount(foundset);
		var page = params.page;
		if (!page) page = 1;
		var limit = params.rows;
		if (!limit) limit = count;
		var sidx = params.sidx;
		if (!sidx) sidx = 1; 
		var sord = params.sord;
		var total_pages = 0;
		if (count > 0) {
			total_pages = Math.ceil(count/limit);
		}
		
		context.page = page;
		context.total = total_pages;
		context.records = count;

		var start = 1 + ((limit * page) - limit);
		
		foundset.loadAllRecords();
		
		doSearch(params);
		
		if (sidx) {
			var sortValue = sidx + " " + sord;
			foundset.sort(sortValue);
		}
		context.rows = [];
		for (var i = start; i <= count; i++) {
			var record = foundset.getRecord(i);
			var obj = {id: record.contact_id, cell: [record.contact_id, record.name_first, record.name_last, record.job_title, record.email ]};
			context.rows.push(obj);
		}
		
	} else {
		
		// toggle the theme:
		if (params.toggleTheme) {
			if (theme == 'blue') {
				theme = "gray"
			} else {
				theme = "blue";
			}
			context.theme = theme;
		}
		
		// setup the initialization values of the grid:
		context.colNames = ['ID', 'First name', 'Last name', 'Job title', 'Email' ];
		context.colModel = [
	   		{name:'contact_id',index:'contact_id', width:55, align:'center', searchtype: 'integer'},
	   		{name:'name_first',index:'name_first', width:100, editable:true},
	   		{name:'name_last',index:'name_last', width:100, editable:true},
	   		{name:'job_title',index:'job_title', width:200, editable:true},
	   		{name:'email',index:'email', width:300, editable:true}
		];
	}
	
	return plugins.Velocity.createResponse(context)
}

/**
 * @param params
 * 
 * @properties={typeid:24,uuid:"781E1BF2-91BF-4DF4-84B5-D20A8E3CB5BC"}
 */
function doPost(params) {
	if (params.oper) {
		switch (params.oper) {
			case "add":
			case "edit":
				if (params.id == "new_row" || params.id == "_empty") { // insert
					foundset.setSelectedIndex(foundset.newRecord());
				} else { // update
					if (foundset.find()) {
						foundset.contact_id = params.id;
						foundset.search();	
					}
				}
				if (saveRecord(params)) {
					params.contact_id = foundset.contact_id;
					params.id = foundset.contact_id;
				}
				foundset.loadAllRecords();
				return plugins.Velocity.createResponse(params);
			case "del": // delete
				if (foundset.find()) {
					foundset.contact_id = params.id;
					var cnt = foundset.search();
					if (cnt) {
						foundset.deleteRecord(foundset.getSelectedRecord());
					}
				}
				foundset.loadAllRecords();
				return plugins.Velocity.createResponse(params);
			}
	}
}

/**
 * @param params
 * 
 * @properties={typeid:24,uuid:"646FD00A-976C-4E99-B5C6-BAE53E8B0C23"}
 */
function saveRecord(params) {
	foundset.name_first = params.name_first;
	foundset.name_last = params.name_last;
	foundset.job_title = params.job_title;
	foundset.email = params.email;
	
	return databaseManager.saveData(foundset.getSelectedRecord());
}

/**
 * @param params
 * 
 * @properties={typeid:24,uuid:"24CC6CBB-AEB4-4BBA-BD24-66CF6064E3D2"}
 */
function doSearch(params) {
	var sf = params.searchField;
	if (sf) {
		var cnt;
		var oper = "=";
		var ss = params.searchString;
		if (ss) {
			if (foundset.find()) {
				switch (params.searchOper) {
				case "ne":
					foundset[sf] = "!"+ss;
					break;
				case "bw":
					foundset[sf] = ss+"%";
					break;
				case "bn":
					foundset[sf] = "!"+ss+"%";
					break;
				case "ew":
					foundset[sf] = "%"+ss;
					break;
				case "en":
					foundset[sf] = "!%"+ss;
					break;
				case "cn":
					foundset[sf] = "%"+ss+"%";
					break;
				case "nc":
					foundset[sf] = "!%"+ss+"%";
					break;
				case "nu":
					foundset[sf] = "^=";
					break;
				case "nn":
					foundset[sf] = "!^=";
					break;
				case "in":
					foundset[sf] = "in("+ss+")";
					break;
				case "ni":
					foundset[sf] = "!in("+ss+")";
					break;
				default:
					foundset[sf] = ss;
					break;
				}
				cnt = foundset.search();
				if (!cnt) {
					foundset.loadAllRecords();
				}
			}
		} else {
			if (params.searchOper == "nu" || params.searchOper == "nn") {
				if (foundset.find()) {
					if (params.searchOper == "nu") {
						foundset[sf] = "^=";
					} else {
						foundset[sf] = "!^=";
					}
					cnt = foundset.search();
					if (!cnt) {
						foundset.loadAllRecords();
					}
				}
			}
		}
	}
}
