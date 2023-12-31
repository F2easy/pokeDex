// REMBEMBER CONTROLLERS AND ROUTES ARE COMBINED


//////////////////////////////////
//  Import Dependencies ///
//////////////////////////////////
const express = require('express')
const axios = require('axios')
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
    res.render('pokemon/index', { pokemon: apiRes.data.results, username, userId, loggedIn})
    
  })
  // if something goes wrong, display an error page
      .catch(err => {
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