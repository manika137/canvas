from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def get_data():
    # Simulate some data processing
    data = {'message': 'Hello from Python!'}
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)

#for saving single mask image
#     function saveMaskAsImage(maskImageData, fileName) {
#     // Create a new canvas for the image
#     var imageCanvas = document.createElement('canvas');
#     imageCanvas.width = maskImageData.width;
#     imageCanvas.height = maskImageData.height;
#     var imageContext = imageCanvas.getContext('2d');

#     // Draw the mask image data onto the canvas
#     imageContext.putImageData(maskImageData, 0, 0);

#     // Convert the canvas to a data URL
#     var dataURL = imageCanvas.toDataURL('image/png');

#     // Create a link element for download
#     var downloadLink = document.createElement('a');
#     downloadLink.href = dataURL;
#     downloadLink.download = fileName + '.png';

#     // Trigger a click on the link to start the download
#     document.body.appendChild(downloadLink);
#     downloadLink.click();
#     document.body.removeChild(downloadLink);
# }

# // Example usage
# // Assuming masks is an array of ImageData objects
# // Assuming 'mask1' is the name you want to give to the file
# saveMaskAsImage(masks[0], 'mask1');

