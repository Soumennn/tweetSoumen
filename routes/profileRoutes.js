const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const {isLoggedIn} = require('../middleware');

router.get('/profile', isLoggedIn,(req, res) => {

    const payload = {
        user: req.user,
        displayName: req.user.firstName + ' ' + req.user.lastName
    }
    //console.log(payload);
    res.render('profile', {payload});
})


router.get('/profile/:username', isLoggedIn, async(req, res) => {

    const user = await User.findOne({username:req.params.username});

    const payload = {
        user: user,
        displayName: user.firstName + ' ' + user.lastName
    }

    // console.log(payload);
    res.render('profile', {payload});
})




router.patch('/follow/:userId/:profId', async (req,res)=>{

    

    const {userId,profId} = req.params;
  
    const currentUser = await User.findById(userId);
    const profUser = await User.findById(profId);
  
    const isFollowed = currentUser.following && currentUser.following.includes(profId);
  
    const option = isFollowed ? '$pull' : '$addToSet';
    //updating current user's following array
    const user = await User.findByIdAndUpdate(
        userId,
        {[option]: {following:profId}},
        {new:true},
    );

    const profile = await User.findByIdAndUpdate(
        profId,
        {[option]: {followers:userId}},
        {new:true},
    );
    
    res.json([user,profile]);
    res.redirect(`/profile/${profUser.username}`);

})
    

  












module.exports = router;