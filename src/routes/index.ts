import express from "express";

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', {name: 'index'});
});
/* GET home page. */
router.get('/about', (req, res) => {
    res.render('about', {name: 'about'});
});

module.exports = router;
