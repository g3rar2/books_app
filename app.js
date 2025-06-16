const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool=require('./config/db.js');
const authMiddleware=require('./middleware/authMiddleware.js');
const app = express();
const port=process.env.PORT;
require('dotenv').config();
const authLogin=require('./routes/authLogin.js');
const libros = require('./routes/libros.js');


app.use(express.json());

app.use('/',authLogin)
app.use('/',libros)



app.get('/api/gethash/:plainText',authMiddleware ,async (req,res)=>{
    const plainText=req.params.plainText;
    const saltRound=10;
    const hash= await bcrypt.hashSync(plainText,saltRound);
    return res.send(hash);
})


app.listen(port, () => {
    console.log('Server is running on port ' + port);
})