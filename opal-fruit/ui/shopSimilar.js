const TEST_IMG = "http://s3.amazonaws.com/37assets/svn/shopify_office_lamps.png";
const HIGHLIGHT_SIZE = 25;

/* We can get this form JS, it's just a pain in the ass to parse out and I'm too lazy to do it. */
const CANVAS_BORDER_WIDTH = 2;

var dragEnabled = false;

var selectedSwatch = null;
var swatchPositions = [
	[null, null],
	[null, null],
	[null, null],
	[null, null],
	[null, null]
];

function selectSwatch(swatch, canvasId) {
	if( selectedSwatch != null ) {
		selectedSwatch.setAttribute("class", "");
	}
	
	swatch.setAttribute("class", "selectedSwatch");
	selectedSwatch = swatch;
	
	redrawSwatches(document.getElementById(canvasId));
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

function getSwatchIndex() {
	return selectedSwatch.id.substr(2);
}

function handleCanvasClick(canvas, event) {
	// If the user hasn't selected a swatch, we've nothing to do.
	if( selectedSwatch == null ) {
		return;
	}
	
	dragEnabled = true;
	
	var clickX = event.pageX - canvas.offsetLeft;
	var clickY = event.pageY - canvas.offsetTop;
	var swatchIndex = getSwatchIndex();
	
	swatchPositions[swatchIndex][0] = clickX;
	swatchPositions[swatchIndex][1] = clickY;
	
	redrawSwatches(canvas);
}

function handleCanvasMouseMove(canvas, event) {
	// If the user hasn't clicked on a swatch, we've nothing to do.
	if( !dragEnabled ) {
		return;
	}

	var clickX = event.pageX - canvas.offsetLeft;
	var clickY = event.pageY - canvas.offsetTop;
	var swatchIndex = getSwatchIndex();
	
	swatchPositions[swatchIndex][0] = clickX;
	swatchPositions[swatchIndex][1] = clickY;
	
	redrawSwatches(canvas);
}

function handleCanvasMouseUp(imageCanvasId, event) {
	dragEnabled = false;
	
	var imageCanvas = document.getElementById("imageCanvasId");
	var context = imageCanvas.getContext("2d");
	
	var clickX = event.pageX - canvas.offsetLeft;
	var clickY = event.pageY - canvas.offsetTop;
	
	var imageData = context.getImageData(clickX, clickY, HIGHLIGHT_SIZE, HIGHLIGHT_SIZE);
	alert( imageData );
}

function redrawSwatches(canvas) {
	var selectedSwatchIndex = getSwatchIndex();
	
	// Clear the old highlights.
	canvas.width = canvas.width;
	
	// Set colours.
	var context = canvas.getContext("2d");
	context.lineWidth = 2;
	context.fillStyle = "rgba(255, 255, 255, 0.75)";
	context.strokeStyle = "rgba(255, 255, 255, 1.0)";
	
	// Draw the current highlights.
	for( var position in swatchPositions )
	{
		posX = swatchPositions[position][0];
		posY = swatchPositions[position][1];
		
		// Quit once we've drawn all valid swatches.
		if( posX != null && posY != null ) {
			
			context.beginPath();
			context.rect(posX, posY, HIGHLIGHT_SIZE, HIGHLIGHT_SIZE);
			context.closePath();
			context.fill();
			
			// Draw a border around the current swatch.
			if( position == selectedSwatchIndex ) {
				context.beginPath();
				context.rect(posX-1, posY-1, HIGHLIGHT_SIZE+1, HIGHLIGHT_SIZE+1);
				context.closePath();
				context.stroke();
			}
		}
	}
}