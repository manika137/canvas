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

function drawLine(position) {
  context.beginPath();
  context.moveTo(dragStartLocation.x, dragStartLocation.y);
  context.lineTo(position.x, position.y);
  context.stroke();
  localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());
}

function drawQCurve(position) {
  context.beginPath();
  context.moveTo(dragStartLocation.x, dragStartLocation.y);
  var cpx = dragStartLocation.x;
  var cpy = position.x / 2;
  context.quadraticCurveTo(cpx, cpy, position.x, position.y);
  context.stroke();
  localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());
}

function erase(position, esize) {
  if (dragging == true) {
    context.clearRect(position.x, position.y, esize, esize);
    localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());
    takeSnapshot();
  }
}

function drawFree(position) {
  // if(dragging==true){
  // context.lineTo(position.x, position.y);
  // context.stroke();
  // localStorage.savedPaintCanvas =JSON.stringify(canvas.toDataURL());
  // takeSnapshot();
  // }

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

function drawCircle(position) {
  var radius = Math.sqrt(
    Math.pow(dragStartLocation.x - position.x, 2) +
      Math.pow(dragStartLocation.y - position.y, 2)
  );
  context.beginPath();
  context.arc(
    dragStartLocation.x,
    dragStartLocation.y,
    radius,
    0,
    2 * Math.PI,
    false
  );
  localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());
}

function drawPolygon(position, sides, angle) {
  var coordinates = [],
    radius = Math.sqrt(
      Math.pow(dragStartLocation.x - position.x, 2) +
        Math.pow(dragStartLocation.y - position.y, 2)
    ),
    index = 0;

  for (index = 0; index < sides; index++) {
    coordinates.push({
      x: dragStartLocation.x + radius * Math.cos(angle),
      y: dragStartLocation.y - radius * Math.sin(angle),
    });
    angle += (2 * Math.PI) / sides;
  }

  context.beginPath();
  context.moveTo(coordinates[0].x, coordinates[0].y);
  for (index = 1; index < sides; index++) {
    context.lineTo(coordinates[index].x, coordinates[index].y);
    localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());
  }

  context.closePath();
}

function draw(position) {
  var fillBox = document.getElementById("fillBox");
  // shape = document.querySelector(
  //   'input[type="radio"][name="shape"]:checked'
  // ).value,
  // polygonSides = document.getElementById("polygonSides").value,
  // polygonAngle = document.getElementById("polygonAngle").value,
  // lineCap = document.querySelector(
  //   'input[type="radio"][name="lineCap"]:checked'
  // ).value,
  // eraseDim = document.getElementById("eraseArea").value,
  // composition = document.querySelector(
  //   'input[type="radio"][name="composition"]:checked'
  // ).value;

  // context.lineCap = lineCap;
  // context.globalCompositeOperation = composition;

  // if (shape === "eraser") {
  //   erase(position, eraseDim);
  //}

  // if (shape === "free") {
  drawFree(position);
  // }

  // if (shape === "circle") {
  //   drawCircle(position);
  // }
  // if (shape === "line") {
  //   drawLine(position);
  // }

  // if (shape === "qcurve") {
  //   drawQCurve(position);
  // }

  // if (shape === "polygon") {
  //   drawPolygon(position, polygonSides, polygonAngle * (Math.PI / 180));
  // }

  // if (shape !== "line" && shape !== "free" && shape !== "bcurve") {
  //   if (fillBox.checked) {
  //     context.fill();
  //     localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());
  //   } else {
  //     context.stroke();
  //     localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());
  //   }
  // }
}

// function dragStart(event) {
//   dragging = true;
//   dragStartLocation = getCanvasCoordinates(event);
//   backCtx.drawImage(canvas, 0, 0);
//   takeSnapshot();
//   context.beginPath();
//   context.moveTo(dragStartLocation.x, dragStartLocation.y);
//   canvas.addEventListener("mousemove", drag, false);
// }

// function drag(event) {
//   var position;
//   if (dragging === true) {
//     restoreSnapshot();
//     position = getCanvasCoordinates(event);
//     draw(position);
//   }

//   if (dragging === true) {
//     restoreSnapshot();
//     var position;
//     if (isTouchDevice) {
//       position = getTouchCoordinates(event);
//       // console.log("mobile");
//     } else {
//       position = getCanvasCoordinates(event);
//       console.log("laptop");
//     }
//     draw(position);
//   }
//}

// function dragStop(event) {
//   dragging = false;
//   restoreSnapshot();
//   var position = getCanvasCoordinates(event);
//   draw(position);
// }

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

// function changeLineWidth() {
//   context.lineWidth = this.value;
//   event.stopPropagation();
// }

// function changeFillStyle() {
//   context.fillStyle = this.value;
//   event.stopPropagation();
// }

// function changeStrokeStyle() {
//   context.strokeStyle = this.value;
//   event.stopPropagation();
// }

// function changeBackgroundColor() {
//   context.save();
//   context.fillStyle = document.getElementById("backgroundColor").value;
//   context.fillRect(0, 0, canvas.width, canvas.height);
//   localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());
//   context.restore();
// }

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

  //  fillColor = document.getElementById("fillColor"),
  //    canvasColor = document.getElementById("backgroundColor"),
  //    clearCanvas = document.getElementById("clearCanvas");
  //  deleteLastStep = document.getElementById("deleteLastStep");

  canvas.addEventListener("mousedown", dragStart, false);
  canvas.addEventListener("mousemove", drag, false);
  canvas.addEventListener("mouseup", dragStop, false);

  canvas.addEventListener("touchstart", dragStart, false);
  canvas.addEventListener("touchmove", drag, false);
  canvas.addEventListener("touchend", dragStop, false);

  // if (isTouchDevice) {
  //   canvas.addEventListener("touchstart", dragStart, { passive: true });
  //   canvas.addEventListener("touchmove", drag, { passive: true });
  //   // For touchend, you don't need to specify the passive option because touchend is not cancellable
  //   canvas.addEventListener("touchend", dragStop);
  // } else {
  //   canvas.addEventListener("mousedown", dragStart, false);
  //   canvas.addEventListener("mousemove", drag, false);
  //   canvas.addEventListener("mouseup", dragStop, false);
  // }

  // lineWidth.addEventListener("input", changeLineWidth, false);
  // fillColor.addEventListener("input", changeFillStyle, false);
  // strokeColor.addEventListener("input", changeStrokeStyle, false);
  // canvasColor.addEventListener("input", changeBackgroundColor, false);
  clearCanvas.addEventListener("click", eraseCanvas, false);
  deleteLastStep.addEventListener("click", deleteStep, false);
  // canvas.addEventListener("click", handleAnnotation); //can be deleted mp

  // var printButton = document.getElementById("printButton");
  // printButton.addEventListener("click", printCoordinates);
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

function loadImageFileAsURL() {
  var filesSelected = document.getElementById("inputFileToLoad").files;

  if (filesSelected.length > 0) {
    var fileToLoad = filesSelected[0];

    if (fileToLoad.type.match("image.*")) {
      var fileReader = new FileReader();

      fileReader.onload = function (fileLoadedEvent) {
        var imageLoaded = new Image();
        imageLoaded.onload = function () {
          canvas.width = imageLoaded.width;
          canvas.height = imageLoaded.height;

          context.drawImage(imageLoaded, 0, 0);

          localStorage.savedPaintCanvas = JSON.stringify(canvas.toDataURL());

          annotations = [];
        };

        imageLoaded.src = fileLoadedEvent.target.result;
      };

      fileReader.readAsDataURL(fileToLoad);
    }
  }
}

// Function to handle annotation
//can be deleted mp
// function handleAnnotation(event) {
// var x = event.clientX - canvas.offsetLeft;
// var y = event.clientY - canvas.offsetTop;

// // Store the annotation coordinates
// annotations.push({ x: x, y: y });

// // Draw the annotation on the canvas
// drawAnnotation(x, y);
// }

// // Function to draw an annotation on the canvas
// function drawAnnotation(x, y) {
//     context.beginPath();
//     context.arc(x, y, 5, 0, 2 * Math.PI);
//     context.fillStyle = "red";
//     context.fill();
//     context.closePath();
// }

// function printCoordinates() {
// var coordinatesDisplay = document.getElementById("coordinatesDisplay");
// coordinatesDisplay.innerHTML = "<strong>Annotation Coordinates:</strong><br>";

// annotations.forEach(function(stroke, strokeIndex) {
// coordinatesDisplay.innerHTML += `<strong>Stroke ${strokeIndex + 1}:</strong><br>`;

// stroke.forEach(function(point, pointIndex) {
// coordinatesDisplay.innerHTML += `Point ${pointIndex + 1}: X=${point.x}, Y=${point.y}<br>`;
// });
// });
// }

// function startDrawing(event) {
// drawing = true;
// annotations.push([]); // Start a new stroke
// addPoint(event);

//ADDED FROM DRAWFREE
// context.lineTo(position.x, position.y);
// context.stroke();
// localStorage.savedPaintCanvas =JSON.stringify(canvas.toDataURL());
// takeSnapshot();
//}

// function stopDrawing() {
// drawing = false;
// }

// function addPoint(event) {
// if (!drawing) return;

// var x = event.clientX - canvas.offsetLeft;
// var y = event.clientY - canvas.offsetTop;

// annotations[annotations.length - 1].push({ x: x, y: y });

// drawPoint(x, y); //SINGLE RED POINT
// }

// function drawPoint(x, y) {
// context.beginPath();
// context.arc(x, y, 2, 0, 2 * Math.PI);
// context.fillStyle = "red";
// context.fill();
// context.closePath();
// }

// canvas.addEventListener("mousedown", startDrawing);
// canvas.addEventListener("mouseup", stopDrawing);
// canvas.addEventListener("mousemove", addPoint);

var freehandAnnotations = [[]];

// function printFreehandCoordinates() {
//     console.log("Freehand Annotation Coordinates:");
//     freehandAnnotations.forEach(function(point, index) {
//         console.log(`Point ${index + 1}: X=${point.x}, Y=${point.y}`);
//     });
// }

function printFreehandCoordinates(annotationIndex) {
  console.log(`Annotation ${annotationIndex + 1} Coordinates:`);
  freehandAnnotations[annotationIndex].forEach(function (point, index) {
    console.log(`Point ${index + 1}: X=${point.x}, Y=${point.y}`);
  });
}

// var printFreehandButton = document.getElementById("printFreehandButton");
// printFreehandButton.addEventListener("click", printFreehandCoordinates);

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

// function saveMasksAsImages() {
//   // Create a new canvas to combine masks
//   // const combinedCanvas = document.createElement('canvas');
//   // const combinedContext = combinedCanvas.getContext('2d');

//   // // Set canvas dimensions (assuming both masks have the same dimensions)
//   // combinedCanvas.width = masks[0].width;
//   // combinedCanvas.height = masks[0].height;

//   // // Draw each mask onto the combined canvas
//   // for (let i = 0; i < masks.length; i++) {
//   //     combinedContext.putImageData(masks[i], 0, 0);
//   // }

//   // // Convert the combined canvas to a data URL
//   // const combinedImageDataUrl = combinedCanvas.toDataURL('image/png');

//   // // Create an anchor element for download
//   // const downloadAnchor = document.createElement('a');
//   // downloadAnchor.href = combinedImageDataUrl;
//   // downloadAnchor.download = 'combined_masks.png';  // Name of the downloaded file
//   // downloadAnchor.click();

//   const combinedCanvas = document.createElement("canvas");
//   combinedCanvas.width = canvas.width;
//   combinedCanvas.height = canvas.height;
//   const combinedContext = combinedCanvas.getContext("2d");

//   // Iterate over masks and composite each onto the combined canvas
//   masks.forEach(function (maskImageData) {
//     // Create a temporary canvas for the current mask
//     const tempCanvas = document.createElement("canvas");
//     tempCanvas.width = combinedCanvas.width;
//     tempCanvas.height = combinedCanvas.height;
//     const tempContext = tempCanvas.getContext("2d");

//     // Draw the current mask onto the temporary canvas
//     tempContext.putImageData(maskImageData, 0, 0);

//     // Composite the temporary canvas onto the combined canvas
//     combinedContext.drawImage(tempCanvas, 0, 0);
//   });

//   const downloadAnchor = document.getElementById("downloadAnchor");
//   downloadAnchor.href = combinedCanvas.toDataURL("image/png");
//   downloadAnchor.download = "combined_masks.png";
//   downloadAnchor.click();
// }

// function funct(){
//     saveMasksAsImages(masks, 'mask');
// }
