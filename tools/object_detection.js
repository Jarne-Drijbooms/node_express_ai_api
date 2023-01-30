var tf = require("@tensorflow/tfjs");
var tfnode = require("@tensorflow/tfjs-node");

//For detecting

const preprocess = (source, modelWidth, modelHeight) => {
    let xRatio, yRatio;
    const input = tf.tidy(() => {
        // const img = tf.browser.fromPixels(source);

        const img = tfnode.node.decodeImage(source);
        const [h, w] = img.shape.slice(0, 2);
        const maxSize = Math.max(w, h);
        const imgPadded = img.pad([
            [0, maxSize - h],
            [0, maxSize - w],
            [0, 0],
        ]);
        xRatio = maxSize / w;
        yRatio = maxSize / h;
        return tf.image
            .resizeBilinear(imgPadded, [modelWidth, modelHeight])
            .div(255.0)
            .expandDims(0);
    });
    return [input, xRatio, yRatio];
};

const detectImage = async(imgSource, model, classThreshold) => {
    const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);

    tf.engine().startScope();
    const [input, xRatio, yRatio] = preprocess(imgSource, modelWidth, modelHeight);

    let objects_detected = 0;

    await model.executeAsync(input).then((res) => {
        const [boxes, scores, classes] = res.slice(0, 3);
        const boxes_data = boxes.dataSync();
        const scores_data = scores.dataSync();
        const classes_data = classes.dataSync();
        // renderBoxes(canvasRef, classThreshold, boxes_data, scores_data, classes_data, [xRatio, yRatio]);
        // console.log("Aqui viene lo chiido");
        // console.log(res.slice(0, 3));
        // console.log(`boxes_data: ${boxes_data}`);
        // console.log(`scores_data: ${scores_data}`);
        // console.log(`scores_data: ${typeof scores_data}`);
        // console.log(`classes_data: ${classes_data}`);
        // console.log("xdddd");
        tf.dispose(res);
        for (let i = 0; i < scores_data.length; ++i) {
            // filter based on class threshold
            if (scores_data[i] > classThreshold) {
                objects_detected += 1;
            }
        }

    });
    let date_ob = new Date();
    let day = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    console.log(`\n ${year}/${month}/${day}-${hours}:${minutes}:${seconds} - Objects detected: ${objects_detected}`);
    tf.engine().endScope();
    return objects_detected;
};


module.exports = detectImage;