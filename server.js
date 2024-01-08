const express = require('express') // import express framework
require('dotenv').config() // import/load ENV variables
const path = require('path') // import path module
const middleware = require('./utils/middleware')
const progressBar = require('progress')
/////////////////////////
//// Import Routers  ////
/////////////////////////
// register routes everytime you create a new router file
// meaning improting the router and server js
const UserRouter = require('./controllers/userControllers')
const PokemonRouter = require('./controllers/pokemonControllers')
const TrainerRouter = require('./controllers/pokemonControllers')
////////////////////////////////
//// Create the app object  ////
////////////////////////////////


////////////////////////////////////////////////////
//// Create the app object + set up view engine ////
////////////////////////////////////////////////////
const app = express() // call the express function

// view engine - ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'images')))

/////////////////////
//// Middleware  ////
/////////////////////
middleware(app)

/////////////////
//// Routes  ////
/////////////////


// basic home route
app.get('/', (req, res) => {
    const { username, loggedIn, userID} = req.session
   // res.send('the app is connected')
   res.render('home.ejs', { username, loggedIn, userID})
})

app.use('/users', UserRouter)
app.use('/pokemon', PokemonRouter)
app.use('/trainer', TrainerRouter)

// error page
app.get('/error', (req, res) => {
    const error = req.query.error || 'Something is off please go back home'

    const { username, loggedIn, userID} = req.session

    //res.send(error)
    res.render('error.ejs', {error, userID, username, loggedIn})
})

//////////////////////////
//// Server Listener  ///
//////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Your server is running, better go catch it')
})

// End