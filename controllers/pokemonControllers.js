// REMBEMBER CONTROLLERS AND ROUTES ARE COMBINED


//////////////////////////////////
//  Import Dependencies ///
//////////////////////////////////
const express = require('express')
const allPokemonURL = process.env.POKEMON_API_URL
const nameSearchBaseURL = process.env.POKEMON_NAME_URL
const axios = require('axios')


//////////////////////////////////
//  Create Router ///
//////////////////////////////////
const router = express.Router()




//////////////////////////////////
//  Routes + Controllers ///
//////////////////////////////////
// GET -> /pokemon/all
// gives all pokemon in the api for an index
router.get('/all',(req,res) => {
  const { username, loggedIn, userId } = req.session
  // we have to make our api call
  axios(allPokemonURL)
  // if we get data, render an index page    
  .then(apiRes => {
    console.log('this came back from the apit: \n', apiRes)

    res.send(apiRes)
  })
  // if something goes wrong, display an error page
      .catch(err => {
        console.log('error')
        res.redirect (`/error?error=${err}`)
     })
})

// GET -> /places/:name
// gives us a specific Pokemon's details after searching by name







//////////////////////////////////
//  Export Router ///
//////////////////////////////////

module.exports = router