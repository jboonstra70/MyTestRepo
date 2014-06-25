/**
 * @param request
 * 
 * @properties={typeid:24,uuid:"E0B27AC8-133D-48BF-A0FC-00B6B578D4AA"}
 */
function vr_getContext(request) {
	var context = {};
	var response;
	try {
		if (request.parameters.showError) {
			if (request.parameters.showError == "java") {
				throw new java.lang.RuntimeException("Something bad happened in Java!");
			}
			// do something buggy: here we just don't create the response and later we will try to access it
		} else {
			// streams a PDF file from the reports folder (can be anywhere on the server):
			if (request.parameters.file) {
				return plugins.Velocity.createFileResponse(plugins.VelocityReport.getReportFolder()+request.parameters.file, "application/pdf");
			}
			
		 	response = plugins.Velocity.createResponse(context);
		}
		
		// add a header to the response (this will break if response is null!)
		response.addHeader("special","specialValue");
		
		// test if a coookie was set, if not create and add it:
		if (!request.cookies.test) {
			var cookie = plugins.Velocity.createCookie("test","hello world");
			cookie.expiryDate = new Date(2012, 6, 15);
			response.addCookie("test",cookie);
		} else {
			application.output(request.cookies.test);
		}
		
		// test if a value is in the session, otherwise add it:
		if (!request.session.myID) {
			var myID = application.getUUID();
			response.addSessionAttribute("myID",myID);
		} else {
			application.output(request.session.myID);
		}
	} catch (e) {
		response = plugins.Velocity.createErrorResponse(500, e.message, "index.html", e);		
	}
	return response;
}
