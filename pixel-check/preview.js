var sku = "VIP-45694"; // "16x20 Poster - Matte Poster Stock - Normal/Blank"
var sourceImage = "http://exmoorpet.com/wp-content/uploads/2012/08/cat.png";
var docUrl;
var previewUrl;

document.getElementById("previewBtn").addEventListener("click", function () {
  createDocument();
});

function createDocument() {

  var data = JSON.stringify(
      {
        "Images": [
          {
            "MultipagePdf": false,
            "ImageUrl": sourceImage
          }
        ],
        "Sku": sku
      }
    );
    console.log(data);

    $.ajax({
        url: 'https://api.cimpress.io/vcs/printapi/v1/documents/creators/url',
        method: 'POST',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQ2hyaXN0b3BoZXIgS3dhbiIsImVtYWlsIjoiY2t3YW5AdmlzdGFwcmludC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwic2NvcGVzIjpbXSwiYXBwX21ldGFkYXRhIjp7InZjc19wYXJ0bmVyX2lkIjoiMjAxNmhhY2thdGhvbi0zOTUzNTM0OC0zNWJlLTQzN2YtYTMxOS01MDdkYjMzMjE4NGQifSwiaXNzIjoiaHR0cHM6Ly9jaW1wcmVzcy5hdXRoMC5jb20vIiwic3ViIjoiYWRmc3xja3dhbkB2aXN0YXByaW50LmNvbSIsImF1ZCI6IjRHdGt4Smh6MFUxYmRnZ0hNZGF5U0F5MDVJVjRNRURWIiwiZXhwIjoxNDY3NDEyNjk1LCJpYXQiOjE0NjczNzY2OTUsImF6cCI6IlFreE92Tno0ZldSRlQ2dmNxNzl5bGNJdW9sRnoyY3dOIn0.QQqIyM_OeYvyVXce5vVI6fRGBsJx2Izmt2IfPn9OFvQ"
        },
        data: data,
        success: function(data, status) {
          console.log("URL WORKED");
          console.log(data);
          docUrl = data.InstructionSourceUrl;
          getPreview();
        }
    });
}

function getPreview() {
  var data = JSON.stringify(
      {
        "Images": [
          {
            "MultipagePdf": false,
            "ImageUrl": sourceImage
          }
        ],
        "Sku": sku
      }
    );
    console.log(data);

    $.ajax({
        url: 'https://api.cimpress.io/vcs/printapi/v1/documents/previews?Sku=' + sku + '&InstructionSourceUrl=' + docUrl + '&Width=100',
        method: 'GET',
        headers : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        'Authorization': "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiQ2hyaXN0b3BoZXIgS3dhbiIsImVtYWlsIjoiY2t3YW5AdmlzdGFwcmludC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwic2NvcGVzIjpbXSwiYXBwX21ldGFkYXRhIjp7InZjc19wYXJ0bmVyX2lkIjoiMjAxNmhhY2thdGhvbi0zOTUzNTM0OC0zNWJlLTQzN2YtYTMxOS01MDdkYjMzMjE4NGQifSwiaXNzIjoiaHR0cHM6Ly9jaW1wcmVzcy5hdXRoMC5jb20vIiwic3ViIjoiYWRmc3xja3dhbkB2aXN0YXByaW50LmNvbSIsImF1ZCI6IjRHdGt4Smh6MFUxYmRnZ0hNZGF5U0F5MDVJVjRNRURWIiwiZXhwIjoxNDY3NDEyNjk1LCJpYXQiOjE0NjczNzY2OTUsImF6cCI6IlFreE92Tno0ZldSRlQ2dmNxNzl5bGNJdW9sRnoyY3dOIn0.QQqIyM_OeYvyVXce5vVI6fRGBsJx2Izmt2IfPn9OFvQ"
        },
        data: data,
        success: function(data, status) {
          console.log("URL WORKED");
          console.log(data);
          previewUrl = data.PreviewUrls[0];
          console.log("previewUrl: " + previewUrl);
        }
    });
}
