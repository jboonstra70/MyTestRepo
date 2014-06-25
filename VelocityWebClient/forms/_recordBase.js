/**
 * @param request
 * 
 * @properties={typeid:24,uuid:"D725E645-D0EA-4FD3-9A80-7E3137FA9E79"}
 */
function vr_getContext(request) {
	switch(request.method) {	
		case 'POST':
			return doPost(request.parameters);
		default:
			return doGet(request.parameters);
	}
}

/**
 * @properties={typeid:24,uuid:"7DB4CB69-5AF3-412E-B6BF-1332F7B3AC56"}
 */
function loadContext() {
	var context = {};
	return context;
}

/**
 * @param params
 * 
 * @properties={typeid:24,uuid:"268C9A96-4C77-45F4-B7EB-B5C6F51069CC"}
 */
function doGet(params) {
	var context = loadContext();
	
	if (params.create) { // new record
		context.record = null;
		context.current = null;
	} else {
		if (params.index) { // go to the index
			foundset.setSelectedIndex(params.index);
		} else if (params.next) { // go to the next company
			if (foundset.getSelectedIndex() < foundset.getSize()) {
				foundset.setSelectedIndex(foundset.getSelectedIndex()+1);
			}
		} else if (params.prev) { // go to the previous company
			if (foundset.getSelectedIndex() > 1) {
				foundset.setSelectedIndex(foundset.getSelectedIndex()-1);
			}
		}
		context.current = foundset.getSelectedIndex();
		context.record = foundset.getSelectedRecord();
	}
	
	return plugins.Velocity.createResponse(context);
}

/**
 * @param params
 * 
 * @properties={typeid:24,uuid:"CF302553-94F2-469E-84E7-4E928BD533A6"}
 */
function doPost(params) {
	var context = loadContext();
	if (validate(params, context)) {
		
		insertOrUpdate(params);
		
		save(params, context);
		
		// set the index and record:
		context.current = foundset.getSelectedIndex();
		context.record = foundset.getSelectedRecord();
		context.total = foundset.getSize();

	} else {
		// feed back the form with the data submitted:
		context.record = params;
	}
	return plugins.Velocity.createResponse(context);
}

/**
 * @param params
 * @param context
 * 
 * @properties={typeid:24,uuid:"E453E510-36B3-4BDF-BBD3-EA14443C6C2F"}
 */
function save(params, context) {
	var pks = databaseManager.getTable(foundset).getRowIdentifierColumnNames();
	var fields = context.fields;
	for (var i = 0; i < fields.length; i++) {
		var prop = fields[i];
		if (pks.indexOf(prop) == -1) {
			foundset[prop] = params[prop];
		}
	}
	databaseManager.saveData(foundset.getSelectedRecord());
}

/**
 * @param params
 * 
 * @properties={typeid:24,uuid:"034CFAFA-77F9-4744-B76A-B9BF7C644BF2"}
 */
function insertOrUpdate(params) {
	// see sub form
}

/**
 * @param params
 * @param context
 * 
 * @properties={typeid:24,uuid:"2C1595C2-905A-4EEE-BD8B-788D517617A6"}
 */
function validate(params, context) {
	// see sub form
	return true;
}
