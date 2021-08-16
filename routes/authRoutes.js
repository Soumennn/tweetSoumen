const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport =require('passport');
const flash = require('connect-flash');


// getting the signup form through this endpoint:
router.get('/register', (req,res) => {
    // res.render('auth/signup', {message: req.flash('error')});
    res.render('auth/signup');
});

//registering the user: 
router.post('/register', async (req,res) => {
//  console.log(req.body); // this will be undefined if not used enabled parser thorugh express ( by default it is undefined)
   
try {

    const user = new User ({
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
    });

    const newUser = await User.register(user,req.body.password);
    // res.status(200).send(newUser);
    req.flash("success","Registered Successfully,Please Login to continue");
    res.redirect('/login');
}  

catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
}


});


router.get('/login',(req,res)=> {
    res.render('auth/login');
})


// loggin the user in using passport : 
router.post('/login', passport.authenticate('local',
            {
                failureRedirect: '/login',
                failureFlash: true
            }), 
            async (req,res) => 
            {
                res.redirect('/');
            }
);


// logging the user out: 
router.get('/logout', (req,res) => {
    req.logout();
    req.flash("success","Logged out successfully!");
    res.redirect('/login');
})

 


module.exports = router;