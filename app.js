let express = require('express');
let morgan  = require('morgan');
let bodyParser = require('body-parser');
let mongoose   = require('mongoose');

//init express
let app = express();
//connect to atlas db @see readme
mongoose.connect(
    "mongodb://root:root@node-rest-shop-shard-00-00-7kkrf.mongodb.net:27017,node-rest-shop-shard-00-01-7kkrf.mongodb.net:27017,node-rest-shop-shard-00-02-7kkrf.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin", 
    {useMongoClient: true},
    err => console.log("connect to db")
);

mongoose.Promise = global.Promise;

// add a statuic folder 
app.use('/uploads', express.static('uploads'));
//middleware 
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//handling a CORS errors
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');//access to api from any host
    res.header('Access-Control-Allow-Headers', "Origin, X-Request-With, Content-Type, Authorization, Accept");
    //check if OPTIONS request handle
    if( req.method === "OPTIONS" ) {
        res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, PATCH');
        res.status(200).json({});
    }
    next();
});

//routers
app.use('/products', require('./api/routes/products'));
app.use('/orders', require('./api/routes/orders'));
app.use( '/user', require('./api/routes/user'));

//handle errors
app.use((req, res, next)=>{
    let error = new Error('Not Found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;