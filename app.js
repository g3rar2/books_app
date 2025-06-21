const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const cors = require('cors');
const pool=require('./config/db.js');
const authMiddleware=require('./middleware/authMiddleware.js');
const app = express();
const port=process.env.PORT;
require('dotenv').config();
const authLogin=require('./routes/authLogin.js');
const libros = require('./routes/libros.js');


app.use(express.json());
app.use(cors());

app.use('/',authLogin)
app.use('/',libros)



app.get('/api/gethash/:plainText',authMiddleware ,async (req,res)=>{
    const plainText=req.params.plainText;
    const saltRound=10;
    const hash= await bcrypt.hashSync(plainText,saltRound);
    return res.send(hash);
})




//---------------------------- API DE TERCEROS---------------------------------------



app.get('/api/posts', async (req,res)=>{
try{
    let url=process.env.ENDPOINT_API_TERCEROS+"/posts";
    const axiosResponse= await axios.get(url)
    res.status(200).json({status:200, message:"Success",data: axiosResponse.data})
}catch(e){
    res.status(500).json({status:500,message:"Internal Server Error"})
}
})

app.post('/api/posts', async (req,res)=>{
    const post=req.body;
    try{
        let url=process.env.ENDPOINT_API_TERCEROS+"/posts";
        const axiosResponse= await axios.post(url,post)
        res.status(200).json({status:200, message:"Success",data: axiosResponse.data})
    }catch(e){
        res.status(500).json({status:500,message:"Internal Server Error"})
    }
})


//---------------------------- API DE TERCEROS---------------------------------------

app.listen(port, () => {
    console.log('Server is running on port ' + port);
})