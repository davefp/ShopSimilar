const TEST_IMG = "shopify_office_lamps.png";
const HIGHLIGHT_SIZE = 25;

/* We can get this form JS, it's just a pain in the ass to parse out and I'm too lazy to do it. */
const CANVAS_BORDER_WIDTH = 2;

var selectedSwatch = null;

function selectSwatch(swatch) {
	if( selectedSwatch != null ) {
		selectedSwatch.id = "";
	}
	
	swatch.id = "selectedSwatch";
	selectedSwatch = swatch;
}

function addUserImage(easelId, canvasId, canvasOverlayId) {
	var easel = document.getElementById(easelId);
	var canvas = document.getElementById(canvasId);
	var canvasOverlay = document.getElementById(canvasOverlayId);
	var context = canvas.getContext("2d");
	
	var img = new Image();
	img.onload = function() {
		easel.style.width = img.width + (2*CANVAS_BORDER_WIDTH) + "px";
		easel.style.height = img.height + (2*CANVAS_BORDER_WIDTH) + "px";
		canvas.style.width = img.width + "px";
		canvas.style.height = img.height + "px";
		canvasOverlay.style.width = img.width + "px";
		canvasOverlay.style.height = img.height + "px";
		
		easel.width = img.width;
		easel.height = img.height;
		canvas.width = img.width;
		canvas.height = img.height;
		canvasOverlay.width = img.width;
		canvasOverlay.height = img.height;
		
		canvas.style.display = "block";
		canvasOverlay.style.display = "block";
		context.drawImage(img, 0, 0, img.width, img.height);
	}
	
	img.src = TEST_IMG;
}

function handleCanvasClick(canvas, event) {
	// If the user hasn't selected a swatch, we've nothing to do.
	if( selectedSwatch == null ) {
		return;
	}
	
	var clickX = event.pageX - canvas.offsetLeft;
	var clickY = event.pageY - canvas.offsetTop;
	
	var context = canvas.getContext("2d");
	
	
}