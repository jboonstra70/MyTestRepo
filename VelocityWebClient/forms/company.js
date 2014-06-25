/**
 * @properties={typeid:24,uuid:"666C957D-44C3-4046-8B76-D415185BE383"}
 */
function loadContext() {
	var context = _super.loadContext();
	context.title = "Company detail";
	context.fields = ["company_id", "company_name", "company_category", "company_industry", "company_type_id", "company_email", "company_url", "company_description" ];
	context.errors = [];
	context.total = foundset.getSize();
	context.list = "companies.html";
	return context;
}

/**
 * @param params
 * @param context
 * 
 * @properties={typeid:24,uuid:"0156BD01-73D5-40A6-A263-2224F51D750B"}
 */
function validate(params, context) {
	if (!params.company_name) {
		context.errors.push("Name required");
	}
	if (!params.company_category) {
		context.errors.push("Category required");
	}
	if (!params.company_industry) {
		context.errors.push("Industry required");
	}
	if (!params.company_email) {
		context.errors.push("Email required");
	} else {
		var match = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
		if (!match.test(params.company_email)) {
			context.errors.push("Email is not valid");
		}
	}
	return context.errors.length == 0;
}

/**
 * @param params
 * 
 * @properties={typeid:24,uuid:"FF8712D8-375A-4E7C-A4EF-A5471B5BBC9F"}
 */
function insertOrUpdate(params) {
	if (params.company_id) { // it's an update
		if (params.company_id != foundset.company_id) {
			if (foundset.find()) {
				foundset.company_id = params.company_id;
				foundset.search();
			}
		}
	} else { // it's an insert
		foundset.setSelectedIndex(foundset.newRecord());
	}
}
