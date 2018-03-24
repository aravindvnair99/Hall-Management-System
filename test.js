var express = require("express"),
    app = express(),
    path = __dirname + '/views/',
    bodyParser = require('body-parser'),
    router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.set('port', (process.env.PORT || 8000));
app.use(express.static(__dirname + '/public'));
app.set('views', path);
app.set('view engine', 'ejs');
app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
app.get('/', function (req, res) {
    res.render('index');
})
app.get('/login', function (req, res) {
    res.render('login');
})
app.get('/dashboard', function (req, res) {
    let profile = {
        name:"Rajesh",
        department:"CSE"
    };
    let requests = [
        {
            hall:"Rama hall",
            purpose:"ll",
            date:"23/10/2108",
            time:"3:30-4:30",
            name:"Rajesh",
            status:"pending",
            accept:"False",
            reject:"False",
            update:"True"
        },
        {
            hall:"Rama hall",
            purpose:"ll",
            date:"23/10/2108",
            time:"3:30-4:30",
            name:"Rajesh",
            status:"pending",
            accept:"False",
            reject:"False",
            update:"True"
        },
        {
            hall:"Rama hall",
            purpose:"ll",
            date:"23/10/2108",
            time:"3:30-4:30",
            name:"Rajesh",
            status:"pending",
            accept:"False",
            reject:"False",
            update:"True"
        }
    ];
    let calendar = [
        {
            hall: "xyz",
            slots: [false, false, true, false, false, false, false, false]
        },
        {
            hall: "abc",
            slots: [false, false, false, false, true, false, false, false]
        }
    ];
    res.render('dashboard', {profile: profile, requests: requests, calendar: calendar});
})
app.get('/request', function (req, res) {
    res.render('request');
})
app.get('/logout', function (req, res) {
    res.render('logout');
})
app.get('/onLogin', function (req, res) {
    console.log("Login");
    res.send('Need to add. Contact Aravind.');
})
app.get('/getUserProfile', function (req, res) {
    console.log("getUserProfile");
    res.send('Need to add. Contact Aravind.');
})
app.get('/getUserRequest', function (req, res) {
    console.log("getUserRequest");
    res.send('Need to add. Contact Aravind.');
})
app.get('/getCalendar', function (req, res) {
    console.log("getCalendar");
    res.send('Need to add. Contact Aravind.');
})
app.post('/updateRequest', function (req, res) {
    console.log("updateRequest");
    res.send('Need to add. Contact Aravind.');
})
app.post('/deleteRequest', function (req, res) {
    console.log("deleteRequest");
    res.send('Need to add. Contact Aravind.');
})
app.get('/submitRequest', function (req, res) {
    console.log("submitRequest");
    res.send('Need to add. Contact Aravind.');
})
app.get('*', function(req, res){
    console.log("404");
    res.status(404).send('Error 404 - Not Found Contact Aravind.');
});