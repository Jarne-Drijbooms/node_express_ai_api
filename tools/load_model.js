var tf = require("@tensorflow/tfjs");

const loadModel = async(model_location) => {
    // yolov_5model = await tf.loadGraphModel(path.join(__dirname, 'public/model-strw-nano/model.json'));
    yolov_5model = await tf.loadGraphModel(model_location);
    // console.log(yolov_5model);
    console.log('Model ready to use');
    return yolov_5model;
};

module.exports = loadModel;