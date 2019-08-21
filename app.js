const express = require('express')
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const passport = require('passport')



const app = express()

// passport config

require('./passport/passport')(passport)



// load routes

const ideas = require('./Routes/Ideas')
const users = require('./Routes/Users')

app.use(express.static(path.join(__dirname, 'public')))


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))

// parse application/json
app.use(bodyParser.json())

// methode ovveride 

app.use(methodOverride('_method'))

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,

}))

// initialize passport 
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// global variables for session and flash

app.use(function (req, res, next) {

  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null

  next()

})


const db = require('./config/db')


mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    //useCreateIndex: true

  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

//   mongoose
//   .connect('mongodb://localhost:27017/testdb', {
//     useNewUrlParser: true,
//    // useCreateIndex: true,
//     //useMongoClient:true
// })
//   .then(() => console.log('MongoDB Connected...'))
//   .catch(err => console.log(err));

// handlebars middleware

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  const title = 'WELCOME'
  res.render('INDEX', {
    title: title
  })
})

app.get('/about', (req, res) => {
  const title = 'WELCOME'
  res.render('INDEX', {
    title: title
  })
})






// use routes

app.use('/ideas', ideas)
app.use('/users', users)



//const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT || 3338;


app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`)
})