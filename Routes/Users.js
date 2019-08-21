const express=require('express')
const router=express.Router()
const mongoose =require('mongoose')
const bcrypt=require('bcryptjs')
const passport =require('passport')
const {ensureAuthenticate}=require('../helper/auth')




// load Idea moModel
require('../Models/User')
const User=mongoose.model('users')




// login 

router.get('/login',(req,res)=>{
    
    res.render('users/login')
})

router.get('/logout',(req,res)=>{
    
    req.logout()
    req.flash('success_msg','Your are logged out !!!')
    res.redirect('/users/login')
})

// register
router.get('/register',(req,res)=>{
    res.render('users/register')
})

// Login form POST

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        badRequestMessage:'Error from passport',
        failureFlash:true
    })(req,res,next);
})

// Register Form POST

router.post('/register',(req,res)=>{
    
   const errors=[]

   if (req.body.password != req.body.password2 ){
       errors.push({
           text:'Password are not match !!!'
       })
    }
    if (req.body.password.length < 4  ){
        errors.push({
            text:'Password needs to be at least 5 caracters !!!'
        })
    }

     if (errors.length > 0 ){
       res.render('users/register',{
           errors:errors,
           name:req.body.name,
           email:req.body.email,
           password:req.body.password,
           password2:req.body.password2
          
       })
    }else{
        User.findOne({
           email:req.body.email 
        }).then(user=>{
            if(user){
                req.flash('error_msg','Email already registred!!!')
                res.redirect('/users/register')

            }else{
                const newUser= new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                })
                
                // new User(newUser)
                // .save()
                // .then(()=>{
                //     req.flash('success_msg','User Registred')
                //     res.redirect('/users/login')
                // })



         bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if (err) throw err
                newUser.password=hash
                newUser.save()
                .then((user)=>{
                    req.flash('success_msg','You are now registred!!!')
                    res.redirect('/users/login')
                })
                .catch(err=>{
                    console.log(`error is ....${err}`)
                    return
                    
                })

                
            })
        })





            }
        })
       
       
       
       
 
    }
   
})



module.exports=router;