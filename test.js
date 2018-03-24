var express = require("express"),
    app = express(),
    path = __dirname + '/views/',
    bodyParser = require('body-parser'),
    router = express.Router(),
    cookieSession = require('cookie-session'),
    mysql = require('mysql');
app.use(cookieSession({
    name: 'session',
    keys: ['ahms'],
    
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }))
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
var con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'ahms',
    multipleStatements: true
});
con.connect(function (error) {
    if (error) {
        console.log("Error Connecting Yo!");
        return;
    } else {
        console.log(" Connected Yo!");
    }
});

app.get('/', function (req, res) {
    res.render('index');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.get('/dashboard', function (req, res) {
    if(req.session.user){
        res.render("dashboard", {res: req.session.user.name});
    } else{
        res.redirect('/login');
    }
});
app.get('/request', function (req, res) {
    res.render('request');
});
app.get('/logout', function (req, res) {
    res.render('logout');
});
app.post('/onLogin', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    con.query("select * from users where username='" + username + "' and role='1';", function (err, rows) {
        if (!err) {
            if (rows.length > 0) {
                if (password === rows[0].password) {
                    req.session.user=rows[0];
                    res.redirect("/getUserProfile");
                } else {
                    console.log("Password is Wrong Buddy!");
                    res.render("error", { message: "Password is Wrong Buddy!"});
                }
            } else {
                con.query("select * from users where username='" + username + "' and role='2';", function (err, rows) {
                    if (!err) {
                        if (rows.length > 0) {
                            if (password === rows[0].password) {
                                req.session.user=rows[0];
                                res.redirect("/getUserProfile");
                            } else {
                                console.log("Password is Wrong Buddy!");
                                res.render("error", { message: "Password is Wrong Buddy!"});
                            }
                        } else {
                            con.query("select * from users where username='" + username + "' and role='3';", function (err, rows) {
                                if (!err) {
                                    if (rows.length > 0) {
                                        if (password === rows[0].password) {
                                            req.session.user=rows[0];
                                            res.redirect("/getUserProfile");
                                        } else {
                                            console.log("Password is Wrong Buddy!");
                                            res.render("error", { message: "Password is Wrong Buddy!"});
                                        }
                                    } else {
                                        console.log("Username Not Found!");
                                        res.render("error", { message: "Username Not Found!"});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});
app.get('/getUserProfile', function (req, res) {
    var id = req.session.user.id;
    con.query("select * from users where id='"+ id + "';", function (err, rows) {
        if (!err) {
            if (rows.length > 0) {
                res.redirect('/getUserRequest');
            }
        } else {
        res.render("error", { message: "Dont Poke Your Nose where you don't Belong!"});
        }
    })
});
app.get('/getUserRequest', function (req, res) {
    res.redirect('/dashboard');
});
app.get('/getCalendar', function (req, res) {
    console.log("getCalendar");
    res.send('Need to add. Contact Aravind.');
});
app.post('/makeRequest', function (req, res) {
    let reqobj = [
        date_wanted = req.body.date_wanted,
        date_
    ]
});
app.post('/updateRequest', function (req, res) {
    console.log("updateRequest");
    res.send('Need to add. Contact Aravind.');
});
app.post('/deleteRequest', function (req, res) {
    console.log("deleteRequest");
    res.send('Need to add. Contact Aravind.');
});
app.get('/submitRequest', function (req, res) {
    console.log("submitRequest");
    res.send('Need to add. Contact Aravind.');
});
app.get('*', function(req, res) {
    console.log("404");
    res.status(404).send('Error 404 - Not Found Contact Aravind.');
});