const express = require('express');
const mysql=require('mysql2')
const app = express();
const port=3000;

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'admin123',
    database:'libreria',
})

pool.getConnection((err,connection)=>{
err? console.log("No se pudo conectar a la base de datos"):console.log("Conexion Exitosa");
})


app.use(express.json());

app.get('/api/libros',(req,res)=>{
    const sql = "select * from libros";
    pool.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({status:500,message:"Error en la consulta",data:null});
        }else{
            res.status(200).json({status:200,message:"Sucess",data:result});
        }
    })
})


app.get('/api/libros/:codigo',(req,res)=>{
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


app.post('/api/libros',(req,res)=>{
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


app.put('/api/libros',(req,res)=>{
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

app.delete('/api/libros',(req,res)=>{
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




app.listen(port, () => {
    console.log('Server is running on port ' + port);
})