const express = require('express');
const mysql=require('mysql2')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const port=3000;
const SECRET_KEY='MyClaveSecreta';




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

const authMiddleware=(req,res,next)=>{
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({status:'401',message:"Token no proporcionado"});
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err,user) => {
        if(err){
            return res.status(401).json({status:'401',message:"Token expiro"});
        }
        next();
    })


}




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
            SECRET_KEY,
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