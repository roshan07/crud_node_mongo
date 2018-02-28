const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const hbs = require('express-handlebars');


const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

//mongo connection
var url = 'mongodb://localhost:27017';
var db;
MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err);
    db = client.db('mynode');
    app.listen(4000, () => {
        console.log('listening on 4000');
    });
});

//Routes

app.get('/', (req, res) => {
    res.render('index', { title: 'node rocks' });
});

app.get('/getdata', (req, res) => {
    db.collection('persons').find().toArray((err, result) => {
        if (err) return console.log(err);
        res.render('index', { persons: result });
    });
});

app.post('/insert', (req, res) => {
    var person = {
        fname: req.body.fname,
        lname: req.body.lname,
        age: req.body.age
    };

    db.collection('persons').insertOne(person, (err, result) => {
        console.log('saved to the database');
        res.redirect('/');
    });
});

app.post('/update', (req, res) => {
    var person = {
        fname: req.body.fname,
        lname: req.body.lname,
        age: req.body.age
    };
    var id = req.body.id;

    db.collection('persons').updateOne({ "_id": objectId(id) }, { $set: person }, (err, result) => {
        console.log('database item updated');
        res.redirect('/getdata');
    });
});

app.post('/delete', (req, res) => {

    var id = req.body.id;

    db.collection('persons').deleteOne({ "_id": objectId(id) }, (err, result) => {
        console.log('database item deleted');
        res.redirect('/getdata');
    });
});


module.exports = router;