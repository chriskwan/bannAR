var image, canvas, video, context;

var useVideo = true;

var initialize = function(){
  // setup video
  var video = document.querySelector("#videoElement");

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true}, handleVideo, videoError);
  }

  function handleVideo(stream) {
      video.src = window.URL.createObjectURL(stream);
  }

  function videoError(e) {
      // do something
  }

  // setup canvas
  image = document.getElementById("sceneImage");
  video = document.querySelector("#videoElement");

  canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
  if (useVideo) {
    canvas.width = video.width;
    canvas.height = video.height;
  }
  document.body.appendChild(canvas);
}

var colorDistance = function(color1, color2) {
  var rSquare = Math.pow((color1.r - color2.r), 2);
  var gSquare = Math.pow((color1.g - color2.g), 2);
  var bSquare = Math.pow((color1.b - color2.b), 2);
  var dist = Math.sqrt(rSquare + gSquare + bSquare);
  return dist;
}

var update = function(targetColor) {
  var width = canvas.width;
  var height = canvas.height;

  console.log(width)
  console.log(height)

  if (useVideo) {
    context.drawImage(video, 0, 0, 200, 200);
    var pixels = context.getImageData(0, 0, 200, 200).data;
  } else { // using sample image
    context.drawImage(image, 0, 0, width, height);
    var pixels = context.getImageData(0, 0, width, height).data;
  }

  console.log(pixels)

  var newPixels = [];

  for (var pixelX = 0; pixelX < width; pixelX++) {
    for (var pixelY = 0; pixelY < height; pixelY++) {
      var pixelIndex = (pixelY * width + pixelX) * 4;
      var rIndex = pixelIndex;
      var gIndex = pixelIndex + 1;
      var bIndex = pixelIndex + 2;
      var alphaIndex = pixelIndex + 3;


      newPixels[rIndex] = 255;
      newPixels[gIndex] = 0;
      newPixels[bIndex] = 0;

      if (colorDistance(targetColor, {
        r: pixels[rIndex],
        g: pixels[gIndex],
        b: pixels[bIndex]
      }) < 20) {
        newPixels[alphaIndex] = 128;
      } else {
        newPixels[alphaIndex] = 0;
      }
    }
  }

  var newImageData = context.createImageData(width, height);
  for (var i=0; i<pixels.length; i++) {
    newImageData.data[i] = newPixels[i];
  }

  var tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  var tempContext = tempCanvas.getContext("2d");
  tempContext.putImageData(newImageData, 0, 0);

  context.drawImage(tempCanvas, 0, 0);
}

document.addEventListener("DOMContentLoaded", function(event) {

  initialize();

  //cwkTODO post-it yellow-ish
  var targetColor = {
    r: 140,
    g: 136,
    b: 88
  }

  var i = 0;

  video.addEventListener('loadeddata', function() {
   // Video is loaded and can be played
   console.log("!!!")

  //  i =0
  //   while(i<100){
      update(targetColor);
        // i++
    // }
  }, false);

})
