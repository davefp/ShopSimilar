const POST_URL = "localhost:8080/colorData";

/* We'll do image upload eventually, for now just hardcode an image. */
const TEST_IMG = "http://localhost:8080/ui/shopify_office_lamps.png";

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
	// If the user hasn't clicked on a swatch, we've nothing to do.
	if( selectedSwatch == null ) {
		return;
	}
	
	dragEnabled = false;
	
	var imageCanvas = document.getElementById(imageCanvasId);
	var context = imageCanvas.getContext("2d");
	
	var clickX = event.pageX - imageCanvas.offsetLeft;
	var clickY = event.pageY - imageCanvas.offsetTop;
	
	var imageData = context.getImageData(clickX, clickY, HIGHLIGHT_SIZE, HIGHLIGHT_SIZE).data;
	
	var r=0;
	var g=0;
	var b=0;
	
	// Extract the colour data.
	for (var i=0; i < imageData.length; i += 4) {
		r += imageData[i];
		g += imageData[i+1];
		b += imageData[i+2];
	}
	
	// Set the swatch to the average colour.
	var numberOfPixels = imageData.length/4;
	
	r = r/numberOfPixels;
	g = g/numberOfPixels;
	b = b/numberOfPixels;
	
	selectedSwatch.style.backgroundColor = "rgb(" + Math.floor(r) + "," + Math.floor(g) + "," + Math.floor(b) + ")";
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

function sendSwatches() {
	// Create the swatch objects.
	var sw0 = document.getElementById("sw0");
	var sw1 = document.getElementById("sw1");
	var sw2 = document.getElementById("sw2");
	var sw3 = document.getElementById("sw3");
	var sw4 = document.getElementById("sw4");
	
	var sw0rgb = sw0.style.backgroundColor.slice(4, -1);
	var sw1rgb = sw1.style.backgroundColor.slice(4, -1);
	var sw2rgb = sw2.style.backgroundColor.slice(4, -1);
	var sw3rgb = sw3.style.backgroundColor.slice(4, -1);
	var sw4rgb = sw4.style.backgroundColor.slice(4, -1);
	
	var allColors = "";
	
	if( sw0rgb != "" ){ allColors += sw0rgb + "|" };
	if( sw1rgb != "" ){ allColors += sw1rgb + "|" };
	if( sw2rgb != "" ){ allColors += sw2rgb + "|" };
	if( sw3rgb != "" ){ allColors += sw3rgb + "|" };
	if( sw4rgb != "" ){ allColors += sw4rgb + "|" };
	
	allColors = allColors.slice(0,-1);
	
	// Send them in an AJAX request.
	var xhr = new XMLHttpRequest();
	xhr.open("POST", POST_URL, true);
	xhr.setRequestHeader("Content-type", "text/plain");
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200){
			alert("success!");
		}
		else {
			alert("fail! " + xhr.readyState + ", " + xhr.status);
		}
	}
	
	xhr.send(allColours);
}

function loadProducts() {
	var productList = document.createElement("div");
	productList.setAttribute("class", "productList");
	
	for (var i=0; i<10; i++)
	{
		var div = document.createElement("div");
		div.setAttribute("class", "productWrapper");
		
		var img = document.createElement("img");
		img.setAttribute("alt", "");
		img.setAttribute("src", "http://www.ottawafolklore.com/wp-content/uploads/2011/02/Shopify-Green_256x256.jpg");
		
		div.appendChild(img);
		productList.appendChild(div);
	}
	
	var productArea = document.getElementById("productArea");
	productArea.appendChild(productList);
}