/**
 * @type {Date}
 *
 * @properties={typeid:35,uuid:"9C39191B-89A7-4744-A6FB-43F8F4DD8AC4",variableType:93}
 */
var dateTest = new Date();

/**
 * Callback method for when solution is opened.
 *
 * @properties={typeid:24,uuid:"8F6E5743-0AB0-4664-8949-88207A01C4E6"}
 */
function onSolutionOpen() {
	// this call pushes the fonts installed in the /fonts folder of the reports folder to the client
	plugins.VelocityReport.installFonts(fontCallback);
}

/**
 * @properties={typeid:24,uuid:"4C502F80-A458-4519-940E-FC35F31FD94E"}
 */
function fontCallback(result) {
	// gives some feedback about the fonts installed
	application.output(result);
}
