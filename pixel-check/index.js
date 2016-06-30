window.onload = function() {
  var image = document.getElementById("sceneImage");
  var canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  document.body.appendChild(canvas);

  var context = canvas.getContext("2d");
  var img = document.getElementById("sceneImage");
  context.drawImage(img, 0, 0);


  var width = canvas.width;
  var height = canvas.height;
  var pixels = context.getImageData(0, 0, width, height).data;
  var newPixels = [];

  //cwkTODO post-it yellow-ish
  var targetColor = {
    r: 140,
    g: 136,
    b: 88
  }

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
      }) < 15) {
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

function colorDistance(color1, color2) {
  var rSquare = Math.pow((color1.r - color2.r), 2);
  var gSquare = Math.pow((color1.g - color2.g), 2);
  var bSquare = Math.pow((color1.b - color2.b), 2);
  var dist = Math.sqrt(rSquare + gSquare + bSquare);
  return dist;
}
