
const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const saltRounds = 10;

app.get('/usuario', (req,res)=> {
  // res.json('get usuario local');
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({ estado : true} , 'nombre email role estado google img')
          .skip(desde)
          .limit(limite)
          .exec( (err, usuarios) => {
            if(err){
              return res.status(400).json({
                ok:false,
                err
              });
            }
            
            Usuario.countDocuments({},(err,conteo) =>{
              res.json({
                ok:true,
                usuarios,
                cuantos:conteo
              });
            })
          })
})

app.post('/usuario', (req,res)=> {

  let body = req.body;

  let usuario = new Usuario({
    nombre : body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password,saltRounds),
    role: body.role
  });

  usuario.save((err,usuarioDB)=>{
    if(err){
      return res.status(400).json({
        ok:false,
        err
      });
    }

    res.json({
      ok:true,
      usuario: usuarioDB
    });
  })
})

app.put('/usuario/:id', (req,res)=> {
  
  let id = req.params.id;
  let body = _.pick(req.body , ['nombre','email','img','role','estado']);

  Usuario.findByIdAndUpdate(id, body, { new : true, runValidators: true } ,(err,usuarioDB) =>{
    if(err){
      return res.status(400).json({
        ok:false,
        err
      });
    }

    res.json({
      ok:true,
      usuario: usuarioDB
    });

  })

  // res.json({
  //   id
  // });
})

app.delete('/usuario/:id', (req,res)=> {
  
  let id = req.params.id;

  // Usuario.findByIdAndRemove(id , (err, usuarioBorrado) =>{
  //   if(err){
  //     return res.status(400).json({
  //       ok:false,
  //       err
  //     });
  //   }

  //   if( usuarioBorrado === null){
  //     return res.status(400).json({
  //       ok:false,
  //       err:{
  //         message: 'Usuario no encontrado'
  //       }
  //     });
  //   }

  //   res.json({
  //     ok:true,
  //     usuario: usuarioBorrado
  //   });
  // })
  
  Usuario.findByIdAndUpdate(id,{ estado : false},{  new : true, runValidators: true },(err,usuarioBorrado)=>{
    if(err){
          return res.status(400).json({
            ok:false,
            err
          });
        }
    
        if( usuarioBorrado === null){
          return res.status(400).json({
            ok:false,
            err:{
              message: 'Usuario no encontrado'
            }
          });
        }
    
        res.json({
          ok:true,
          usuario: usuarioBorrado
        });
  })
})

module.exports = app;
