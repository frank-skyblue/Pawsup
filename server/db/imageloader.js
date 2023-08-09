var FormData = require('form-data');
var fs = require('fs');
const path = require("path");

const imageDir = path.join(__dirname, "sample_images")

async function loadImage(image_name) {
    // Create form and add our image to it
    var form = new FormData();
    form.append('img', fs.createReadStream(path.join(imageDir, image_name)));

    // Post form to our images endpoint
    await form.submit('http://localhost:3001/api/images', function(err, res) {
    if (err) {
        console.error(err);
    }
    res.resume();
    });
}

async function load() {
    try {
        // Go through all the images in the sample images directory and insert them all into the db
        const images = await fs.promises.readdir(imageDir);
        images.forEach(image => {
            loadImage(image);
        })

        console.log("Successfully loaded all images from sample_images directory.");
    } catch(err) {
        console.error(err);
    }
}

load();