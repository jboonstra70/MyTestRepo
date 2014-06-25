/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"32A89C90-63C5-4D3B-BBDF-B835F2B9CFE7"}
 */
function onActionMainForm(event) {
	forms.velocity_reports.controller.show();
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"3B475FE5-C340-4C4E-A8FD-4376727506B4"}
 */
function onActionOpenModeless(event) {
	application.showFormInDialog(forms.velocity_modeless,-1,-1,-1,-1,"test",true,false,"modelessTest",false);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"18A68905-EF6F-438D-91E9-62F128CB5039"}
 */
function onActionOpenModal(event) {
	application.showFormInDialog(forms.velocity_reports,-1,-1,-1,-1,"test",true,false,"modalTest",true);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"ECDC0DDF-97F3-47C4-A705-34A62D1CCFDA"}
 */
function onActionGotoComponentTest(event) {
	forms.component_test.controller.show();
}
