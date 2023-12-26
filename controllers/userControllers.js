// REMBEMBER CONTROLLERS AND ROUTES ARE COMBINED

//////////////////////////////////
//  Import Dependencies ///
//////////////////////////////////
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')


//////////////////////////////////
//  Create Router ///
//////////////////////////////////
const router = express.Router()




//////////////////////////////////
//  Routes + Controllers ///
//////////////////////////////////
// GET -> signup - /users/signup
router.get('/signup', (req, res) => {
  const { username, loggedIn, userId } = req.session

  res.render('users/signup', {username, loggedIn, userId})
})

// POST -> signup - /users/signup
// this function will need to ve async, bc we need to use bcrypt
router.post('/signup', async (req, res) =>{
  const { username, loggedIn, userId } = req.session

  const newUser = req.body 
  
  res.send(newUser)

  // we need to encrypt the password, which is what we will save to the db
  // bcrypt is an encryption service
  // genSalt creates 'salt rounds' -> puts it through 10 rounds of encrypting
  // making the stored pw harder to hack/de-encrypt
  newUser.password= await bcrypt.hash(
    newUser.password, 
    await bcrypt.genSalt(10)
  )

  // we can now create our user
  User.create(newUser)
      .then(user => {
        // the new user will be created and redirected to the login page
        res.redirect('/users/login')
      })
      .catch(error =>{
        console.log('error')

        res.send('something went wrong')
      })

})

// GET -> login/users/login
router.get('/login', (req, res) => {
  const { username, loggedIn, userId } = req.session

  res.render('users/login', {username, loggedIn, userId})
})


// GET -> logout
router.get('/logout', (req, res) => {
  const { username, loggedIn, userId } = req.session

  res.render('users/logout', {username, loggedIn, userId})
})
// DELETE -> logout




//////////////////////////////////
//  Export Router ///
//////////////////////////////////

module.exports = router
