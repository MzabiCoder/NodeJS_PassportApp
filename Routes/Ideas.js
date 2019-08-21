const express=require('express')
const router=express.Router()
const mongoose =require('mongoose')
const {ensureAuthenticate}=require('../helper/auth')





// load Idea moModel
require('../Models/Idea')
const Idea=mongoose.model('ideas')



router.get('/edit/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        res.render('ideas/edit',{
            idea:idea
        })

    })
 })
// add ideas
router.get('/add',ensureAuthenticate,(req,res)=>{
   res.render('ideas/add')
})

// ideas index pad
router.get('/',ensureAuthenticate,(req,res)=>{
    Idea.find({user:req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas
        })

    })

 })


router.post('/',ensureAuthenticate,(req,res)=>{
 
   let errors=[]

   if(!req.body.title){
    errors.push({text:'Please Add a title'})
   }

   if(!req.body.details){
    errors.push({text:'Please some details'})
}
 if (errors.length>0){
     res.render('ideas/add',ensureAuthenticate,{
         errors,
         title:req.body.title,
         details:req.body.details
     })
 }else{
     const newIdea={
         title:req.body.title,
         details:req.body.details,
         user:req.user.id
     }
    new Idea(newIdea)
    .save()
    .then(()=>{
        req.flash('success_msg','Vodeo idea added')
        res.redirect('/ideas')
    })
 }
})


router.get('/about',(req,res)=>{
    res.render('about')
})

// delte ideas

router.delete('/:id',(req,res)=>{
    Idea.remove({
        _id:req.params.id
    })
    .then(()=>{
        req.flash('success_msg','Vodeo idea removed')
        res.redirect('/ideas')
    })
})


// edir ideas

router.put('/:id',(req,res)=>{

    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        idea.title=req.body.title
        idea.details=req.body.details

        idea.save()
        .then(idea=>{
            req.flash('success_msg','Vodeo idea updated')

            res.redirect('/ideas')
        })

    })
})

module.exports=router;

