const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {name: 'index'});
});
/* GET home page. */
router.get('/about', function (req, res) {
    res.render('about', {name: 'about'});
});

module.exports = router;
