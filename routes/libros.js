const express = require('express');
const pool=require('../config/db.js');
const authMiddleware=require('../middleware/authMiddleware.js');
const router=express.Router();



router.get('/api/libros',authMiddleware,(req,res)=>{
    const sql = "select * from libros";
    pool.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({status:500,message:"Error en la consulta",data:null});
        }else{
            res.status(200).json({status:200,message:"Sucess",data:result});
        }
    })
})


router.get('/api/libros/:codigo',authMiddleware,(req,res)=>{
    const codigo=parseInt(req.params.codigo)
    const sql = "select * from libros where codigo = ?";
    pool.query(sql,codigo,(err,result)=>{
        if(err){
            return res.status(500).json({status:500,message:"Error en la consulta",data:null});
        }else{
            return  res.status(200).json({status:200,message:"Sucess",data:result});
        }
    })
})


router.post('/api/libros',authMiddleware,(req,res)=>{
    const libro=req.body;
    const sql = "insert into libros (titulo,autor,anio) values (?,?,?)";
    pool.query(sql,[libro.titulo,libro.autor,libro.anio],(err,result)=>{
        if(err){
            return res.status(500).json({status:500,message:"Error",data:null});
        }else{

            return  res.status(200).json({status:200,message:"Sucess",data:libro});
        }
    })
})


router.put('/api/libros',authMiddleware,(req,res)=>{
    const libro=req.body;
    const sql="update libros set titulo=?,autor=?,anio=? where codigo=?";
    pool.query(sql,[libro.titulo,libro.autor,libro.anio,libro.codigo],(err,result)=>{
        if(err){
            return res.status(500).json({status:500,message:"Error",data:null});
        }else{
            return res.status(200).json({status:200,message:"Sucess",data:libro});
        }
    })
})

router.delete('/api/libros',authMiddleware,(req,res)=>{
    const libro=req.body;
    const sql="delete from libros where codigo=?";
    pool.query(sql,[libro.codigo],(err,result)=>{
        if(err){
            return res.status(500).json({status:500,message:"Error",data:null});
        }else{
            return res.status(200).json({status:200,message:"Sucess",data:null});
        }
    })
})

module.exports = router;