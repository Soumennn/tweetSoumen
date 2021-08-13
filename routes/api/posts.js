const express = require('express');
const router = express.Router();
const Post = require('../../models/post');
const User = require('../../models/user');
const {isLoggedIn} = require('../../middleware');


// to get all the posts (tweets) ever created
router.get('/api/post', isLoggedIn,async (req, res) => {

    const filter = req.query;
    // console.log(filter);
    const results = await Post.find(filter)
    .populate('postedBy')
    .populate('replyTo');
    
    posts = await User.populate(results, { path: 'replyTo.postedBy'});

    res.json(posts);
});


router.get('/api/posts/:id', async (req, res) => {

    const tweetData = await Post.findById(req.params.id).populate('postedBy');
    res.json(tweetData);
})


// to create/ add a new post (tweets)
router.post('/api/post',isLoggedIn, async (req, res) => {

    // console.log(req.body);

    let post = {
        content: req.body.content,
        postedBy: req.user
    }

    if(req.body.replyTo) 
    {
        post = {
            ...post,
            replyTo: req.body.replyTo
        }
    }
        

    const newPost = await Post.create(post);
    res.json(newPost);

})

// likes response event from server

router.patch('/api/posts/:id/like',isLoggedIn, async (req, res) => {
   // res.send("hihihi")

   const postId = req.params.id;
   const userId = req.user._id;

   const isLiked = req.user.likes && req.user.likes.includes(postId);
   const option = isLiked ? '$pull' : '$addToSet'
   req.user = await User.findByIdAndUpdate(
       userId,
       {[option]:{likes:postId}},
       {new:true});

   const tweet = await Post.findByIdAndUpdate(
       postId,
       {[option]: {likes:userId}},
       {new:true});

   res.json([tweet, userId]);
})




module.exports = router;