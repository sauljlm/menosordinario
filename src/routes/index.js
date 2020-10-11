const { Router } = require('express');
const router = Router();
const fs = require('fs-extra');

const Image = require('../models/Image');
const claudinary = require('cloudinary');
claudinary.config({
    cloud_name: 'dvdgijhpc',
    api_key: '992268627513137',
    api_secret: 'W3NBvBWIP2Qe00JQYltXAzMLoSc'
});

router.get('/', async (req, res) => {
    // const images = await Image.find();
    // console.log(images);
    res.render('images');
});

router.get('/images/add', (req, res) => {
    res.render('image_form'); 
});

router.post('/images/add', async (req, res) => {
    const { title, description } = req.body;
    const result = await claudinary.v2.uploader.upload(req.file.path);
    console.log(result);
    const newPhoto = new Image({
        title: title,
        description: description,
        imageURL: result.url,
        public_id: result.public_id
    });
    await newPhoto.save();
    await fs.unlink(req.file.path); // delete local file
    res.send('Recibed');
});

router.get('/image/:id', (req, res) => {
    res.send('Profile image');
});

router.get('/image/:id/delete', (req, res) => {
    res.send('Image deleted');
});

module.exports = router;