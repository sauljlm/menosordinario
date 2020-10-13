const { Router } = require('express');
const router = Router();
const Note = require('../models/Note');

const { isAuthenticated } = require('../helpers/out');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const errors = [];
    if(!title) {
        errors.push({text: 'please insert a title'});
    }
    if(!description) {
        errors.push({text: 'please insert a description'});
    }
    if(errors.length > 0) {
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description});
        newNote.user = req.user.id;
        await newNote.save();
        res.redirect('/notes');
    }
});

router.get('/notes', async(req, res) => {
    // if (req.user) {
    //     const notes = await Note.find({user: req.user.id}).sort({date: 'desc'});
    //     res.render('notes/all-notes', { notes });
    // }
    const notes = await Note.find().sort({date: 'desc'});
    res.render('notes/all-notes', { notes });
    //res.render('notes/all-notes');
});

router.get('/notes/edit/:id', isAuthenticated, async(req, res) => {
    const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', { note });
});

router.put('/notes/edit-note/:id', isAuthenticated, async(req, res) => {
    const { title, description } = req.body;
    await Note.findByIdAndUpdate(req.params.id, { title, description});
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    const { id } = req.params;
    const image = await Note.findByIdAndDelete(id);
    res.redirect('/notes');
});

module.exports = router;