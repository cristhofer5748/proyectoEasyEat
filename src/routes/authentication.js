const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const {isLoggedIn} = require('../lib/auth')
//const { render } = require('timeago.js');


router.get('/registroempleados',isLoggedIn,async (req,res)=>{
    const empleados = await pool.query('SELECT * FROM empleados');
    res.render('formularios/registroempleado',[empleados])
});

router.post('/registroempleados',(req,res,next)=>{
    passport.authenticate('local.signup',{
        successRedirect: '/registroempleados',
        failureRedirect: '/registroempleados',
        failureFlash: true
})(req,res,next);
});

router.get('/salir',(req,res)=>{
    req.logOut();
    res.redirect('/')
})

router.get('/',(req,res)=>{
    res.render('formularios/login')
});



router.post('/',(req,res,next)=>{
   passport.authenticate('local.signin',{
       successRedirect: '/inicio',
       failureRedirect: '/',
       failureFlash: true
   })(req,res,next);
});

module.exports = router;