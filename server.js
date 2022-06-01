const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
require('dotenv').config();

// Middleware 
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Adatbázis csatlakozás
mongoose.connect('mongodb+srv://pepe:pepe1973@cluster0.b5cr0.mongodb.net/valogatas?retryWrites=true&w=majority')
    .then(() => console.log('Sikeres csatlakozás!')).catch((err) => console.log(err));

// Könyv modell
const KonyvSchema = new mongoose.Schema({
    szerzo: {
        type: String,
        required: true,
    },
    cim: {
        type: String,
        required: true,
    },
    ar: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Konyv = mongoose.model('books', KonyvSchema);

app.get('/', async (req, res, next) => {
    try {
        const books = await Konyv.find();
        // console.log(books);
        res.render('index', { books });
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/valogat', (req, res, next) => {
    res.render('valogatott');
});

app.post('/valogat', async (req, res, next) => {
    try {
        const body = req.body;
        console.log(body.valogat);

        const books = await Konyv.find();

        const valogatott = books.filter(value => {
            return value.szerzo.includes(body.valogat);
        })
        console.log(valogatott);
        res.json({ valogatott });
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/arval', (req, res, next) => {
    res.render('arvalogat');
});

app.post('/arval', async (req, res, next) => {
    try {
        const body = req.body;
        console.log(typeof +body.valogat);

        const books = await Konyv.find();

        const valogatott = books.filter(value => {
            return value.ar > +body.valogat;
        })
        console.log(valogatott);
        res.json({ valogatott });
    } catch (error) {
        res.send(error.message);
    }
});

app.get('/kombi', (req, res, next) => {
    res.render('kombinalt');
});

app.post('/kombi', async (req, res, next) => {
    try {
        const body = req.body;
        console.log(body);

        const books = await Konyv.find();

        const valogatott = books.filter(value => {
            return (value.ar > +body.arvalogat && value.szerzo.includes(body.nevvalogat));
        })
        console.log(valogatott);
        res.json({ valogatott });
    } catch (error) {
        res.send(error.message);
    }
});

app.listen(3001, () => {
    console.log(`A szerver fut a köv porton http://localhost:3001`);
});