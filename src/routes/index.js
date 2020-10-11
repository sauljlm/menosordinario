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
    const images = await Image.find(); // get from mongodb
    console.log(images);
    res.render('images', {images});
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.json(images);
});

router.get('/images/add',  async (req, res) => {
    const images = await Image.find();
    
    res.render('image_form', {images}); // render handlebards html
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
    res.redirect('/');
});

router.get('/images/delete/:id', async (req, res) => {
    const { img_id } = req.params;
    const image = await Image.findByIdAndDelete(img_id);
    const result = await claudinary.v2.uploader.destroy(image.public_id);
    console.log(result);
    res.redirect('/images/add');
});

module.exports = router;