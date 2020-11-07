const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');


passport.use('local.signin', new LocalStrategy({
 usernameField: 'correo',
 passwordField: 'contrasena',
 passReqToCallback: true
}, async (req,correo,contrasena,done)=>{
    console.log(req.body)
   const rows = await pool.query('SELECT * FROM empleados WHERE correo = ?',[correo]);
   console.log(rows)
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(contrasena,user.contrasena);
        if(validPassword){
            done(null, user, req.flash('success','Bienvenido '+user.nombre));
        }else{
            done(null,false,req.flash('message','Contrasena incorrecta'))

        }

    }else{
        return done(null, false, req.flash('message','El correo no existe'))
    }
}));



passport.use('local.signup',new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async (req, correo,contrasena,done)=>{
    const {nombre,apellido,puesto } = req.body;
        const newEmpleado = {
            nombre,
            apellido,
            puesto,
            correo,
            contrasena
            
        };
        newEmpleado.contrasena = await helpers.encryptPassword(contrasena);
        const result = await pool.query('INSERT INTO empleados SET ?',[newEmpleado]);
        req.flash('success','Empleado Guardado Exitosamente')
        newEmpleado.id = result.insertId;
        return done(null, newEmpleado);

}));

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser(async (id,done)=>{
    const rows = await pool.query('SELECT * FROM empleados WHERE id = ?',[id]);
    done(null,rows[0]);
})