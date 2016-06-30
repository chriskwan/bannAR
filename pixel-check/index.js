var useVideo = true;
var colorThreshold = 50;
var targetColor;

var colorDistance = function(color1, color2) {
  var rSquare = Math.pow((color1.r - color2.r), 2);
  var gSquare = Math.pow((color1.g - color2.g), 2);
  var bSquare = Math.pow((color1.b - color2.b), 2);
  var dist = Math.sqrt(rSquare + gSquare + bSquare);
  return dist;
}

var update = function(context, frame, targetColor) {
  var width = context.canvas.width;
  var height = context.canvas.height;

  if (useVideo) {
    context.drawImage(frame, 0, 0);
  } else {
    // using sample image
    image = document.getElementById("sceneImage");
    context.drawImage(image, 0, 0, width, height);
  }

  var pixels = context.getImageData(0, 0, width, height).data;
  var newPixels = pixels;

  for (var pixelX = 0; pixelX < width; pixelX++) {
    for (var pixelY = 0; pixelY < height; pixelY++) {
      var pixelIndex = (pixelY * width + pixelX) * 4;
      var rIndex = pixelIndex;
      var gIndex = pixelIndex + 1;
      var bIndex = pixelIndex + 2;
      var alphaIndex = pixelIndex + 3;

      if (colorDistance(targetColor, {
        r: pixels[rIndex],
        g: pixels[gIndex],
        b: pixels[bIndex]
      }) < colorThreshold) {
        newPixels[rIndex] = 0;
        newPixels[gIndex] = 255;
        newPixels[bIndex] = 0;
        newPixels[alphaIndex] = 125;
      }
    }
  }

  var newImageData = context.createImageData(width, height);
  for (var i=0; i<pixels.length; i++) {
    newImageData.data[i] = newPixels[i];
  }
  context.putImageData(newImageData, 0, 0);
}

document.addEventListener("DOMContentLoaded", function(event) {
  //cwkTODO post-it yellow-ish
  // var targetColor = {
  //   r: 140,
  //   g: 136,
  //   b: 88
  // }

  //red
  targetColor = {
    r: 211,
    g: 73,
    b: 62
  };

  var myVid = document.getElementById('myvid');
  var context = myVid.getContext('2d')
  var draw = function(frame, dt) {
    update(context, frame, targetColor)
  }
  var myCamvas = new camvas(context, draw);

  myVid.addEventListener("click", function(event) {
    return getColor(event, myVid, context);
  });
});

function getColor(event, video, context) {
  var x = event.offsetX;
  var y = event.offsetY;

  var width = video.width;
  var pixelIndex = (y * width + x) * 4;

  //console.log("You clicked on: " + x + ", " + y + " pixel should be " + pixelIndex);

  var imageData = context.getImageData(0, 0, video.width, video.height);
  var pixels = imageData.data;

  // Find the color of the pixel you clicked on
  for (var i=0; i<pixels.length; i += 4) {
    if (i === pixelIndex) {
      var r = pixels[i];
      var g = pixels[i+1];
      var b = pixels[i+2];

      //console.log("Color is: " + r + ", " + g + ", " + b);
      targetColor = {
        r: r,
        g: g,
        b: b
      }
    }
  }
}
