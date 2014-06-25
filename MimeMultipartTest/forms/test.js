/**
 * @properties={typeid:24,uuid:"FE47B6C0-4E4F-4B26-8A98-6F81AABE02A1"}
 */
function vr_getContext(request) {
	
	if (request.multipart) {
		/** @type {Array} */
		var parts = request.parts; // you could put a breakpoint here to examine the content of the request object, and the parts array
		if (parts && parts.length > 0) { 
			for (var i = 0; i < parts.length; i++) {
				var part = parts[i];
				for (var prop in part) {
					var value = part[prop];
					application.output(prop + ': ' + value,LOGGINGLEVEL.DEBUG);
				}
			}
		}
	}
	var context = {result: "OK"};
	// if everything was ok, return the response:
	return plugins.Velocity.createResponse(context);
	// otherwise we could return an error response:
	// return plugins.Velocity.createErrorResponse(400);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"72A664F5-63AA-4661-B876-1F55A787520F"}
 */
function onAction(event) {
	// get a PDF file to attach:
	var file = plugins.file.showFileOpenDialog(1,null,false,['PDF Files', 'pdf']);
	if (file) {
		
		// Create the mime multipart object:
		var mm = plugins.Velocity.createMimeMultipart();
	
		// set the content of the first part:
		var jmf = <JMF xmlns="http://www.CIP4.org/JDFSchema_1_1" SenderID="JMFClient"
TimeStamp="2005-07-07T13:15:56+01:00" Version="1.4" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<Command ID="C0001" Type="SubmitQueueEntry" xsi:type="CommandSubmitQueueEntry">
<QueueSubmissionParams Hold="true" URL="cid:JDF1@hostname.com" />
</Command>
</JMF>;
		mm.addBodyPart('<?xml version="1.0" encoding="UTF-8"?>'+jmf.toString(),{
			'Content-Type':'application/vnd.cip4-jmf+xml', 
			'Content-Transfer-Encoding':'8bit'
		});
	
		// set the content of the second part:
		var jdf = <JDF ID="ID_20081215_110341" Type="Product" 
		xmlns="http://www.CIP4.org/JDFSchema_1_1"
		   Status="Waiting" Version="1.2" xsi:type="Product" JobPartID="1"
		   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
		MaxVersion="1.2" ICSVersions="Base_L1-1.0"
		   DescriptiveName="Product"
		   xsi:schemaLocation="http://www.CIP4.org/JDFSchema_1_1 
		http://www.cip4.org/Schema/JDFSchema_1_2/JDF.xsd">
		   <ResourcePool>
		     <Component ID="OutputComponent" Class="Quantity" Status="Unavailable"
		       ComponentType="FinalProduct" DescriptiveName="Product"/>
		     <Component ID="ID_20081216" Class="Quantity" Status="Unavailable" 
		ProductType="Body"
		       ComponentType="PartialProduct" DescriptiveName="Page Section" 
		ReaderPageCount="12"/>
		   </ResourcePool>
		   <ResourceLinkPool>
		     <ComponentLink rRef="OutputComponent" Usage="Output"/>
		     <ComponentLink rRef="ID_20081216" Usage="Input"/>
		   </ResourceLinkPool>
		   <AuditPool>
		     <Created AgentName="Adobe JDFProdDef" 
		TimeStamp="2008-12-15T11:03:41Z" AgentVersion="2.0"/>
		   </AuditPool>
		   <JDF ID="ID_20081215" Type="Product" Status="Waiting" 
		xsi:type="Product" JobPartID="1.1"
		     DescriptiveName="Page Section">
		     <ResourceLinkPool>
		       <ComponentLink rRef="ID_20081216" Usage="Output"/>
		       <ArtDeliveryIntentLink rRef="ID_20081217" Usage="Input"/>
		       <LayoutIntentLink rRef="ID_20081220" Usage="Input"/>
		       <ColorIntentLink rRef="ID_20081221" Usage="Input"/>
		     </ResourceLinkPool>
		     <ResourcePool>
		       <ArtDeliveryIntent ID="ID_20081217" Class="Intent" Status="Available">
		         <ArtDelivery ArtDeliveryType="DigitalFile">
		           <RunListRef rRef="ID_20081219"/>
		         </ArtDelivery>
		       </ArtDeliveryIntent>
		       <RunList ID="ID_20081219" Class="Parameter" Pages="011" 
		Status="Available">
		         <LayoutElement>
		           <FileSpec URL="file:///C%3A/Documents%20and%20Settings/Path/to/Your/Document.pdf" />
		         </LayoutElement>
		       </RunList>
		       <LayoutIntent ID="ID_20081220" Class="Intent" Status="Available">
		         <FinishedDimensions DataType="ShapeSpan" 
		Preferred="595.27600098 422.361999515 0"/>
		       </LayoutIntent>
		       <ColorIntent ID="ID_20081221" Class="Intent" Status="Available">
		         <ColorStandard DataType="NameSpan" Preferred="CMYK"/>
		         <ColorsUsed/>
		       </ColorIntent>
		     </ResourcePool>
		   </JDF>
		</JDF>;
		mm.addBodyPart('<?xml version="1.0" encoding="UTF-8"?>'+jdf.toString(),{
				'Content-Type':'application/vnd.cip4-jdf+xml', 
				'Content-Transfer-Encoding':'8bit', 
				'Content-ID':'<JDF1@hostname.com>',
				'Content-Disposition': 'attachment; filename="Ticket01.jdf";'
			}
		);
	
		// set the content of the third part (the file):
		mm.addFilePart(file,{
			'Content-Type': 'application/pdf',
			'Content-ID': '<Asset01@hostname.com>',
			'Content-Transfer-Encoding': 'binary'
		});
		
		// set the post to be multipart/related:
		mm.related = true;
		
		try {
			
			// if used synchronously we can do:
			// var result =	plugins.Velocity.postMimeRequest('http://localhost:8080/servoy-service/velocity/MimeMultipartTest/test',mm);
			// if (result) {
			//	application.output(result, LOGGINGLEVEL.INFO);
			//} else {
			//	application.output('Post was sent but we received no result and no error', LOGGINGLEVEL.INFO);
			//}
			
			// used asynchronously we pass a function to receive the result:
			plugins.Velocity.postMimeRequest('http://localhost:8080/servoy-service/velocity/MimeMultipartTest/test',mm,callbackMimePost);
			//plugins.Velocity.postMimeRequest('http://localhost:8181/bambi/jmf/01-Suprasetter105-1',mm,callbackMimePost);
			//plugins.Velocity.postMimeRequest('http://posttestserver.com/post.php?dir=pat',mm,callbackMimePost);
		
		} catch (e) {
			application.output(e, LOGGINGLEVEL.ERROR);
		}
	}
}

/**
 * @properties={typeid:24,uuid:"8A0C0765-7BEB-49F3-9519-8840ED6240C3"}
 */
function callbackMimePost(result, error) {
	if (error) {
		application.output(error, LOGGINGLEVEL.ERROR);
	} else if (result) {
		application.output(result, LOGGINGLEVEL.INFO);
	} else {
		application.output('Post was send but we received no result and no error', LOGGINGLEVEL.INFO);
	}
}
