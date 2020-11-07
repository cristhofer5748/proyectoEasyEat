const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const expphbs= require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const {database} = require('./keys')
const passport = require('passport');



require('./lib/passport');

//configuraciones
app.set('port',process.env.PORT || 8080);
app.set("views", path.join(__dirname, 'views'));
app.engine('.hbs',expphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers:  require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//midelwares
app.use(session({
    secret: 'sesiones',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database) 
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());



//global variables
app.use((req,res,next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use(require('./routes/routes'));

//public 
app.use(express.static(path.join(__dirname,'public')));


//starting the server
app.listen(app.get('port'),()=>{
    console.log('Ultilizando el puerto '+app.get("port"))
})
