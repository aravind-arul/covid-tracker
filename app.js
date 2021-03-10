if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const ejsMate = require('ejs-mate')
const path = require('path')
const app = express()
const axios = require('axios')
const GeoJSON = require('geojson');
const ExpressError = require('./utils/ExpressError');

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
//const homeRoute=require('./routes/home.js')

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))


function getDates() {
    var today = new Date(Date.now()).toISOString();
    var lastweek = new Date(Date.now() - 604800000).toISOString();
    return [today, lastweek];
}

app.get('/home', (req, res) => {
    res.render('home');
})
app.get('/maptrack', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://corona.lmao.ninja/v2/jhucsse'
    };

    axios.request(options).then(async function (resp) {
        const datas = await resp.data;
        const stats = GeoJSON.parse(datas, { Point: ['coordinates.latitude', 'coordinates.longitude'] });
        res.render('tracker', { stats })
    }).catch(function (error) {
        console.error(error);
    });
})

app.get('/casetrack', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://corona.lmao.ninja/v2/all?yesterday'
    };
    const countries = {
        method: 'GET',
        url: 'https://corona.lmao.ninja/v2/countries?yesterday&sort'
    };
    axios.all([
        axios.get('https://corona.lmao.ninja/v2/all?yesterday'),
        axios.get('https://corona.lmao.ninja/v2/countries?yesterday&sort=cases')
    ])
        .then(async function (resp) {
            const data = await resp[0].data;
            const alldata = await resp[1].data;
            console.log(alldata);
            res.render('statistics', { data, alldata })
        })
        .catch(function (error) {
            console.error(error);
        })
})

app.get('/news', (req, res) => {
    const [today, lastweek] = getDates();
    newsapi.v2.everything({
        qInTitle: 'coronavirus',
        from: lastweek,
        to: today,
        language: 'en',
        sortBy: 'popularity',
        pageSize: 20,
        page: req.query.p || 1
    }).then(async function (resp) {
        const news = await resp;
        const page = req.query.p || 1;
        console.log(news, page);
        res.render('news', { news, page })
    })
        .catch(function (error) {
            console.error(error);
        })
});

app.get('/vaccine', (req, res) => {
    const options = {
        headers: {
            "x-rapidapi-key": process.env.RAPID_API_KEY,
            "x-rapidapi-host": process.env.RAPID_API_HOST
        }
    };
    const options1 = {
        headers: {
            "x-rapidapi-key": process.env.RAPID_API_KEY,
            "x-rapidapi-host": process.env.RAPID_API_HOST
        }
    };
    const options2 = {
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': process.env.RAPID_API_HOST
        }
    };
    const options3 = {
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': process.env.RAPID_API_HOST
        }
    };
    const options4 = {
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': process.env.RAPID_API_HOST
        }
    };
    axios.all([
        axios.get('https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/vaccines/get-all-vaccines', options),
        axios.get("https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/vaccines/get-all-vaccines-phase-i", options1),
        axios.get("https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/vaccines/get-all-vaccines-phase-ii", options2),
        axios.get("https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/vaccines/get-all-vaccines-phase-iii", options3),
        axios.get("https://vaccovid-coronavirus-vaccine-and-treatment-tracker.p.rapidapi.com/api/vaccines/get-all-vaccines-phase-iv", options4),
    ])
        .then(async function (resp) {
            const data = await resp[0].data;
            const phase1 = await resp[1].data;
            const phase2 = await resp[2].data;
            const phase3 = await resp[3].data;
            const phase4 = await resp[4].data;
            res.render('vaccine', { data, phase1, phase2, phase3, phase4 });
        })
        .catch(function (error) {
            console.error(error);
        })

})
app.get('/', (req, res) => {
    res.render("home")
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on Port ${port}`)
})