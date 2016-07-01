var useVideo = true;
//var minColorDistance = 5; // this is good for hsv
var minColorDistance = 50; // this is good for rgb
// var targetColor = {
//   r: 211,
//   g: 73,
//   b: 62
// };
var targetColor = null;

var boundingBox = null;
var topmost = null;
var leftmost = null;
var rightmost = null;
var bottommost = null;

var colorDistance = function(color1, color2) {
  // Compare hsv -- this makes things slow!
  // var hsv1 = rgb2hsv(color1.r, color1.g, color1.b);
  // var hsv2 = rgb2hsv(color2.r, color2.g, color2.b);
  // return Math.abs(hsv1.h - hsv2.h);

  // Compare rgb with Euclidean distance
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

  topmost = height-1;
  leftmost = width-1;
  rightmost = 0;
  bottommost = 0;

  for (var pixelX = 0; pixelX < width; pixelX++) {
    for (var pixelY = 0; pixelY < height; pixelY++) {
      var pixelIndex = (pixelY * width + pixelX) * 4;
      var rIndex = pixelIndex;
      var gIndex = pixelIndex + 1;
      var bIndex = pixelIndex + 2;
      var alphaIndex = pixelIndex + 3;

      if (targetColor !== null) {
        var dist = colorDistance(targetColor, {
          r: pixels[rIndex],
          g: pixels[gIndex],
          b: pixels[bIndex]
        });
        if (dist < minColorDistance) {
          newPixels[rIndex] = 0;
          newPixels[gIndex] = 255;
          newPixels[bIndex] = 0;
          newPixels[alphaIndex] = 125;

          if (pixelY < topmost) {
            topmost = pixelY;
          }

          if (pixelY > bottommost) {
            bottommost = pixelY;
          }

          if (pixelX < leftmost) {
            leftmost = pixelX;
          }

          if (pixelX > rightmost) {
            rightmost = pixelX;
          }
        }
      }
    }
  }

  boundingBox = {
    topLeft: {
      x: leftmost,
      y: topmost
    },
    bottomLeft: {
      x: leftmost,
      y: bottommost
    },
    topRight: {
      x: rightmost,
      y: topmost
    },
    bottomRight: {
      x: rightmost,
      y: bottommost
    }
  };

  // console.log("topmost: " + topmost);
  // console.log("bottommost: " + bottommost);
  // console.log("leftmost: " + leftmost);
  // console.log("rightmost: " + rightmost);

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

// Ref: http://stackoverflow.com/a/8023734
function rgb2hsv () {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}
