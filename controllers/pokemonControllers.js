// REMBEMBER CONTROLLERS AND ROUTES ARE COMBINED


//////////////////////////////////
//  Import Dependencies ///
//////////////////////////////////
const express = require('express')
const mongoose = require('mongoose');
const axios = require('axios')
const Pokemon = require('../models/pokemon')
const allPokemonURL = process.env.API_BASE_URL
const nameSearchBaseURL = process.env.POKEMON_NAME_URL
const pokemonDesc = process.env.POKEMON_DESCR_URL
const Team = require('../models/team')
const User = require('../models/user')




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

// suppossed to add pokemon to pokemonDB hat later we can access them and then redirects to trainer page 
// POST --> /pokemon/add
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
     /// res.send(newPokemon)
      res.redirect(`/pokemon/mine`)
    })
    .catch(err => {
      console.log('error')
      res.redirect (`/error?error=${err}`)
   })

})

// displays all the user's saved pokemon
router.get('/mine', (req,res) => {
  const { username, loggedIn, userId } = req.session

  // query the DB for all pokemon beloging to the logged in trainer
  Pokemon.find({ owner: userId })
  // display them in a pokemon team format
  .then(userPokemon => {
    Team.find({ owner: userId})
      .then(teams =>{
    res.render('pokemon/mine', { pokemon: userPokemon, teams, username, userId, loggedIn })
  });
})
  // which 
  .catch (err => {
    console.log('error')
    res.redirect (`/error?error=${err}`)
  })
})











// POST --> /pokemon/add
//suppossed to add a team to TeamDB so that later we can access them and then redirects to trainer page 
// creates teams 
router.post('/team/add', (req, res) => {
 
  const { username, userId, pokemonId } = req.session;
  const teamObject = req.body
  teamObject.owner = userId
  console.log("teamObject: ",req.body)
  teamObject.owner = userId
  console.log("userId and PokemonId", req.body)
  Team.create(teamObject)
    .then(newTeam => {
       console.log("New Team created: ", newTeam)
      // console.log("pokemon Id ",pokemonId)
  //  res.send(teamObject)
    res.redirect(`/pokemon/trainer`)
     })
      .catch((error) => {
        console.error('Error adding Pokémon to team:', error);
        res.status(500).json({ error: 'Failed to add Pokémon to team' });
      });
  });

  
// GET --> /pokemon/add
// create teams
// router.get('/team/add', (req, res) => {
//   const { username, loggedIn, userId } = req.session;
//   res.render('pokemon/trainer', { username, loggedIn, userId } )
// })




// GET --> /pokemon/trainer
// displays all the user's saved teams
router.get('/trainer', async (req, res) => {
  try {
    const { username, loggedIn, userId } = req.session;
    const teams = await Team.find({ owner: userId }).populate('pokemon');
    console.log(teams[0].pokemon)

    res.render('pokemon/trainer', { teams, username, userId, loggedIn });
  } catch (error) {
    console.error(error);
    res.redirect(`/error?error=${error.message}`);
  }
});



// GET -> /addToTeam/:teamId/:pokeId
// adds one pokemon to a team 
router.post('/addToTeam/:pokeId', (req,res) => {
  const { username, loggedIn, userId } = req.session
  const { teamId} = req.body // retrieves pokeId and teamId
  const pokeId = req.params.pokeId
  const pokemon  = Pokemon.find({_id: req.params.pokeId})
console.log(pokemon)
  console.log("req.body: ", req.body)
  console.log('Pokemon:', pokeId)
  Team.findById(teamId)
    .then(team =>{
      if (!team) {
        throw new Error('Team not found');
      }
      team.pokemon.push(pokeId);
      return team.save();
    })
    .then(savedTeam => {
    //  res.send(savedTeam)so
     res.redirect('/pokemon/trainer');
    })
    .catch(err => {
      console.error('Error adding Pokémon to team:', err);
      res.redirect(`/error?error=${err}`);
    });
});

// DELETE --> /Pokemon/delete/:id
// remove pokemon from team only available to authorized user 
router.delete('/delete/:id', (req, res) =>{
  const { username, loggedIn, userId } = req.session
  // target the specific place
  const pokemonId = req.params.id
  // find it in the db
  Pokemon.findById(pokemonId)
  // delete it 
  .then(pokemon => {
     // determin if loggedIn user is authorized to delete this (aka, the owner)
  if (pokemon.owner == userId){
    //here is where we delete
    return pokemon.deleteOne()
  } else { 
    // if the loggedIn user is not the owner
    res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Delete%20this%20Place`)
  }
  })
// redirect to another page
.then(deletedPokemon => {
  res.redirect('/pokemon/mine')
})
.catch (err => {
  console.log('error')
  res.redirect (`/error?error=${err}`)
})
})


router.put('/team/update/:id', (req, res) => {
  const { username, loggedIn, userId } = req.session
  const teamId = req.params.id ;
  const newTeamName = req.body.name;
    console.log("team Id", teamId)
    console.log("new name", newTeamName)
  // Update the team name in the database using the teamId and newTeamName
  Team.findByIdAndUpdate(teamId, { name: newTeamName })
  .then(() => {
    console.log('Team name updated successfully');
    res.redirect('/pokemon/trainer');
  // Redirect the user back to the page displaying the teams
  })
  .catch (err => {
    console.log('error')
    res.redirect (`/error?error=${err}`)
  })
});




// GET -> /pokemon/:name
// gives us a specific Pokemon's details after clicking card

router.get('/:name',async(req, res) => {
  const { username, loggedIn, userId } = req.session
  const pokemonName = req.params.name
  const teams = await Team.find({owner: userId})
  console.log(teams)
  // const {enter parameters here} = req.params you can add mutliple parameters
  // make our api call
  axios(`${nameSearchBaseURL}${pokemonName}`)
  .then(apiRes => {
    axios(apiRes.data.species.url)
      .then(resTwo => {
        const flavorTextEntries = resTwo.data.flavor_text_entries;
        
        // Filter for English entries and entries specific to Pokémon Shield
        const englishEntries = flavorTextEntries.filter(entry =>
          entry.language.name === 'en' && entry.version.name === 'alpha-sapphire'
        );

        if (englishEntries.length > 0) {
          const finalDescription = englishEntries[englishEntries.length - 1].flavor_text;
          console.log("Final English description in Pokémon Shield:", finalDescription);
          
          // Continue with the rest of your code...
          const pokemonInfo = apiRes.data;
          res.render('pokemon/show', { pokemon: pokemonInfo, teams, username, userId, loggedIn, description: finalDescription });
        } else {
          console.log("No English description found for Pokémon platinum.");
          // Handle the case when no English description is available for Pokémon Shield
        }
      })
      .catch(error => {
        console.error("Failed to fetch the Pokémon species information:", error);
        // Handle the error appropriately
      });
  }) 
  //  if we get an error display said error
  .catch(err => {
    console.log('error')
    res.redirect (`/error?error=${err}`)
 });
  
  
})







//////////////////////////////////
//  Export Router ///
//////////////////////////////////

module.exports = router