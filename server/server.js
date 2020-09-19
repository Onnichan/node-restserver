require('./config/config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// parse application /xxx-form-urlencoded
app.use(bodyParser.urlencoded({ extended:false}))

// parse application/json
app.use(bodyParser.json())

app.use( require('./routes/usuario'));


mongoose.connect(process.env.URLDB,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex:true
},(err,res)=>{
  
  if(err) throw err;

  console.log('Base de datos ONLINE');
})

app.listen(process.env.PORT,()=> {
  console.log(`Escuchando en el puerto ${process.env.PORT}`);
})
