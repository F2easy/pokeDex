//////////////////////////////////
// Our Schema and Dependencies ///
//////////////////////////////////
const mongoose = require('../utils/connection')

// destructuring the Schema dn model from mongoose
const {Schema, model} = mongoose


const Pokemon = require('../models/pokemon')


//////////////////////////////////
//  Schema Definition ////////////
//////////////////////////////////
const arrayLimit = (arr) =>{
  return arr.length <= 6 
}
    const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    pokemon: {
     type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pokemon' }],
     validate: [arrayLimit, " {PATH} CANNOT EXCEED 6"] 
    }
  });






//////////////////////////////////
//  create Team model ////////////
//////////////////////////////////
const Team = model('Team', teamSchema)




// attempting to use populate

//////////////////////////////////
//  export Team model ////////////
//////////////////////////////////
module.exports = Team