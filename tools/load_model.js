var tf = require("@tensorflow/tfjs");

const loadModel = async() => {
    // yolov_5model = await tf.loadGraphModel(path.join(__dirname, 'public/model-strw-nano/model.json'));
    yolov_5model = await tf.loadGraphModel('https://raw.githubusercontent.com/DavidSilTroy/node_yolov5_to_tfjs/main/public/model-strw-nano/model.json');
    // console.log(yolov_5model);
    console.log('yolov_5model cargao');
    return yolov_5model;
};

module.exports = loadModel;