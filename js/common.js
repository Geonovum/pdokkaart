var currentStep = 1;

function goTo(step) {	
	//de-activate markers and routes 
    //manageRoutes(0);
    //manageMarkers(0);
	
	//if add content/drag markers incorectly exited, then switch navigation and
	//keyboard controls back on
    //osMap.controls[0].activate();
	//osMap.controls[1].activate();			
	
	//make sure correct radio states for each step
	if (step == 2){		
		//document.getElementById("radio_routes_6").checked = "false";
		document.getElementById("editmarker5").checked = "true";
	}
	
	if (step == 3){
		document.getElementById("editmarker5").checked = "false";
		document.getElementById("radio_routes_6").checked = "true";
	}
	
	//hide text editor functionality
	document.getElementById("savemarkerinfo").style.visibility = "hidden";
	hideEditor();

    //set container for css styling i.e. make tabs active on selection	
	document.getElementById("step" + currentStep).className = "container";
	currentStep = step;
	document.getElementById("step" + currentStep).className = "container active";
	return false;
}

//set images for markers into html
function selectSet(set) {	
	document.getElementById("mapmarkers").className ="row " + set;
	
    if(document.getElementById("marker1").checked == true){
		setMarkerImage(1);
	}
    if(document.getElementById("marker2").checked == true){
		setMarkerImage(2);
	}	
    if(document.getElementById("marker3").checked == true){
		setMarkerImage(3);
	}	
}

//select output code at Step 4
function selectCode() {
	document.getElementById("codeoutput").select();
	return false;
}

//show ck editor
function showEditor() {
	document.getElementById("texteditor").style.display = "block";
	//document.getElementById("editor1").focus();
	return false;
}

//hide ck editor
function hideEditor() {
	document.getElementById("texteditor").style.display = "none";
	return false;
}

//add help functionality to link to correct part of html page 
function addHelp() {
	var pageLinks = document.getElementsByTagName("A");
	var pageLinksLength = pageLinks.length;
	for (var i = 0; i<pageLinksLength; i ++) {
		var currentLink = pageLinks[i];
		var currentClass = currentLink.className;
		if (currentClass !== "") {
			if (currentClass === "help") {
				currentLink.onclick = function () {
					var helpWin = window.open('mapbuilderhelp.html#help' + this.href.replace(/^.*?\#(\d+)$/, '$1'),'helpwin','menubar=1,toolbar=1,scrollbars=1,resizable=1,width=640,height=480');
					helpWin.focus();
					return false;
				}
			}
		}
	}
}