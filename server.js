const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

// ------------------------------------------------- //
// Express middleware:

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to log to server.log');
        }
    });
    next();
});

// Note lack of next() call in this middleware - means that client request will not be able to execute. If we had used next after the render, it still wouldn't be able to execute
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

// Static public directory - no need to route all your html files! Nice.
app.use(express.static(__dirname + '/public'));


// ------------------------------------------------- //
// Handlebars helper functions:

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// ------------------------------------------------- //
// Routes //

app.get('/', (request, response) => {
    response.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMsg: 'Welcome to my website!'
    });
    // response.send('<h1>Hello Express!</h1>'); //sending string
    // response.send({
    //     name: 'Sophia',
    //     likes: ['guitar', 'metal', 'julia']
    // });
    // // sending object which automatically gets parsed as json object
});

app.get('/about', (request, response) => {
    response.render('about.hbs', {
        pageTitle: 'About Page'
    });
    // response.render() renders your view templates and sets instance variables!
});

app.get('/bad', function(request, response) {
    response.send({
        errorMessage: 'Unable to handle request.'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
