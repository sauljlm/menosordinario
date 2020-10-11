const mongoose =  require('mongoose');
const url = 'mongodb+srv://saul:sjlm2000@cluster0-wije2.mongodb.net/menosordinario?retryWrites=true&w=majority';

mongoose.connect(url, { 
    useNewUrlParser: true, useUnifiedTopology: true 
})
    .then(db => console.log(`DB is conected`))
    .catch(err => console.error(err)) 