const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');
const { report, post } = require('./authentication');

router.get('/inicio',isLoggedIn, async (req,res)=>{
    var hoy = new Date();
    let fecha = hoy.getDate()+'-'+ (hoy.getMonth()+1)+'-'+ hoy.getFullYear();
    const maquinas =   await pool.query('SELECT * FROM maquinas');
    res.render('formularios/index',{maquinas})
})

router.get('/registroproductos',isLoggedIn,async (req,res)=>{
    const productos =   await pool.query('SELECT * FROM productos');
    res.render('formularios/registroproducto',{productos})
});

router.post('/registroproductos',async (req,res)=>{
    const {nombre,preciocompra,precioventa, cantidadtotal } = req.body;
    const newproducto = {
        nombre,
        preciocompra,
        precioventa,
        cantidadtotal
    };
    await pool.query('INSERT INTO productos set ?',[newproducto]);
    req.flash('success','Producto Registrado Correctamente')
    res.redirect('/registroproductos')
});

router.get('/registromaquinas',isLoggedIn, async(req,res)=>{
    const maquinas =   await pool.query('SELECT * FROM maquinas');
    res.render('formularios/registromaquinas',{maquinas})
});


router.post('/registromaquinas',async (req,res)=>{
    const {lugar,longitud,latitud,fecharevision} = req.body;
    const newmaquinas = {
        lugar,
        longitud,
        latitud,
        fecharevision
    };
    await pool.query('INSERT INTO maquinas set ?',[newmaquinas]);
    req.flash('success','Maquina registrada correctamente');
    res.redirect('/registromaquinas')
});


router.get('/eliminarmaquinas/:id', async (req,res)=>{
   const {id} = req.params;
   await pool.query('DELETE FROM maquinas WHERE id = ?',[id])
    res.redirect('/registromaquinas')
})



router.get('/informe',isLoggedIn,async (req,res)=>{
    const productos = await pool.query('SELECT * FROM productos')
    const maquinas = await pool.query('SELECT a.id,a.lugar FROM rutas as r inner join empleados as e on  e.id = r.idempleado inner join maquinas as a on   a.id = r.idmaquina where r.idempleado = ?',[req.user.id])
    const empleado = req.user.id;
    console.log(empleado)
    res.render('formularios/informe',{productos,maquinas})
});

router.post('/informe',async (req,res)=>{
    const {idempleado,idmaquina,fechahora, idproductomasvendido,idproductomenosvendido,totalventas,totalproductos } = req.body;
    const newreporte = {
        idempleado,
        idmaquina,
        fechahora,
        idproductomasvendido,
        idproductomenosvendido,
        totalproductos,
        totalventas
    };
    await pool.query('INSERT INTO reportechequeo set ?',[newreporte]);
    req.flash('success','Checkeo Almacenado Correctamente')
    res.redirect('/informe')
});

router.get('/llenado',isLoggedIn, async(req,res)=>{
    const productos = await pool.query('SELECT * FROM productos')
    const maquinas = await pool.query('SELECT a.id,a.lugar FROM rutas as r inner join empleados as e on  e.id = r.idempleado inner join maquinas as a on   a.id = r.idmaquina where r.idempleado = ?',[req.user.id])
    
    res.render('formularios/llenado',{productos,maquinas})
});


router.post('/llenado',async(req,res)=>{
    const {idmaquina,idproducto,cantidadmaquina} = req.body;
    const newllenado = {
        idmaquina,
        idproducto,
        cantidadmaquina
        
    };
    var hoy = new Date();
    let fecha = hoy.getFullYear() +'-'+ (hoy.getMonth()+1)+'-'+ hoy.getDate() ;
    await pool.query('UPDATE maquinas SET fecharevision = ? WHERE id = ?',[fecha,idmaquina])
    await pool.query('UPDATE productos SET cantidadtotal = cantidadtotal - ? WHERE id = ?',[cantidadmaquina,idproducto])
    await pool.query('INSERT INTO productomaquina set ?',[newllenado]);
    req.flash('success','Producto Almacenado en Maquina')
    res.redirect('/llenado')
})



router.get('/reportes',isLoggedIn,(req,res)=>{
    res.render('formularios/reportes')
});






router.get('/rutas',isLoggedIn, async(req,res)=>{
    const empleados = await pool.query('SELECT * FROM empleados');
    const maquinas = await pool.query('SELECT * FROM maquinas');
    const rutas = await pool.query('SELECT r.id,e.nombre,a.lugar,a.longitud,a.latitud,a.fecharevision FROM rutas as r inner join empleados as e on  e.id = r.idempleado inner join maquinas as a on   a.id = r.idmaquina',[req.user.id]);
  
    res.render('formularios/rutas',{empleados, maquinas,rutas})
});


router.post('/rutas',async (req,res)=>{
    const {idempleado,idmaquina,fecharevision} = req.body;
    const newruta = {
        idempleado,
        idmaquina,
        fecharevision
        
    };
    await pool.query('INSERT INTO rutas set ?',[newruta]);
    req.flash('success','Ruta Creada')
    res.redirect('/rutas')

})

router.get('/rutasdemaquinas',(req, res) => {
    pool.query('SELECT r.id,e.nombre,a.lugar,a.longitud,a.latitud,DATE_FORMAT(a.fecharevision,"%d/%m/%Y") AS fecharevision FROM rutas as r inner join empleados as e on  e.id = r.idempleado inner join maquinas as a on   a.id = r.idmaquina where r.idempleado = ?',[req.user.id], (error, result) => {
        if (error) throw error;
        
        res.send(result);
    });
});


router.get('/inventario',isLoggedIn,async (req,res)=>{
    const productos =   await pool.query('SELECT * FROM productos');
    res.render('formularios/inventario',{productos})
});

router.get('/visitas',isLoggedIn,async (req,res)=>{
    const visitas =   await pool.query('SELECT e.id as idempleado,e.nombre,m.id,m.lugar,r.fechahora FROM reportechequeo as r inner join empleados as e on r.idempleado = e.id inner join maquinas as m on r.idmaquina = m.id');
    res.render('formularios/visitas',{visitas})
});

router.get('/ventas',isLoggedIn,async (req,res)=>{
    const ventas =   await pool.query('SELECT r.fechahora,SUM(r.totalventas) as Total_Ventas,SUM(r.totalproductos) as Totalproducto,m.lugar FROM reportechequeo as r inner join productos as p on r.idproductomasvendido = p.id inner join productos as p2 on r.idproductomenosvendido = p2.id inner join maquinas as m on r.idmaquina = m.id GROUP BY idproductomasvendido, idproductomenosvendido ORDER BY TotalVentas DESC ');
    res.render('formularios/ventas',{ventas})
});


router.get('/productos',isLoggedIn,async (req,res)=>{
    const productos =   await pool.query('SELECT p.nombre , COUNT(r.idproductomasvendido) as Mas_Vendido ,p2.nombre as Menos, COUNT(r.idproductomenosvendido) as Menos_Vendido,m.lugar, SUM(r.totalproductos) as unidadesvendidas, SUM(r.totalventas) as totalventas FROM reportechequeo as r inner join productos as p on r.idproductomasvendido = p.id inner join productos as p2 on r.idproductomenosvendido = p2.id inner join maquinas as m on r.idmaquina = m.id GROUP BY idproductomasvendido, idproductomenosvendido ORDER BY Mas_Vendido DESC');
    res.render('formularios/productos',{productos})
});





module.exports = router;