/**
 * @param request
 * 
 * @properties={typeid:24,uuid:"6D7F8B9A-B7C5-45D4-B762-ABAEDC5D06D3"}
 */
function vr_getContext(request) {
	var context = loadContext();
	var params = request.parameters;
	
	if (request.method == "POST") { // delete request
		if (params.index) {
			foundset.deleteRecord(params.index);
		}
	}
	
	if (params.reload) {
		foundset.sort("");
		foundset.loadAllRecords();
	}
	
	if (params.sort) {
		var current = foundset.getCurrentSort();
		context.sortOrder = "asc";
		if (current.indexOf(params.sort) > -1) {
			if (current.indexOf("asc") > -1) {
				current = params.sort + " desc";
				context.sortOrder = "desc";
			} else {
				current = params.sort + " asc";
			}
		} else {
			current = params.sort + " asc";
		}
		foundset.sort(current);
		context.sort = params.sort;
	}
	
	context.foundset = foundset;
	return plugins.Velocity.createResponse(context);
}

/**
 * @properties={typeid:24,uuid:"4E9DE0FA-0ED5-4F71-ADE5-62462EAC8563"}
 */
function loadContext() {
	return {};
}
