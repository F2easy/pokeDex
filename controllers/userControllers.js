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
router.post('/signup', async (req, res) => {
  // const { username, loggedIn, userId } = req.session

  const newUser = req.body

  // we need to encrypt the password, which is what we will save to the db
  // bcrypt is an encryption service
  // genSalt creates 'salt rounds' -> puts it through 10 rounds of encrypting
  // this makes the stored password harder to hack(de-encrypt)
  newUser.password = await bcrypt.hash(
      newUser.password, 
      await bcrypt.genSalt(10)
  )

  // we can now create our user
  User.create(newUser)
      .then(user => {
          // the new user will be created and redirected to the login page
          res.redirect('/users/login')
      })
      .catch(error => {
          console.log('error')

          res.send('something went wrong')
      })
})



// GET -> login/users/login
router.get('/login', (req, res) => {
  const { username, loggedIn, userId } = req.session

  res.render('users/login', {username, loggedIn, userId})
})
// Post -> Login
router.post('/login', async(req, res) =>{
 // const { username, loggedIn, userId } = req.session

 // we can pull our credentials from the req.body
 const { username, password } = req.body

 // search the db for our user
 // since our usernames are unique, we can use that 
 User.findOne({ username })
    .then(async (user) => {
      // if the user exists
      if (user){
        // we compare the password they put in with the one we 
        // have stored can easily be done with bcrypt
        // will send either a truthy or falsey value
        const result = await bcrypt.compare(password, user.password)

        if (result){
          // if the pws match -> log them in and create the session
          req.session.username = username
          req.session.loggedIn = true
          req.session.userId = user.id

          // once we're loggen in, redirect to the home page
          res.redirect('/')
        } else{
          res.redirect (`/error?error=Usernamer%20Password%20is%20incorrect`)
        }
      } else{
        res.redirect (`/error?error=user%20does%20not%20exist%20please%20create%20account`)
      }
    })
    .catch(err => {
      console.log('error')
      res.redirect (`/error?error=${err}`)
   })
})

// GET -> logout
router.get('/logout', (req, res) => {
  const { username, loggedIn, userId } = req.session

  res.render('users/logout', {username, loggedIn, userId})
})
// DELETE -> logout
router.delete('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})



//////////////////////////////////
//  Export Router ///
//////////////////////////////////

module.exports = router
