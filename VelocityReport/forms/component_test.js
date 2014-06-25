/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"0E42C9F9-95DF-4BB3-B70D-2B74A9CD6336"}
 */
function onActionPreviewToComponent(event) {
	updateComponent();
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"24FB8E0D-7198-470A-815F-20EAF660272D"}
 */
function onShow(firstShow, event) {
	elements.parentGroup.visible = false;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"800FA6C2-E8FF-4B25-9E20-1C4CA148C837"}
 */
function onActionUpdateComponent(event) {
	if (viewer) {
		viewer.toolbarVisible = !viewer.toolbarVisible;
		viewer.statusVisible = !viewer.statusVisible;
	}
}

/**
 * @properties={typeid:24,uuid:"5F7E1686-6765-493E-B263-B0828364759E"}
 */
function updateComponent() {
	var template = "testTemplate.html";
	//var template = "sample.xhtml";
	if (viewer) {
		viewer.update(template, getReportContext());
	} else {
		var previewParams = {
			showToolBar: true,
			showStatus: true,
			border: "EmptyBorder,0,0,0,0",
			hScrollbar: PREVIEW.HSCROLLBAR_NEVER,
			vScrollbar: PREVIEW.VSCROLLBAR_ASNEEDED
		}
		plugins.VelocityReport.setDefaultPreviewParameters(previewParams);
		if (useCallback == 0) {
			viewer = plugins.VelocityReport.previewToComponent(elements.bean_panel, template, getReportContext());
		} else {
			viewer = plugins.VelocityReport.previewToComponent(elements.bean_panel, template, getReportContext(), viewerSaveCallback);
		}
	}
}

/**
 * Handle record selected.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"E5EAB9E0-BAFA-47A9-B3BD-E43B3A540DAA"}
 */
function onRecordSelection(event) {
	updateComponent();
}

/**
 * @param {Object} msg
 * @param {Object} num
 * @param {Object} bool
 *
 * @properties={typeid:24,uuid:"4135D2C7-C85F-4FB0-83A4-3AF01A23A430"}
 */
function testCallback(msg, num, bool) {
	plugins.dialogs.showInfoDialog("Received","Received from HTML: '"+msg+"', "+num+", "+bool,"OK");
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"F65D0321-8245-41C9-8F4D-D4C8310EBCAA"}
 */
function onActionClear(event) {
	if (viewer) {
		viewer.update('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"><head></head><body><p>&nsbp;</p></body></html>', {fromString: true});
	}
}
