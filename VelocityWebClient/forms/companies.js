/**
 * @properties={typeid:24,uuid:"05B7F27B-4D5C-43C9-AB9F-8E9F9DB26406"}
 */
function loadContext() {
	var context = _super.loadContext();
	context.title = "Companies";
	context.columnOrder = ["company_id", "company_name", "company_category", "company_industry", "company_type_id" ];
	context.columns = {
           company_id: "ID", 
           company_name: "Name", 
           company_category: "Category", 
           company_industry: "Industry", 
           company_type_id: "Type"
    };
	context.detail = "company.html";
	return context;
}
