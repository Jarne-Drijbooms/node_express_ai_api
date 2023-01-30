var express = require('express');
var router = express.Router();
var tf = require("@tensorflow/tfjs");

//Object detection functions
let model = null;
var load_model = require('../tools/load_model')
var detection = require('../tools/object_detection')
const phone_model = 'https://raw.githubusercontent.com/DavidSilTroy/node_express_ai_api/main/public/models/phone/model.json';


router.post('/', async(req, res, next) => {
    let classThreshold = 0.5;
    try {
        if (model == null) {
            model = await load_model(phone_model);
        } else {
            console.log('Model is good');
        }
        // warming up model
        const dummyInput = tf.ones(model.inputs[0].shape);
        const warmupResult = await model.executeAsync(dummyInput);
        tf.dispose(warmupResult); // cleanup memory
        tf.dispose(dummyInput); // cleanup memory

        const imgdata = await req.body.base64image;
        // console.log(imgdata.substring(0, 10));

        // to convert base64 format into random filename
        const base64img = await imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        // console.log(base64img.substring(0, 10));
        // tf.engine().startScope(); // start scoping tf engine

        const imgBinary = await Buffer.from(base64img, 'base64')
            // console.log(imgBinary);

        // console.log(model.inputs[0].shape);
        let flowers = await detection(imgBinary, model, classThreshold);

        return res.send(`Deteted: ${flowers} flowers`);
        // res.json(req.body);

    } catch (e) {
        next(e);
    }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('Hello amigo, this page is working fine');
});

module.exports = router;