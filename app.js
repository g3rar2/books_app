const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool=require('./config/db.js');
const authMiddleware=require('./middleware/authMiddleware.js');
const app = express();
const port=process.env.PORT;
require('dotenv').config();




app.use(express.json());






app.post('/api/login', async (req,res)=>{
    const userAuth=req.body;

    if(!userAuth.username || !userAuth.password){
        return res.status(403).send({status:403,message:"Todos los campos son requeridos"});
    }

    const sql='select * from user where username=?';

    pool.query(sql,[userAuth.username], async (err,result)=>{
        if(err){
            return res.status(500).json({status:500,message:"Error en la consulta"});
        }

        if(result.length===0){
            return res.status(401).json({status:401,message:"Credenciales invalidas"});
        }


        let user=result[0];
        const isMatch= await  bcrypt.compare(userAuth.password,user.password);


        if(!isMatch){
            return res.status(401).json({status:401,message:"Credenciales invalidas"});
        }



        const token=jwt.sign(
            {username: user.username,},
            process.env.SECRET_KEY,
            {expiresIn: '1h'}
        )
        

        res.status(200).json({status:200,message:"Success",token:token});
    })
})



app.get('/api/gethash/:plainText',authMiddleware ,async (req,res)=>{
    const plainText=req.params.plainText;
    const saltRound=10;
    const hash= await bcrypt.hashSync(plainText,saltRound);
    return res.send(hash);
})



app.get('/api/libros',authMiddleware,(req,res)=>{
    const sql = "select * from libros";
    pool.query(sql,(err,result)=>{
        if(err){
            return res.status(500).json({status:500,message:"Error en la consulta",data:null});
        }else{
            res.status(200).json({status:200,message:"Sucess",data:result});
        }
    })
})


app.get('/api/libros/:codigo',authMiddleware,(req,res)=>{
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


app.post('/api/libros',authMiddleware,(req,res)=>{
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


app.put('/api/libros',authMiddleware,(req,res)=>{
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

app.delete('/api/libros',authMiddleware,(req,res)=>{
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