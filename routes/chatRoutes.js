const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const {isLoggedIn} = require('../middleware');
const Chat = require('../models/chats');

router.get('/allMessages', async (req, res) => {
    const allMessages = await Chat.find({});
    res.json(allMessages);
})

router.get('/messages', isLoggedIn, (req,res)=> {

    res.render('chat.ejs', {user: req.user});

})








module.exports = router;