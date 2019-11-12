const express = require('express'),
	dotenv = require('dotenv'),
	app = express(),
	path = __dirname + '/views/',
	bodyParser = require('body-parser'),
	cookieSession = require('cookie-session'),
	mysql = require('mysql'),
	AES = require('mysql-aes'),
	morgan = require('morgan');
dotenv.config();
app.use(morgan('dev'));
app.use(
	cookieSession({
		name: 'session',
		secret: `${process.env.cookie_secret}`,
		signed: true,
		maxAge: 1 * 60 * 60 * 1000 // 1 hour
	})
);
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.set('port', process.env.node_port);
app.use(express.static(__dirname + '/public'));
app.set('views', path);
app.set('view engine', 'ejs');
app.listen(app.get('port'), function() {
	console.log('App is running on port', app.get('port'));
});
const con = mysql.createConnection({
	host: `${process.env.DB_host}`,
	user: `${process.env.DB_user}`,
	password: `${process.env.DB_password}`,
	database: `${process.env.DB_name}`,
	multipleStatements: true
});
con.connect(function(error) {
	if (error) {
		console.log('Database connection failed');
		return;
	} else {
		console.log('Database connection succeeded');
	}
});
function parseCookies(req) {
	var list = {},
		rc = req.headers.cookie;

	rc &&
		rc.split(';').forEach(cookie => {
			var parts = cookie.split('=');
			list[parts.shift().trim()] = decodeURI(parts.join('='));
		});

	return list;
}
app.get('/', (req, res) => {
	if (req.session.user) {
		res.redirect('/dashboard');
	} else res.render('index');
});
app.get('/login', (req, res) => {
	if (req.session.user) {
		res.redirect('/dashboard');
	} else res.render('login');
});
app.get('/dashboard', (req, res) => {
	if (req.session.user) {
		if (req.session.user.role === 'teacher') {
			con.query(
				"select * from booking where user_id='" +
					req.session.user.id +
					"';",
				function(err, booking_data) {
					con.query(
						"select * from events where user_id='" +
							req.session.user.id +
							"';",
						function(err, events_data) {
							res.render('dashboard_teacher', {
								res: req.session.user,
								booking_data,
								events_data
							});
						}
					);
				}
			);
		} else if (req.session.user.role === 'dean') {
			con.query('select * from booking;', function(err, booking_data) {
				con.query('select * from events;', function(err, events_data) {
					res.render('dashboard_dean', {
						res: req.session.user,
						booking_data,
						events_data
					});
				});
			});
		} else if (req.session.user.role === 'facility') {
			con.query('select * from booking;', function(err, booking_data) {
				con.query('select * from events;', function(err, events_data) {
					res.render('dashboard_facility', {
						res: req.session.user,
						booking_data,
						events_data
					});
				});
			});
		} else {
			res.redirect('/login');
		}
	} else {
		res.redirect('/login');
	}
});
app.get('/request', (req, res) => {
	if (req.session.user) {
		res.render('request');
	} else {
		res.redirect('/login');
	}
});
app.get('/logout', (req, res) => {
	res.clearCookie('session', { path: '/' });
	res.redirect('/login');
});
app.post('/onLogin', (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	con.query(
		"select * from users where username='" + username + "';",
		function(err, rows) {
			if (!err) {
				if (rows.length > 0) {
					if (
						password ===
						AES.decrypt(rows[0].password, `${process.env.AES_key}`)
					) {
						req.session.user = rows[0];
						res.redirect('/dashboard');
					} else {
						console.log('Invalid password');
						res.status(401).render('error', {
							error_message: 'Authentication error!'
						});
					}
				} else {
					console.log('Username not found!');
					res.status(401).render('error', {
						error_message: 'Authentication error!'
					});
				}
			} else {
				console.log('Username not found!');
				res.status(401).render('error', {
					error_message: 'Authentication error!'
				});
			}
		}
	);
});
<<<<<<< HEAD
<<<<<<< HEAD
app.post('/checkHallAvailability', (req, res) => {
	var query = `select hall_id from hall_schedule where booking_id in (select booking_id from slot_schedule where booking_id in (select id from booking where event_id in (select id from events WHERE date_wanted='${req.body.date_wanted}')) and slot_id='10')`;
<<<<<<< HEAD
=======
app.post('/checkHallAvailability', function(req, res) {
=======
app.post('/checkHallAvailability', (req, res) => {
>>>>>>> Switch to arrow functions
	var query =
		"select hall_id from hall_schedule where booking_id in (select booking_id from slot_schedule where booking_id in (select id from booking where event_id in (select id from events WHERE date_wanted='" +
		req.body.date_wanted +
		"')) and slot_id='10')";
>>>>>>> Fix HTTP status codes and error messages
=======
>>>>>>> Add slot API
	con.query(query, function(err, result) {
		res.send(result);
	});
});
<<<<<<< HEAD
<<<<<<< HEAD
app.post('/checkSlotAvailability', (req, res) => {
	var query = `SELECT hall_id FROM hall_schedule WHERE booking_id in (select booking_id from slot_schedule where booking_id in (select id from booking where event_id in (select id from events WHERE date_wanted='${req.body.date_wanted}')) and slot_id='${req.body.slot_id}')`;
=======
app.post('/checkSlotAvailability', function(req, res) {
=======
app.post('/checkSlotAvailability', (req, res) => {
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> Switch to arrow functions
	var slot_id = req.body.slot_id;
=======
>>>>>>> Add slot checking
	var query =
		"select slot_id from slot_schedule where booking_id in (select booking_id from slot_schedule where booking_id in (select id from booking where event_id in (select id from events WHERE date_wanted='" +
		req.body.date_wanted +
<<<<<<< HEAD
		"')) and slot_id='10')";
>>>>>>> Fix HTTP status codes and error messages
=======
		"')) and slot_id='" + req.body.slot_id + "')";
>>>>>>> Add slot checking
=======
	var query = `SELECT hall_id FROM hall_schedule WHERE booking_id in (select booking_id from slot_schedule where booking_id in (select id from booking where event_id in (select id from events WHERE date_wanted='${req.body.date_wanted}')) and slot_id='${req.body.slot_id}')`;
>>>>>>> Add slot API
	con.query(query, function(err, result) {
		res.send(result);
	});
});
app.post('/makeRequest', (req, res) => {
	var user_id = req.session.user.id;
	var date_wanted = req.body.date_wanted;
	var slot_id = parseCookies(req).slot_id;
	var hall_id = parseCookies(req).hall_id;
	var club = req.body.club_name;
	var details = req.body.desc;
	var title = req.body.event_name;
	var requirements = req.body.requirements;
	var status = '3';
	var event_obj = {
		title: title,
		club: club,
		requirements: requirements,
		details: details,
		date_wanted: date_wanted,
		user_id: user_id
	};
	con.query('insert into events set ?', event_obj, function(err, result) {
		if (!err) {
			console.log('success');
			con.query(
				"select id from events WHERE user_id='" +
					req.session.user.id +
					"' ORDER BY id DESC LIMIT 1;",
				function(err, event_id) {
					if (!err) {
						var booking_obj = {
							user_id: user_id,
							status_id: status,
							event_id: event_id[0].id
						};
						con.query(
							'insert into booking set ?',
							booking_obj,
							function(err, result) {
								if (!err) {
									console.log('success');
									con.query(
										"select id from booking WHERE user_id='" +
											req.session.user.id +
											"' ORDER BY id DESC LIMIT 1;",
										function(err, booking_id) {
											if (!err) {
												var slot_schedule_obj = {
													slot_id: slot_id,
													booking_id: booking_id[0].id
												};
												var hall_schedule_obj = {
													hall_id: hall_id,
													booking_id: booking_id[0].id
												};
												con.query(
													'insert into slot_schedule set ?',
													slot_schedule_obj,
													function(err, result) {
														if (!err) {
															console.log(
																'Inserted into slot_schedule.'
															);
															con.query(
																'insert into hall_schedule set ?',
																hall_schedule_obj,
																function(
																	err,
																	result
																) {
																	if (!err) {
																		console.log(
																			'Inserted into hall_schedule'
																		);
																		con.query(
																			"select * from booking where user_id='" +
																				req
																					.session
																					.user
																					.id +
																				"';",
																			function(
																				err,
																				data
																			) {
																				res.redirect(
																					'/dashboard'
																				);
																			}
																		);
																	} else {
																		console.log(
																			err
																		);
																		res.status(
																			500
																		).render(
																			'error',
																			{
																				error_message:
																					'Inserting into hall_schedule failed!'
																			}
																		);
																	}
																}
															);
														} else {
															console.log(err);
															res.status(
																500
															).render('error', {
																error_message:
																	'Inserting into slot_schedule failed!'
															});
														}
													}
												);
											} else {
												console.log(err);
												res.status(500).render(
													'error',
													{
														error_message:
															'Retrieving booking_id failed!'
													}
												);
											}
										}
									);
								} else {
									console.log(err);
									res.status(500).render('error', {
										error_message:
											'Inserting into booking failed!'
									});
								}
							}
						);
					} else {
						console.log(err);
						res.status(500).render('error', {
							error_message: 'Retrieving event_id failed!'
						});
					}
				}
			);
		} else {
			console.log(err);
			res.status(500).render('error', {
				error_message: 'Inserting into event failed!'
			});
		}
	});
});
app.post('/updateRequest', (req, res) => {
	console.log('updateRequest');
	res.status(500).send('Need to add. Contact Aravind.');
});
app.post('/deleteRequest', (req, res) => {
	console.log('deleteRequest');
	res.status(500).send('Need to add. Contact Aravind.');
});
app.post('/approve', (req, res) => {
	var temp = localStorage.getItem('Approve');
	var query = "update booking set status='1' where id ='" + temp + "';";
	console.log('Approved is' + temp);
	con.query(query, function(err, result) {
		console.log('app');
		res.redirect('/dashboard');
	});
});
app.post('/reject', (req, res) => {
	var temp = localStorage.getItem('Reject');
	var query = "update booking set status='2' where id ='" + temp + "';";
	console.log('Rejected is' + temp);
	con.query(query, function(err, result) {
		console.log('rej');
		res.redirect('/dashboard');
	});
});
app.use((req, res, next) => {
	res.status(404).render('error', {
		error_message: '404!'
	});
});
