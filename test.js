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
    }));
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
    if(req.session.user) {
        con.query("select * from booking where user_id='" + req.session.user.id + "';", function (err, data) {
            console.log(data);
            res.render("dashboard", {res: req.session.user, data});
        });
    } else{
        res.redirect('/login');
    }
});
app.get('/dashboard_tab', function (req, res) {
    if(req.session.user) {
        con.query("select * from booking where user_id='" + req.session.user.id + "';", function (err, data) {
            console.log(data);
            res.render("dashboard_tab", {res: req.session.user, data});
        });
    } else{
        res.redirect('/login');
    }
});
app.get('/dashboard_dean', function (req, res) {
    if(req.session.user) {
        con.query("select * from booking;", function (err, data) {
            res.render("dashboard_dean", {res: req.session.user, data});
        });
    } else{
        res.redirect('/login');
    }
});
app.get('/request', function (req, res) {
    if(req.session.user){
        res.render('request');
    } else{
        res.redirect('/login');
    }
});
app.get('/logout', function (req, res) {
    res.clearCookie('session', {path: '/'});
    res.redirect('/login');
});
app.post('/onLogin', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    con.query("select * from users where username='" + username + "' and role='1';", function (err, rows) {
        if (!err) {
            if (rows.length > 0) {
                if (password === rows[0].password) {
                    req.session.user=rows[0];
                        res.redirect("/dashboard_dean");
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
                                            res.redirect("/dashboard_tab");
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
app.post('/makeRequest', function (req, res) {
    var user_id = req.session.user.id;
    var date_wanted = req.body.date_wanted;
    var slot = "1";
    var hall = "1";
    var club = req.body.club_name;
    var details = req.body.desc;
    var title = req.body.event_name;
    var requir = req.body.requir;
    var status = "0";
    var obj = {
        user_id: user_id,
        date_wanted: date_wanted,
        slot: slot,
        hall: hall,
        title: title,
        club: club,
        req: requir,
        details: details,
        status: status
    };
    con.query('insert into booking set ?', obj, function (err, result) {
        if (!err) {
            console.log("success");
            con.query("select * from booking where user_id='" + req.session.user.id + "';", function (err, data) {
                console.log(data);
                res.render("dashboard", {res: req.session.user, data});
            });
        } else {
            console.log(err);
            res.render("error", { message: "Not working." });
        }
    });
});
app.post('/updateRequest', function (req, res) {
    console.log("updateRequest");
    res.send('Need to add. Contact Aravind.');
});
app.post('/deleteRequest', function (req, res) {
    console.log("deleteRequest");
    res.send('Need to add. Contact Aravind.');
});
app.post('/approve', function (req, res) {
    var temp = localStorage.getItem("Approve");
    var query = "update booking set status='1' where id ='" + temp + "';";
    console.log("Approved is" + temp);
    con.query(query, function (err, result) {
        console.log("app")
        res.redirect("/dashboard_dean");
    });
});
app.post('/reject', function (req, res) {
    var temp = localStorage.getItem("Reject");
    var query = "update booking set status='2' where id ='" + temp + "';";
    console.log("Rejected is" + temp);
    con.query(query, function (err, result) {
        console.log("rej")
        res.redirect("/dashboard_dean");
    });
});
app.get('*', function(req, res) {
    console.log("404");
    res.status(404).send('Error 404 - Not Found Contact Aravind.');
});