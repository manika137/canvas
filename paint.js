var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// create backing canvas
var backCanvas = document.createElement("canvas");
backCanvas.width = canvas.width;
backCanvas.height = canvas.height;
var backCtx = backCanvas.getContext("2d");

function initial() {
  if (localStorage.savedPaintCanvas) {
    var dataURL = JSON.parse(localStorage.savedPaintCanvas);
    var img = new Image();
    img.src = dataURL;
    img.onload = function () {
      context.drawImage(img, 0, 0);
    };
  }
}

initial();

var dragging = false,
  dragStartLocation,
  snapshot,
  savedSnapshot;

function getCanvasCoordinates(event) {
  var x = event.clientX - canvas.getBoundingClientRect().left,
    y = event.clientY - canvas.getBoundingClientRect().top;

  return { x: x, y: y };
}

function takeSnapshot() {
  snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function deleteStep() {
  console.log("time to draw");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(backCanvas, 0, 0);
}

function restoreSnapshot() {
  context.putImageData(snapshot, 0, 0);
}

function erase(position, esize) {
  if (dragging == true) {
    context.clearRect(position.x, position.y, esize, esize);
    localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());
    takeSnapshot();
  }
}

function drawFree(position) {
  if (dragging) {
    context.lineTo(position.x, position.y);
    context.stroke();

    freehandAnnotations[currentAnnotationIndex].push({
      x: position.x,
      y: position.y,
    });

    localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());

    takeSnapshot();
  }
}

function draw(position) {
  var fillBox = document.getElementById("fillBox");
  drawFree(position);
}

function getTouchCoordinates(event) {
  let x, y;

  if (event.clientX && event.clientY) {
    x = event.clientX;
    y = event.clientY;
  } else if (event.touches && event.touches.length > 0) {
    x = event.touches[0].clientX;
    y = event.touches[0].clientY;
  } else {
    console.error("Could not determine coordinates from the event.");
    return { x: 0, y: 0 };
  }

  return {
    x: x - canvas.getBoundingClientRect().left,
    y: y - canvas.getBoundingClientRect().top,
  };
}

function dragStart(event) {
  dragging = true;
  if (isTouchDevice) {
    dragStartLocation = getTouchCoordinates(event);
    console.log("mobile");
  } else {
    dragStartLocation = getCanvasCoordinates(event);
    console.log("laptop");
  }
  backCtx.drawImage(canvas, 0, 0);
  takeSnapshot();
  context.beginPath();
  context.moveTo(dragStartLocation.x, dragStartLocation.y);
}

function drag(event) {
  if (dragging === true) {
    restoreSnapshot();
    // if (isTouchDevice) {
    //   // draglaptop(event);
    //   position = getTouchCoordinates(event);
    //   // console.log("mobile");
    // }

    var position;
    //else {
    position = getTouchCoordinates(event);
    // console.log("laptop");
    // }
    draw(position);
  }
}

function dragStop(event) {
  dragging = false;
  restoreSnapshot();
  var position;
  if (isTouchDevice) {
    position = getTouchCoordinates(event);
    console.log("mobile");
  } else {
    position = getCanvasCoordinates(event);
    console.log("laptop");
  }
  draw(position);
}

function eraseCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  backCtx.clearRect(0, 0, backCanvas.width, backCanvas.height);
}

var isTouchDevice = "ontouchstart" in document.documentElement;
function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  // Set default values
  context.strokeStyle = "#000000"; // Black color
  context.lineWidth = 2; // Default line width

  // Other UI elements initialization
  var clearCanvas = document.getElementById("clearCanvas"),
    deleteLastStep = document.getElementById("deleteLastStep");

  canvas.addEventListener("mousedown", dragStart, false);
  canvas.addEventListener("mousemove", drag, false);
  canvas.addEventListener("mouseup", dragStop, false);

  canvas.addEventListener("touchstart", dragStart, false);
  canvas.addEventListener("touchmove", drag, false);
  canvas.addEventListener("touchend", dragStop, false);

  clearCanvas.addEventListener("click", eraseCanvas, false);
  deleteLastStep.addEventListener("click", deleteStep, false);
}

window.addEventListener("load", init, false);

function slideOpen(el) {
  el.style.transition = "height 0.5s linear 0s";
  el.style.height = "100%";
  el.style.visibility = "visible";
}

function slideClose(el) {
  el.style.transition = "height 1.0s linear 0s";
  el.style.height = "0px";
  el.style.border = "none";
}

var annotations = [];

var drawing = false;

// context.imageSmoothingEnabled = false;
var originalImageData = "";
function loadImageFileAsURL() {
  var filesSelected = document.getElementById("inputFileToLoad").files;

  if (filesSelected.length > 0) {
    var fileToLoad = filesSelected[0];

    if (fileToLoad.type.match("image.*")) {
      var fileReader = new FileReader();

      fileReader.onload = function (fileLoadedEvent) {
        var imageLoaded = new Image();

        imageLoaded.onload = function () {
          // Clear previous content from the canvas
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the image on the canvas
          context.drawImage(imageLoaded, 0, 0, canvas.width, canvas.height);

          // canvas.width = imageLoaded.width;
          // canvas.height = imageLoaded.height;
          // context.drawImage(imageLoaded, 0, 0);

          originalImageData = fileLoadedEvent.target.result;
          // console.log("Image Source:", fileLoadedEvent.target.result);

          // Save the canvas content to localStorage if needed
          localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());

          // Clear any annotations or other previous data
          annotations = [];
        };

        imageLoaded.src = fileLoadedEvent.target.result;
      };
      fileReader.readAsDataURL(fileToLoad);
    } else {
      console.error("Selected file is not an image.");
    }
  } else {
    console.error("No file selected.");
  }
}

// Function to programmatically trigger the file input
function triggerFileInput() {
  document.getElementById("inputFileToLoad").click();
}

// Function to open the overlay
function openOverlay() {
  // Set the source of the fullImage element to the original image data
  document.getElementById("fullImage").src = originalImageData;

  // Display the overlay
  document.getElementById("imageOverlay").style.display = "block";
}

function closeOverlay() {
  document.getElementById("imageOverlay").style.display = "none";
}

var freehandAnnotations = [[]];

function printFreehandCoordinates(annotationIndex) {
  console.log(`Annotation ${annotationIndex + 1} Coordinates:`);
  freehandAnnotations[annotationIndex].forEach(function (point, index) {
    console.log(`Point ${index + 1}: X=${point.x}, Y=${point.y}`);
  });
}

var printFreehandButton = document.getElementById("printFreehandButton");

var currentAnnotationIndex = 0;

printFreehandButton.addEventListener("click", function () {
  printFreehandCoordinates(currentAnnotationIndex);

  freehandAnnotations.push([]);

  currentAnnotationIndex++;
});

function downloadAnnotations() {
  var jsonData = JSON.stringify(freehandAnnotations);

  var blob = new Blob([jsonData], { type: "application/json" });

  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "freehand_annotations.json";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
}

var downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadAnnotations);

function saveMasksAsImages() {
  var masks = [];

  // Iterate over each set of freehand points (each annotation)
  for (
    var annotationIndex = 0;
    annotationIndex < freehandAnnotations.length;
    annotationIndex++
  ) {
    if (
      freehandAnnotations[annotationIndex] &&
      freehandAnnotations[annotationIndex].length > 0
    ) {
      // Create a new canvas for the mask
      var maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      var maskContext = maskCanvas.getContext("2d");

      // Draw the freehand path on the mask canvas
      maskContext.beginPath();
      maskContext.moveTo(
        freehandAnnotations[annotationIndex][0].x,
        freehandAnnotations[annotationIndex][0].y
      );
      for (var i = 1; i < freehandAnnotations[annotationIndex].length; i++) {
        maskContext.lineTo(
          freehandAnnotations[annotationIndex][i].x,
          freehandAnnotations[annotationIndex][i].y
        );
      }
      maskContext.closePath(); // Close the path to create a closed region
      maskContext.fillStyle = "white"; // Set the fill color to white
      maskContext.fill(); // Fill the closed region with white

      // Extract the mask as an image data object
      var maskImageData = maskContext.getImageData(
        0,
        0,
        maskCanvas.width,
        maskCanvas.height
      );

      masks.push(maskImageData);
    } else {
      console.warn(
        "Skipping undefined or empty annotation at index:",
        annotationIndex
      );
    }
  }

  console.log(masks);

  const combinedCanvas = document.createElement("canvas");
  combinedCanvas.width = canvas.width;
  combinedCanvas.height = canvas.height;
  const combinedContext = combinedCanvas.getContext("2d");

  masks.forEach(function (maskImageData) {
    // Create a temporary canvas for the current mask
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = combinedCanvas.width;
    tempCanvas.height = combinedCanvas.height;
    const tempContext = tempCanvas.getContext("2d");

    // Draw the current mask onto the temporary canvas
    tempContext.putImageData(maskImageData, 0, 0);

    // Composite the temporary canvas onto the combined canvas
    combinedContext.drawImage(tempCanvas, 0, 0);
  });

  const downloadAnchor = document.getElementById("downloadAnchor");
  downloadAnchor.href = combinedCanvas.toDataURL("image/png");
  downloadAnchor.download = "combined_masks.png";
  downloadAnchor.click();
}

var maskDownload = document.getElementById("maskDownloadButton");
maskDownload.addEventListener("click", saveMasksAsImages);
