var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var tf = require("@tensorflow/tfjs");
var tfnode = require("@tensorflow/tfjs-node");

var app = express();

//Object detection functions
var load_model = require('./tools/load_model')
var detection = require('./tools/object_detection')

//Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// // var flowersRouter = require('./routes/flowers');


app.use(express.json());
// app.use(express.static('public'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
// parse application/json
app.use(bodyParser.json());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// // app.use('/flowers', flowersRouter);

let loading = true;
let model = null;
let inputShape = [1, 0, 0, 3];

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });






app.post('/image', async(req, res, next) => {
    let classThreshold = 0.5;
    try {

        yolov5 = await load_model();
        // warming up model
        const dummyInput = tf.ones(yolov5.inputs[0].shape);
        const warmupResult = await yolov5.executeAsync(dummyInput);
        tf.dispose(warmupResult); // cleanup memory
        tf.dispose(dummyInput); // cleanup memory


        const imgdata = await req.body.base64image;
        console.log(imgdata.substring(0, 10));

        // to convert base64 format into random filename
        const base64img = await imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        console.log(base64img.substring(0, 10));
        // tf.engine().startScope(); // start scoping tf engine

        const imgBinary = await Buffer.from(base64img, 'base64')
        console.log(imgBinary);
        // get the tensor
        // const img = await tf.node.decodeImage(imgBinary)
        // console.log(img);

        //Now use the detectImage(imageRef.current, model, classThreshold, canvasRef.current)



        console.log(yolov5.inputs[0].shape);
        let flowers = await detection(imgBinary, yolov5, classThreshold);


        return res.send(`Deteted: ${flowers} flowers`);
        // res.json(req.body);

    } catch (e) {
        next(e);
    }
});



///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////






















module.exports = app;