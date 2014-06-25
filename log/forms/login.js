/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"8E45091A-AD16-4786-95AE-13E2A93699CF"}
 */
var error = "";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"685082A2-DBF2-4522-93BD-D1C6EF93D907"}
 */
var pass = "";

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"2FAF1698-07C6-4B04-8221-47C05B85D1D1"}
 */
var user = "";

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"EA3354FD-8DD2-4D5B-B82C-30468DAC8C7B"}
 */
function onAction(event) {
	error = "";
	var result = security.authenticate('auth','authenticate',[user, pass]);
	if (!result) {
		user = "";
		pass = "";
		error = 'Bad credentials!';
	}
}
