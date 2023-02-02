var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

const jwt = require("jsonwebtoken");
const config = require("config");

const crypto = require("crypto")
const algorithm = "aes-256-cbc"
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//var sql = require("mssql");
const { COnnection, Request, Connection } = require("tedious");

const dotenv = require('dotenv');

function encrypt(text){
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
}

function decrypt(text){
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}




var app = express();

//Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var phoneDetectionRouter = require('./routes/phone_detection');
const { buffer } = require('@tensorflow/tfjs');
// // var flowersRouter = require('./routes/flowers');


app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '999mb' }));
// parse application/json
app.use(bodyParser.json({ limit: '999mb' }));



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
app.use('/image', phoneDetectionRouter);
// // app.use('/flowers', flowersRouter); 


/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
//TODO: Fix this error handler
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

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
//Testing split image


/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


//JWTtoken code
app.get('/api', (req, res) => {
    res.json({
        message: "Welcome to the API!"
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message: "Post created ...",
                authData
            });
        }
    });
});


app.post("/api/login", (req, res)=> {
    const user = {
        id: 1,
        username: 'User01',
        email: 'user01@hotmail.com',
    }

    jwt.sign({user}, 'secretkey',{expiresIn: '30s' }, (err, token)=>{
        res.json({
            token
        });
    });
});



function verifyToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();

    } else{
        res.sendStatus(403);
    }
};


const dbconfig ={
    authentication: {
        options: {
            userName: "dev6",
            password: "n7Vw24vSzsyMKL"
        },
        type: "default"
    },
    server: "dev6h3.database.windows.net",
    options: {
        database: "dev6h3",
        encrypt: true
    }
};

const connection = new Connection(dbconfig);


connection.on("connect", err => {
    if (err) {
      console.error(err.message);
    } else {
      queryDatabase();
    }
  });





module.exports = app;