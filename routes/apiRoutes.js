const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleware');
const data = require('../apidata');


router.get('/news/api',  (req, res) => {

    res.send(data);
}) 





module.exports = router;