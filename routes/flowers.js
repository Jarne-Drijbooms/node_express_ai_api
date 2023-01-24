var express = require('express');
var router = express.Router();
// import * as tf from "@tensorflow/tfjs";

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Object Detection for flowers');
});

// const express = require('express');
// const app = express();
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
// const tf = require('@tensorflow/tfjs-node');
// const fs = require('fs');

// app.post('/detect-objects', upload.single('image'), async(req, res) => {
//     // check if image file is provided in the request
//     if (!req.file) {
//         return res.status(400).send({ error: 'image file is required' });
//     }

//     // read the image file
//     const image = fs.readFileSync(req.file.path);

//     // load the object detection model
//     const model = await tf.loadGraphModel('path/to/model.json');

//     // perform object detection
//     const imageTensor = tf.node.decodeImage(image);
//     const detection = await model.executeAsync(imageTensor);

//     // extract the number of objects recognized
//     const numObjects = detection.dataSync()[0];

//     // delete the image file from the server
//     fs.unlinkSync(req.file.path);

//     // send the result as a response
//     res.send({ objects: numObjects });
// });

// app.listen(3000, () => {
//     console.log('Server started on port 3000');
// });

module.exports = router;