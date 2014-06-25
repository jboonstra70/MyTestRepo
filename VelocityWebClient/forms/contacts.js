/**
 * @properties={typeid:24,uuid:"E7678F50-01D5-49AE-9139-4B45562F714C"}
 */
function loadContext() {
	var context = _super.loadContext();
	context.title = "Contacts";
	context.columnOrder = ["contact_id", "name_first", "name_last", "job_title", "email"];
	context.columns = {
           contact_id: "ID", 
           name_first: "First name", 
           name_last: "Last name", 
           job_title: "Industry", 
           email: "Type"
    };
	context.detail = "contact.html";
	return context;
}

/**
 * @param request
 * 
 * @properties={typeid:24,uuid:"9DF8B03E-FC92-4861-BD90-21F1D40FAB4A"}
 */
function vr_getContext(request) {
	var response = _super.vr_getContext(request);
	if (request.extension == "xls") {
		response.template = "excel.html";
	}
	return response;
}
