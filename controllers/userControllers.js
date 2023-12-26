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

// POST -> signup


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
