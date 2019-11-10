const express = require('express'),
	dotenv = require('dotenv'),
	app = express(),
	path = __dirname + '/views/',
	bodyParser = require('body-parser'),
	cookieSession = require('cookie-session'),
	mysql = require('mysql'),
	AES = require('mysql-aes');
dotenv.config();
app.use(
	cookieSession({
		name: 'session',
		keys: ['ahms'],
		// Cookie Options
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	})
);
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.set('port', process.env.port);
app.use(express.static(__dirname + '/public'));
app.set('views', path);
app.set('view engine', 'ejs');
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
const con = mysql.createConnection({
	host: `${process.env.host}`,
	user: `${process.env.user}`,
	password: `${process.env.password}`,
	database: `${process.env.database}`,
	multipleStatements: true
});
con.connect(function(error) {
	if (error) {
		console.log('Error Connecting Yo!');
		return;
	} else {
		console.log(' Connected Yo!');
	}
});

app.get('/', function(req, res) {
	res.render('index');
});
app.get('/login', function(req, res) {
	res.render('login');
});
app.get('/dashboard', function(req, res) {
	if (req.session.user) {
		con.query(
			"select * from users where id='" + req.session.user.id + "';",
			function(err, user_data) {
				if (!err) {
					if (user_data[0].role === 'teacher') {
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
					} else if (user_data[0].role === 'dean') {
						con.query('select * from booking;', function(
							err,
							booking_data
						) {
							con.query(
								"select * from events;",
								function(err, events_data) {
									res.render('dashboard_dean', {
										res: req.session.user,
										booking_data,
										events_data
									});
								}
							);
						});
					} else if (user_data[0].role === 'facility') {
						con.query(
							"select * from booking;",
							function(err, booking_data) {
								res.render('dashboard_facility', {
									res: req.session.user,
									booking_data
								});
							}
						);
					} else {
						res.redirect('/login');
					}
				} else {
					res.redirect('/login');
				}
			}
		);
	} else {
		res.redirect('/login');
	}
});
app.get('/request', function(req, res) {
	if (req.session.user) {
		res.render('request');
	} else {
		res.redirect('/login');
	}
});
app.get('/logout', function(req, res) {
	res.clearCookie('session', { path: '/' });
	res.redirect('/login');
});
app.post('/onLogin', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	con.query(
		"select * from users where username='" +
			username +
			"' and role='dean';",
		function(err, rows) {
			if (!err) {
				if (rows.length > 0) {
					if (
						password ===
						AES.decrypt(rows[0].password, `${process.env.aes_key}`)
					) {
						req.session.user = rows[0];
						res.redirect('/dashboard');
					} else {
						console.log('Password is Wrong Buddy!');
						res.render('error', {
							message: 'Password is Wrong Buddy!'
						});
					}
				} else {
					con.query(
						"select * from users where username='" +
							username +
							"' and role='teacher';",
						function(err, rows) {
							if (!err) {
								if (rows.length > 0) {
									if (
										password ===
										AES.decrypt(
											rows[0].password,
											`${process.env.aes_key}`
										)
									) {
										req.session.user = rows[0];
										res.redirect('/getUserProfile');
									} else {
										console.log('Password is Wrong Buddy!');
										res.render('error', {
											message: 'Password is Wrong Buddy!'
										});
									}
								} else {
									con.query(
										"select * from users where username='" +
											username +
											"' and role='facility';",
										function(err, rows) {
											if (!err) {
												if (rows.length > 0) {
													if (
														password ===
														AES.decrypt(
															rows[0].password,
															`${process.env.aes_key}`
														)
													) {
														req.session.user =
															rows[0];
														res.redirect(
															'/dashboard_tab'
														);
													} else {
														console.log(
															'Password is Wrong Buddy!'
														);
														res.render('error', {
															message:
																'Password is Wrong Buddy!'
														});
													}
												} else {
													console.log(
														'Username Not Found!'
													);
													res.render('error', {
														message:
															'Username Not Found!'
													});
												}
											}
										}
									);
								}
							}
						}
					);
				}
			}
		}
	);
});
app.get('/getUserProfile', function(req, res) {
	var id = req.session.user.id;
	con.query("select * from users where id='" + id + "';", function(
		err,
		rows
	) {
		if (!err) {
			if (rows[0].role === 'teacher') {
				res.redirect('/dashboard');
			} else if (rows[0].role === 'dean') {
				res.redirect('/dashboard_dean');
			} else if (rows[0].role === 'facility') {
				res.redirect('/dashboard_tab');
			} else {
				res.redirect('/login');
			}
		} else {
			res.render('error', {
				message: "Don't Poke Your Nose where you don't Belong!"
			});
		}
	});
});
app.post('/makeRequest', function(req, res) {
	var user_id = req.session.user.id;
	var date_wanted = req.body.date_wanted;
	var slot_id = '1';
	var hall_id = '1';
	var club = req.body.club_name;
	var details = req.body.desc;
	var title = req.body.event_name;
	var requirements = req.body.requirements;
	var status = '3';
	// var user_id = '2';
	// var date_wanted = '2019-11-10';
	// var slot_id = '1';
	// var hall_id = '1';
	// var club = 'FACE';
	// var details = "Here's a desc";
	// var title = "Title";
	// var requirements = "Req";
	// var status = 'pending';
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
						console.log(event_id[0].id);
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
																				if (
																					req
																						.session
																						.user
																						.role ==
																					'dean'
																				)
																					res.redirect(
																						'/dashboard_dean'
																					);
																				else
																					res.render(
																						'dashboard',
																						{
																							res:
																								req
																									.session
																									.user,
																							data
																						}
																					);
																			}
																		);
																	} else {
																		console.log(
																			err
																		);
																		res.render(
																			'error',
																			{
																				message:
																					'Inserting into hall_schedule failed.'
																			}
																		);
																	}
																}
															);
														} else {
															console.log(err);
															res.render(
																'error',
																{
																	message:
																		'Inserting into slot_schedule failed.'
																}
															);
														}
													}
												);
											} else {
												console.log(err);
												res.render('error', {
													message:
														'Retrieving booking_id failed'
												});
											}
										}
									);
								} else {
									console.log(err);
									res.render('error', {
										message:
											'Inserting into booking failed.'
									});
								}
							}
						);
					} else {
						console.log(err);
						res.render('error', {
							message: 'Retrieving event_id failed'
						});
					}
				}
			);
		} else {
			console.log(err);
			res.render('error', { message: 'Inserting into event failed.' });
		}
	});
});
app.post('/updateRequest', function(req, res) {
	console.log('updateRequest');
	res.send('Need to add. Contact Aravind.');
});
app.post('/deleteRequest', function(req, res) {
	console.log('deleteRequest');
	res.send('Need to add. Contact Aravind.');
});
app.post('/approve', function(req, res) {
	var temp = localStorage.getItem('Approve');
	var query = "update booking set status='1' where id ='" + temp + "';";
	console.log('Approved is' + temp);
	con.query(query, function(err, result) {
		console.log('app');
		res.redirect('/dashboard_dean');
	});
});
app.post('/reject', function(req, res) {
	var temp = localStorage.getItem('Reject');
	var query = "update booking set status='2' where id ='" + temp + "';";
	console.log('Rejected is' + temp);
	con.query(query, function(err, result) {
		console.log('rej');
		res.redirect('/dashboard_dean');
	});
});
app.get('*', function(req, res) {
	console.log('404');
	res.status(404).send('Error 404 - Not Found Contact Aravind.');
});
