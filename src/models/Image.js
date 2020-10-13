const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
    title: String,
    description: String,
    imageURL: String,
    public_id: String
});

module.exports = model('Image', imageSchema);