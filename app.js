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


app.get('/api/libros',(req,res)=>{
    const query = "select * from libros";
    pool.query(query,(err,result)=>{
        if(err){
            return res.status(500).json({status:500,message:"Error en la consulta",data:null});
        }else{
            res.status(200).json({status:200,message:"Sucess",data:result});
        }
    })
})


app.get('/api/libros/:codigo',(req,res)=>{
    const codigo=parseInt(req.params.codigo)
    const query = "select * from libros where codigo = ?";
    pool.query(query,codigo,(err,result)=>{
        if(err){
            return res.status(500).json({status:500,message:"Error en la consulta",data:null});
        }else{
            res.status(200).json({status:200,message:"Sucess",data:result});
        }
    })
})


app.use(express.json());

app.listen(port, () => {
    console.log('Server is running on port ' + port);
})