const TEST_IMG = "shopify_office_lamps.png";
var selectedSwatch;

function selectSwatch(swatch) {
	if( selectedSwatch ) {
		selectedSwatch.id = "";
	}
	
	swatch.id = "selectedSwatch";
	selectedSwatch = swatch;
}

function addUserImage(canvasId) {
	var canvas = document.getElementById(canvasId);
	var context = canvas.getContext("2d");
	
	var img = new Image();
	img.onload = function() {
		canvas.style.width = img.width + "px";
		canvas.style.height = img.height + "px";
		
		canvas.width = img.width;
		canvas.height = img.height;
		
		context.drawImage(img, 0, 0, img.width, img.height);
	}
	
	img.src = TEST_IMG;
}