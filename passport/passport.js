const LocalStrategy=require('passport-local').Strategy
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
//const passport=require('passport')

require('../Models/User')
const User=mongoose.model('users')

module.exports = function(passport) {
    passport.use(new LocalStrategy({ // or whatever you want to use
      usernameField: 'email',    // define the parameter in req.body that passport can use 
    },(email,password,done)=>{
      
      User.findOne({
        email:email
      }).then(user=>{
        if (!user){

        return done(null,false,{message:"no user found!!!"})
        }
        

        else {

        

        bcrypt.compare(password,user.password,(err,isMatch)=>{
          if (err) throw err;
          if(isMatch){
            return done(null,user,{message:"boom !!!"})
          }else{
            return done(null,false,{message:"password incorrect !!!"})

          }
        })




      }

      })
    }))


    // used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id); 
 // where is this user.id going? Are we supposed to access this anywhere?
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      done(err, user);
  });
});
}

