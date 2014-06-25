/**
 * @properties={typeid:24,uuid:"A896930B-E32E-4BB1-AD20-841D7419BBC1"}
 */
function loadContext() {
	var context = _super.loadContext();
	context.title = "Contact detail";
	context.fields = ["contact_id", "name_first", "name_last", "job_title", "email", "name_prefix", "name_suffix", "phone_direct"];
	context.errors = [];
	context.total = foundset.getSize();
	context.list = "contacts.html";
	return context;
}

/**
 * @param params
 * @param context
 * 
 * @properties={typeid:24,uuid:"5AF34025-23EC-442B-97EB-245B0572CCF9"}
 */
function validate(params, context) {
	if (!params.name_first) {
		context.errors.push("First Name required");
	}
	if (!params.name_last) {
		context.errors.push("Last Name required");
	}
	if (!params.job_title) {
		context.errors.push("Job Title required");
	}
	if (!params.email) {
		context.errors.push("Email required");
	} else {
		var match = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)
		if (!match.test(params.email)) {
			context.errors.push("Email is not valid");
		}
	}
	return context.errors.length == 0;
}

/**
 * @param params
 * 
 * @properties={typeid:24,uuid:"8B8F6DC8-59C4-478B-8B13-08A237DBADF4"}
 */
function insertOrUpdate(params) {
	if (params.contact_id) { // it's an update
		if (params.contact_id != foundset.contact_id) {
			if (foundset.find()) {
				foundset.contact_id = params.contact_id;
				foundset.search();
			}
		}
	} else { // it's an insert
		foundset.setSelectedIndex(foundset.newRecord());
	}
}
