var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'ejs');

var connection;
connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'mydb'
});

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
});

var student = [
	{
		oname: 'madhu',
		password: '123456'
	},
	{
		oname: 'kiran',
		password: '123456'
	}
];
var warden = [
	{
		dname: 'madhu',
		password: '123456'
	},
	{
		dname: 'kiran',
		password: '123456'
	}
];

var security = [
	{
		dname: 'madhu',
		password: '123456'
	},
	{
		dname: 'kiran',
		password: '123456'
	}
];

app.get('/ologin', function(req, res) {
	res.sendFile(__dirname + '/public/studentlogin.html');
});

app.get('/wlogin', function(req, res) {
	res.sendFile(__dirname + '/public/wardenlogin.html');
});
app.get('/slogin', function(req, res) {
	res.sendFile(__dirname + '/public/securitylogin.html');
});
app.post('/createStudent', function(req, res) {
	var a = req.body.username;
	var b = req.body.password;
	var c = req.body.Student;
	var d = req.body.permant_address;
	var e = req.body.local_address;
	var f = req.body.sem;
	var g = req.body.branch;
	var h = req.body.gender;
	var i = req.body.room_no;
	var j = req.body.block_name;

	console.log(a);
	console.log(student);
	var o = {
		regno: a,
		sname: c,
		sem: f,
		paddress: d,
		laddress: e,
		branch: g,
		gender: h,
		room_no: i,
		bname: j
	};
	var p = {
		oname: a,
		password: b
	};
	connection.query('insert into studentreg set ?', p, function(err, result) {
		console.log(result);
		console.log(result + 'success');
	});
	connection.query('insert into student set ?', o, function(err, result) {
		if (err) throw err;
		console.error(result);
		res.sendFile(__dirname + '/public/studentlogin.html');
	});
});
app.get('/ologincheck', function(req, res) {
	var cuser = req.query.username;
	var cpass = req.query.password;
	connection.query('select * from studentreg where oname =?', cuser, function(
		err,
		result
	) {
		if (cpass == result[0].password) {
			connection.query(
				'select * from studentreg,student where student.regno=studentreg.oname  and oname=?',
				cuser,
				function(err, rows, fields) {
					console.log(rows);
					if (rows.length != 0)
						res.render('studentpage', { username: rows });
					else {
					}
				}
			);
		} else res.sendFile(__dirname + '/public/error.html');
	});
});
app.get('/wlogincheck', function(req, res) {
	var cuser = req.query.Wardenno;
	var cpass = req.query.password;
	connection.query('select * from wardenreg where wno=?', cuser, function(
		err,
		result
	) {
		if (cpass == result[0].password) {
			connection.query(
				'select * from wardenreg,warden where warden.wno=wardenreg.wno  and warden.wno=?',
				cuser,
				function(err, rows, fields) {
					console.log(rows);
					if (rows.length != 0)
						res.render('wardenpage', { username: rows });
					else {
					}
				}
			);
		} else res.sendFile(__dirname + '/public/error.html');
	});
});
app.get('/slogincheck', function(req, res) {
	var cuser = req.query.securityno;
	var cpass = req.query.password;
	connection.query('select * from securityreg where sno= ? ', cuser, function(
		err,
		result
	) {
		if (cpass == result[0].password) {
			connection.query(
				'select * from securityreg,security where security.sno=securityreg.sno and security.sno=?',
				cuser,
				function(err, rows, fields) {
					console.log(rows);
					if (rows.length != 0)
						res.render('securitypage', { username: rows });
					else {
					}
				}
			);
		} else res.sendFile(__dirname + '/public/error.html');
	});
});

app.post('/createwarden', function(req, res) {
	var a = req.body.Wardenno;
	var b = req.body.password;
	var c = req.body.Wname;
	var h = req.body.desig;
	var d = req.body.gender;
	var i = req.body.floor_no;
	var j = req.body.block_name;

	console.log(a);
	console.log(warden);
	var o = {
		wno: a,
		wname: c,
		desig: h,
		gender: d,
		bname: j
	};
	var p = {
		wno: a,
		password: b
	};
	connection.query('insert into wardenreg set ?', p, function(err, result) {
		console.log(result);
		console.log(result + 'success');
	});
	connection.query('insert into warden set ?', o, function(err, result) {
		if (err) throw err;
		console.error(result);
		res.sendFile(__dirname + '/public/wardenlogin.html');
	});
});

app.post('/createsecurity', function(req, res) {
	var a = req.body.securitynono;
	var b = req.body.password;
	var c = req.body.name;
	var d = req.body.securitynono;
	var e = req.body.gender;

	console.log(a);
	console.log(security);
	var o = {
		sno: d,
		name: c,
		gender: e
	};
	var p = {
		sno: a,
		password: b
	};
	connection.query('insert into securityreg set ?', p, function(err, result) {
		console.log(result);
		console.log(result + 'success');
	});
	connection.query('insert into security set ?', o, function(err, result) {
		if (err) throw err;
		console.error(result);
		res.sendFile(__dirname + '/public/securitylogin.html');
	});
});

app.get('/approve', function(req, res) {
	var onum = req.query.ono;

	console.log(onum);
});

app.post('/seeoutpasses', function(req, res) {
	var username = req.body.wno;
	console.log(username);

	connection.query('select * from warden where wno=?', username, function(
		err,
		rows,
		fields
	) {
		connection.query(
			'select * from outpass,student,warden where student.regno=outpass.regno and wno=?',
			username,
			function(err, result, fields) {
				console.log(result);

				var hel = [{ warden: result }, { username: username }];
				console.log(hel[1].username);
				console.log(hel);
				if (result == undefined)
					res.sendFile(__dirname + '/public/nooutpass.html');
				else res.render('outpass', { data: result });
			}
		);
	});
});
app.post('/outpasses', function(req, res) {
	var a = req.body.outtime;
	var b = req.body.outdate;
	var c = req.body.intime;
	var d = req.body.indate;
	var e = req.body.reason;
	var g = req.body.reg;
	var f = {
		otime: a,
		intime: c,
		idate: d,
		reason: e,
		odate: b,
		regno: g
	};

	connection.query('insert into outpass set ?', f, function(err, result) {
		console.log(err);
		console.log(result + 'success');
		res.sendFile(__dirname + '/public/success.html');
	});
});

app.listen(3000);

console.log('Express server listening on port 8100 ');
