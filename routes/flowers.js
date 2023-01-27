var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const tf = require("@tensorflow/tfjs");
const tfnode = require("@tensorflow/tfjs-node");

router.use(express.json());
router.use(express.static('public'))
    // parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
// parse application/json
router.use(bodyParser.json());

let inputShape = [1, 0, 0, 3];

const loadModel = async() => {
    // yolov_5model = await tf.loadGraphModel(path.join(__dirname, 'public/model-strw-nano/model.json'));
    yolov_5model = await tf.loadGraphModel('https://raw.githubusercontent.com/DavidSilTroy/node_yolov5_to_tfjs/main/public/model-strw-nano/model.json');
    // console.log(yolov_5model);
    console.log('yolov_5model cargao');
    return yolov_5model;
};

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let model = await loadModel();
    res.send(`Use POST method for count flowers,\n 
    but look the model: \n\n ${model}`);
});


// /////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////

// router.post('/', async(req, res, next) => {
//     let classThreshold = 0.5;
//     try {
//         yolov5 = await loadModel();
//         // warming up model
//         const dummyInput = tf.ones(yolov5.inputs[0].shape);
//         const warmupResult = await yolov5.executeAsync(dummyInput);
//         tf.dispose(warmupResult); // cleanup memory
//         tf.dispose(dummyInput); // cleanup memory


//         const imgdata = await req.body.base64image;
//         console.log(imgdata.substring(0, 10));

//         // to convert base64 format into random filename
//         const base64img = await imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
//         console.log(base64img.substring(0, 10));
//         // tf.engine().startScope(); // start scoping tf engine

//         const imgBinary = await Buffer.from(base64img, 'base64')
//         console.log(imgBinary);
//         // get the tensor
//         // const img = await tf.node.decodeImage(imgBinary)
//         // console.log(img);

//         //Now use the detectImage(imageRef.current, model, classThreshold, canvasRef.current)



//         console.log(yolov5.inputs[0].shape);
//         let flowers = await detectImage(imgBinary, yolov5, classThreshold);


//         return res.send(`Deteted: ${flowers} flowers`);
//         // res.json(req.body);

//     } catch (e) {
//         next(e);
//     }
// });

// /////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////
// const preprocess = (source, modelWidth, modelHeight) => {
//     let xRatio, yRatio;
//     const input = tf.tidy(() => {
//         // const img = tf.browser.fromPixels(source);

//         const img = tfnode.node.decodeImage(source);
//         const [h, w] = img.shape.slice(0, 2);
//         const maxSize = Math.max(w, h);
//         const imgPadded = img.pad([
//             [0, maxSize - h],
//             [0, maxSize - w],
//             [0, 0],
//         ]);
//         xRatio = maxSize / w;
//         yRatio = maxSize / h;
//         return tf.image
//             .resizeBilinear(imgPadded, [modelWidth, modelHeight])
//             .div(255.0)
//             .expandDims(0);
//     });
//     return [input, xRatio, yRatio];
// };

// const detectImage = async(imgSource, model, classThreshold) => {
//     const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);

//     tf.engine().startScope();
//     const [input, xRatio, yRatio] = preprocess(imgSource, modelWidth, modelHeight);

//     let objects_detected = 0;

//     await model.executeAsync(input).then((res) => {
//         const [boxes, scores, classes] = res.slice(0, 3);
//         const boxes_data = boxes.dataSync();
//         const scores_data = scores.dataSync();
//         const classes_data = classes.dataSync();
//         // renderBoxes(canvasRef, classThreshold, boxes_data, scores_data, classes_data, [xRatio, yRatio]);
//         console.log("Aqui viene lo chiido");
//         console.log(res.slice(0, 3));
//         console.log(`boxes_data: ${boxes_data}`);
//         console.log(`scores_data: ${scores_data}`);
//         console.log(`scores_data: ${typeof scores_data}`);
//         console.log(`classes_data: ${classes_data}`);
//         console.log("xdddd");
//         tf.dispose(res);
//         for (let i = 0; i < scores_data.length; ++i) {
//             // filter based on class threshold
//             if (scores_data[i] > classThreshold) {
//                 objects_detected += 1;
//             }
//         }

//     });

//     tf.engine().endScope();
//     return objects_detected;
// };


// /////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////
// module.exports = router;