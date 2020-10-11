const { Router } = require('express');
const router = Router();

const Image = require('../models/Image');

router.get('/', async (req, res) => {
    const images = await Image.find();
    console.log(images);
    res.render('index', { images: images }); //render the views/index
});

router.get('/upload', (req, res) => {
    res.render('upload'); //render the views/upload
});

router.post('/upload', async (req, res) => {
    const image = new Image(); //schema
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/img/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;

    await image.save();

    res.redirect('/');
});

router.get('/image/:id', (req, res) => {
    res.send('Profile image');
});

router.get('/image/:id/delete', (req, res) => {
    res.send('Image deleted');
});

module.exports = router;