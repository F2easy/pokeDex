// REMBEMBER CONTROLLERS AND ROUTES ARE COMBINED


//////////////////////////////////
//  Import Dependencies ///
//////////////////////////////////
const express = require('express')
const axios = require('axios')
const Pokemon = require('../models/pokemon')
const allPokemonURL = process.env.API_BASE_URL
const nameSearchBaseURL = process.env.POKEMON_NAME_URL
const pokemonDesc = process.env.POKEMON_DESCR_URL






//////////////////////////////////
//  Create Router ///
//////////////////////////////////
const router = express.Router()




//////////////////////////////////
//  Routes + Controllers ///
//////////////////////////////////
// GET -> /pokemon/all
// gives all pokemon in the api for an index
router.get('/all', (req,res) => {
  const { username, loggedIn, userId } = req.session
  // we have to make our api call
  axios(allPokemonURL)
  // if we get data, render an index page    
  .then(apiRes => {
    console.log('this came back from the api: \n', apiRes.data.results)
    // apiRes is name and the url inside of the url there is an array of objects about
   // res.render('pokemon/index', { pokemon: apiRes.data.results, username, userId, loggedIn})
    const pokemon = apiRes.data.results.map((data, index) => ({
      name: data.name,
      id: index + 1,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`,
    }));

     res.render('pokemon/index', { pokemon, username, userId, loggedIn})
  })
  // if something goes wrong, display an error page
      .catch(err => {
        console.log('error')
        res.redirect (`/error?error=${err}`)
     })
})

// POST --> /places/add
// gets data for the all pokemon show pages and adss to the users list
router.post('/add', (req,res) => {
  const { username, loggedIn, userId } = req.session

  const thePokemon = req.body
  thePokemon.owner = userId
  // default value for a checked box is 'on'
  // this line of code coverts it 2x
  // which results in a boolean value
  thePokemon.onTeam = !!thePokemon.onTeam
  thePokemon.favorite = !!thePokemon.favorite
  console.log('this must be the pokemon: \n', thePokemon)
  
  Pokemon.create(thePokemon)
    .then(newPokemon => {
     // res.send(newPokemon)
     res.redirect(`/pokemon/myTeam`)
    })
    .catch(err => {
      console.log('error')
      res.redirect (`/error?error=${err}`)
   })
  
})


// GET --> /pokemon/trainer
// displays all the user's saved places
router.get('/trainer', (req,res) => {
  const { username, loggedIn, userId } = req.session

  // query the DB for all pokemon beloging to the logged in trainer
  Pokemon.find({ owner: userId })
  // display them in a pokemon team format
  .then(userPokemon => {
  // res.send(userPokemon)
   res.render('pokemon/trainer', { pokemon: userPokemon, username, userId, loggedIn })
  })
  // which 
  .catch (err => {
    console.log('error')
    res.redirect (`/error?error=${err}`)
  })
})


// GET -> /pokemon/:name
// gives us a specific Pokemon's details after clicking card

router.get('/:name',(req, res) => {
  const { username, loggedIn, userId } = req.session
  const pokemonName = req.params.name
  // const {enter parameters here} = req.params you can add mutliple parameters
  // make our api call
  axios(`${nameSearchBaseURL}${pokemonName}`)
    // render results on the show page which should give pokemon individual details
    .then(apiRes => {
      console.log('this is apiRes.data \n', apiRes.data)
      
      // res.send(apiRes.data)
        const pokemonInfo = apiRes.data
      // render our results on the 'show'/detail page
       res.render('pokemon/show', { pokemon: pokemonInfo, username, userId, loggedIn})
    })
    // if we get an error display said error
  .catch(err => {
    console.log('error')
    res.redirect (`/error?error=${err}`)
 })
  
  
})


// router.get('/show',(req, res) => {
//   const { username, loggedIn, userId } = req.session

// axios(allPokemonURL)

// .then(apiRes => {
//   //pokeNumber[pokeNumber.length -1]
//   console.log('this came back from the api: \n', apiRes.data.results)
//   //console.log(pokeNumber)
//   // apiRes.data is an array of pokemon objects
//   // res.send(apiRes.data)
//   //res.send(apiRes.data)
//   res.render('pokemon/show', { pokemon: apiRes.data.results, username, userId, loggedIn})
//   //console.log(apiRes)
//   const pokemon = apiRes.data.results.map((data, index) => ({
//       name: data.name,
//       id: index + 1,
//       image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
//   }))
//   //console.log(pokemon)
//   res.render('pokemon/show', { pokemon, username, userId, loggedIn})
// })
// })






//////////////////////////////////
//  Export Router ///
//////////////////////////////////

module.exports = router