var pollServer = false;
var readRMQ = false;
var pingCooldown = false;

function togglePoll() {
	console.log('Now in function togglePoll() - global context');
	pollServer = document.getElementById("pollServer"); // pollServer is a textbox HTML element with ID pollServer
	console.log("var checkBox ID pollStatus is: ", pollServer.checked);
	if(pollServer.checked == true) {
		pollInterval = setInterval(function() {
			poll();
		}, 2000);
		poll();
	} else {
		clearInterval(pollInterval);
	}
}

function toggleReadRMQ() {
	console.log('Now in function toggleReadRMQ() - global context');
	readRMQ = document.getElementById("readRMQ"); // readRMQ is a textbox HTML element with ID readRMQ
	console.log("var checkBox ID readRMQ is: ", readRMQ.checked);
	sendreadqueuestatus();
}

function togglePingCooldown() {
	console.log('Now in function togglePingCooldown() - global context');
	pingCooldown = document.getElementById("pingCooldown"); // pingCooldown is a textbox HTML element with ID pingCooldown
	console.log("var checkBox ID pingCooldown is: ", pingCooldown.checked);
	sendpingcooldownstatus();
}

//localStorage has been extended beyond the cookie solution I found first. It now stores key,value pairs and has larger capacity!
//See: https://blog.logrocket.com/the-complete-guide-to-using-localstorage-in-javascript-apps-ba44edb53a36/ and https://www.taniarascia.com/how-to-use-local-storage-with-javascript/


$(function(){
    var test = localStorage.getItem('pollServerFlag') === 'true'? true: false;
    $('#pollServer').prop('checked', test || false);
});

$('#pollServer').on('change', function() {
    localStorage.setItem('pollServerFlag', $(this).is(':checked'));
    console.log('Is pollServer turned on? ', $(this).is(':checked'));
});


$(function(){
    var test = localStorage.getItem('readRMQFlag') === 'true'? true: false;
    $('#readRMQ').prop('checked', test || false);
});

$('#readRMQ').on('change', function() {
    localStorage.setItem('readRMQFlag', $(this).is(':checked'));
    console.log('Is readRMQ turned on? ', $(this).is(':checked'));
});

$(function(){
    var test = localStorage.getItem('pingCooldownFlag') === 'true'? true: false;
    $('#pingCooldown').prop('checked', test || false);
});

$('#pingCooldown').on('change', function() {
    localStorage.setItem('pingCooldownFlag', $(this).is(':checked'));
    console.log('Is pingCooldown turned on? ', $(this).is(':checked'));
});

/**************  FUNCTION  sendreadqueue status  ***************************************************************************************************/

$(document).ready(function () {
	
	sendreadqueuestatus = function () {

		var postData = {}
		postData["postRequestDataVal1"] = readRMQ.checked;
		postData["postRequestDataVal2"] = "true";

		console.log("Now in function sendreadqueuestatus with postRequestDataVal1 parameter set to: ", postData.postRequestDataVal1);

		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: "http:localhost:8088/jsonpingheatmap",
			data: JSON.stringify(postData), // Je kan dit doen of alleen de regel hieronder en var postData hierboven weglaten.
			dataType: 'json',
			cache: false,

			success: function (data) {

				var qReadStatusFromServer = data["readStatus"];
				var queuedMessages = data ["queuedMessages"];

				console.log("Returned from POST with readStatus: ", qReadStatusFromServer);
				console.log("Returned from POST with queuedMessages: ", queuedMessages);
				
				// Test if the WebApp turned on the read-RMQ process!! Take action if it didn't work: TBD!!!
				if ( ((qReadStatusFromServer === "ACTIVE") && readRMQ.checked) || ((qReadStatusFromServer == "IDLE") && !readRMQ.checked)) {
					console.log("Checkbox status and Server status are CONSISTENT!")
				}
				else if (readRMQ.checked) {
					console.log("ERROR: server read from queue status cannot be turned ON!")
				} 
				else {
					console.log("ERROR: server read from queue status cannot be turned OFF!")
				}
			}, // end of block success: 

			error: function (e) {

				var error_response = "<h4>Ajax Response Error</h4><pre>"
					+ e.responseText + "</pre>";
				$('#error_response').html(error_response);

				console.log("ERROR : ", e);
				$("#btn-login").prop("disabled", false);

			}
		});

	} // end of function sendreadqueuestatus
	

/**************  FUNCTION  sendpingcooldown status  ***************************************************************************************************/
	
	
	sendpingcooldownstatus = function () {

		var postData = {}
		postData["postRequestDataVal1"] = pingCooldown.checked;
		postData["postRequestDataVal2"] = "true";

		console.log("Now in function sindpingcooldownstatus with postRequestDataVal1 parameter set to: ", postData.postRequestDataVal1);

		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: "/toggle-cooldown-pingheat",
			data: JSON.stringify(postData), // Je kan dit doen of alleen de regel hieronder en var postData hierboven weglaten.
			dataType: 'json',
			cache: false,

			success: function (data) {

				var cooldownStatusFromServer = data["readStatus"];
				var queuedMessages = data ["queuedMessages"];

				console.log("Returned from POST with readStatus: ", cooldownStatusFromServer);
				console.log("Returned from POST with queuedMessages: ", queuedMessages);
				
				// Test if the WebApp turned on the read-RMQ process!! Take action if it didn't work: TBD!!!
				if ( ((cooldownStatusFromServer === "ACTIVE") && pingCooldown.checked) || ((cooldownStatusFromServer == "IDLE") && !pingCooldown.checked)) {
					console.log("Checkbox status and Server status are CONSISTENT!")
				}
				else if (pingCooldown.checked) {
					console.log("ERROR: server read from queue status cannot be turned ON!")
				} 
				else {
					console.log("ERROR: server read from queue status cannot be turned OFF!")
				}
			}, // end of block success: 

			error: function (e) {

				var error_response = "<h4>Ajax Response Error</h4><pre>"
					+ e.responseText + "</pre>";
				$('#error_response').html(error_response);

				console.log("ERROR : ", e);
				$("#btn-login").prop("disabled", false);

			}
		});

	} // end of function sendpingcooldown
	
	poll = function () {

		var postData = {}
		postData["postRequestDataVal1"] = "FEDSQ8";
		postData["postRequestDataVal2"] = "FEDGQ6"; 

		$("#btn-login").prop("disabled", false);

		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: "/show-pinger-matrix",
			data: JSON.stringify(postData), // Je kan dit doen of alleen de regel hieronder en var postData hierboven weglaten.
			dataType: 'json',
			cache: false,

			success: function (data) {



				var updatematrix = $('#matrix-update-checked').checked;
				var updatermq = $('#rmq-update-checked').checked;

//				console.log('Update PingerMatrix checked: ', updatematrix);
//				console.log('Update RMQ checked: ', updatermq);


				var pingMatrixData = data["pingMatrixData"];
				var pingNodeList = data["pingNodeList"];

				var colSize = pingNodeList.length;
				var rowSize = pingNodeList.length;

				console.log("colSize: ", colSize);
				$('#colSize').replaceWith(colSize);
				$("tr:has(td)").remove();
				$('#rowSize').replaceWith(rowSize);
//				console.log("SUCCESS : ", data);

				var tableRowHTML = '<tr><td>PingNodes</td>'; // first cell is empty
				for(var colCounter = 0; colCounter < colSize; colCounter++) {
					tableRowHTML += '<td>' + pingNodeList[colCounter] + '</td>';
				}              
				tableRowHTML += '</tr>';
//				console.log("tableRowHTML: " + tableRowHTML); 

				var pingMatrixData = data["pingMatrixData"];
				var cellIdPingHeatMap = new Map();				
				var pingCellData;
				
				for(var rowCounter = 0; rowCounter < rowSize; rowCounter++) {
					tableRowHTML += '<tr>RowNo: <td>' + pingNodeList[rowCounter] + '</td>'; // One extra cell per row for the row counter. 
					for(var colCounter = 0; colCounter < colSize; colCounter ++) {

//						var pingCellDataTest = {pingorig : "WIN219",pingdest : "FEDSQ8",pingsucc : "1",pingdheat : "10"}
//						console.log("pingCellDataTest: " + pingCellDataTest);
//						console.log("pingCellDataTest.pingOrig: " + pingCellDataTest.pingOrig);

						pingCellData = pingMatrixData[rowCounter*(colSize-1)+rowCounter+colCounter];

										
//						console.log("pingCellData: ", pingCellData);
//						console.log("pingCellData.pingOrig: " + pingCellData.pingOrig);

					
						var cellId = 'tdId_' + rowCounter + '_' + colCounter;
						
						cellIdPingHeatMap.set(cellId, pingCellData.pingHeat); // Set the HashMap entry for the cellId with the pingHeat, for coloring the table.						
						
						tableRowHTML += '<td id=' + cellId + '>' 
						+ '[Src, Dest]: ' + pingCellData.pingOrig + ', ' +pingCellData.pingDest + '<br>'
						+ '[LastSucc, Heat]: ' + pingCellData.lastPingResult + ", " + pingCellData.pingHeat + '</td>';

					}
				}

				// Test the value of one cell
				//console.log("cellIdPingHeatMap(tdId_0_0): " + cellIdPingHeatMap.get("tdId_0_0"));						
				
				
				// Print the whole hashmap to the console

				$('#pingermatrix').append(tableRowHTML);
				
				console.log("BEFORE print PingHeat");

				for (let cellIdInMap of cellIdPingHeatMap.keys()) {
					let pingHeatInMap = cellIdPingHeatMap.get(cellIdInMap);
					//console.log("cellIdInMap: " + cellIdInMap + ", pingHeat: " +  pingHeatInMap);

					if(pingHeatInMap == 1) {
							$('#'+cellIdInMap).css('background-color', '#FFF8DC');
					}
					if(pingHeatInMap == 2) {
							$('#'+cellIdInMap).css('background-color', '#FFE4C4');
					}
					if(pingHeatInMap == 3) {
							$('#'+cellIdInMap).css('background-color', '#DEB887');			
					}
					if(pingHeatInMap == 4) {
							$('#'+cellIdInMap).css('background-color', '#DAA520');			
					}
					if(pingHeatInMap == 5) {
							$('#'+cellIdInMap).css('background-color', '#CD843F');			
					}
					if(pingHeatInMap == 6) {
							$('#'+cellIdInMap).css('background-color', '#D2691E');			
					}
					if(pingHeatInMap == 7) {
							$('#'+cellIdInMap).css('background-color', '#A0522D');			
					}
					if(pingHeatInMap == 8) {
							$('#'+cellIdInMap).css('background-color', '#A42A2A');			
					}
					if(pingHeatInMap == 9) {
							$('#'+cellIdInMap).css('background-color', '#A42A2A');			
					}
					if(pingHeatInMap == 10) {
							$('#'+cellIdInMap).css('background-color', '#C71565');			
					}


				}	
				
				/*
				$('#tdId_0_0').css('background-color', 'yellow');
				$('#tdId_1_1').css('background-color', 'purple');
				$('#tdId_2_2').css('background-color', 'red');
				$('#tdId_3_3').css('background-color', 'green');
				*/

				$("#btn-login").prop("disabled", false);

			},

			error: function (e) {

				var error_response = "<h4>Ajax Response Error</h4><pre>"
					+ e.responseText + "</pre>";
				$('#error_response').html(error_response);

				console.log("ERROR : ", e);
				$("#btn-login").prop("disabled", false);

			}
		}); // close selector block $.ajax
	} // close block poll = function () 


	var checkBox = document.getElementById("pollServer");
	var text = document.getElementById("pollStatus");
	console.log("In context $(document).ready() -- var checkBox status: ", checkBox.checked);
	if(checkBox.checked == true) {
		pollInterval = setInterval(function() {
			poll();
		}, 2000);
		poll();
	} else if(typeof pollInterval !== 'undefined') { // This is the only correct way to test if the variable exists. See https://www.tutorialrepublic.com/faq/how-to-check-if-a-variable-exists-or-defined-in-javascript.php
		clearInterval(pollInterval);
	}


} // close $(document).ready(function () { -- inside: 


); //close selector: $(document).ready(

