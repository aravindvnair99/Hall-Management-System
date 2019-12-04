const express = require("express"),
	dotenv = require("dotenv"),
	app = express(),
	path = __dirname + "/views/",
	bodyParser = require("body-parser"),
	cookieSession = require("cookie-session"),
	mysql = require("mysql"),
	AES = require("mysql-aes"),
	morgan = require("morgan"),
	RateLimit = require("express-rate-limit");
dotenv.config();
app.use(
	new RateLimit({
		windowMs: 1 * 60 * 1000, // 1 minute
		max: 15
	})
);
app.use(morgan("dev"));
app.use(
	cookieSession({
		name: "session",
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
app.set("port", process.env.node_port);
app.use(express.static(__dirname + "/public"));
app.set("views", path);
app.set("view engine", "ejs");
app.listen(app.get("port"), () => {
	console.log("App is running on port", app.get("port"));
});
const con = mysql.createPool({
	host: `${process.env.DB_host}`,
	user: `${process.env.DB_user}`,
	password: `${process.env.DB_password}`,
	database: `${process.env.DB_name}`,
	multipleStatements: true
});
// function parseCookies(req) {
// 	var list = {},
// 		rc = req.headers.cookie;

// 	rc &&
// 		rc.split(";").forEach(cookie => {
// 			var parts = cookie.split("=");
// 			list[parts.shift().trim()] = decodeURI(parts.join("="));
// 		});

// 	return list;
// }
// var hall_id = parseCookies(req).hall_id;
app.get("/", (req, res) => {
	if (req.session.user) {
		res.redirect("/dashboard");
	} else res.render("index");
});
app.get("/login", (req, res) => {
	if (req.session.user) {
		res.redirect("/dashboard");
	} else res.render("login");
});
app.get("/dashboard", (req, res) => {
	if (req.session.user) {
		if (req.session.user.role === "teacher") {
			con.query(
				"select * from booking where user_id= ?",
				req.session.user.id,
				(err, booking_data) => {
					con.query(
						"select * from events where user_id= ?",
						req.session.user.id,
						(err, events_data) => {
							res.render("dashboard_teacher", {
								res: req.session.user,
								booking_data,
								events_data
							});
						}
					);
				}
			);
		} else if (req.session.user.role === "dean") {
			con.query("select * from booking;", (err, booking_data) => {
				con.query("select * from events;", (err, events_data) => {
					res.render("dashboard_dean", {
						res: req.session.user,
						booking_data,
						events_data
					});
				});
			});
		} else if (req.session.user.role === "facility") {
			res.render("dashboard_facility");
		} else {
			res.redirect("/login");
		}
	} else {
		res.redirect("/login");
	}
});
app.get("/dashboard_facility_card", (req, res) => {
	if (req.session.user) {
		con.query("select * from booking;", (err, booking_data) => {
			con.query("select * from events;", (err, events_data) => {
				res.render("dashboard_facility_card", {
					res: req.session.user,
					booking_data,
					events_data
				});
			});
		});
	} else {
		res.redirect("/login");
	}
});
app.get("/dashboard_facility_table", (req, res) => {
	if (req.session.user) {
		con.query("select * from booking;", (err, booking_data) => {
			con.query("select * from events;", (err, events_data) => {
				res.render("dashboard_facility_table", {
					res: req.session.user,
					booking_data,
					events_data
				});
			});
		});
	} else {
		res.redirect("/login");
	}
});
app.get("/request", (req, res) => {
	if (req.session.user) {
		res.render("request");
	} else {
		res.redirect("/login");
	}
});
app.get("/requestUpdate", (req, res) => {
	if (req.session.user) {
		con.query("select * from booking where id=4;", (err, booking_data) => {
			con.query(
				"select * from events where id=30;",
				(err, events_data) => {
					res.render("requestUpdate", {
						res: req.session.user,
						booking_data,
						events_data
					});
				}
			);
		});
	} else {
		res.redirect("/login");
	}
});
app.get("/logout", (req, res) => {
	res.clearCookie("session", {
		path: "/"
	});
	res.redirect("/login");
});
app.post("/onLogin", (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	con.query(
		"select * from users where username='" + username + "';",
		(err, rows) => {
			if (!err) {
				if (rows.length > 0) {
					if (
						password ===
						AES.decrypt(rows[0].password, `${process.env.AES_key}`)
					) {
						req.session.user = rows[0];
						res.redirect("/dashboard");
					} else {
						console.log("Invalid password");
						res.status(401).render("error", {
							error_message: "Authentication error!"
						});
					}
				} else {
					console.log("Username not found!");
					res.status(401).render("error", {
						error_message: "Authentication error!"
					});
				}
			} else {
				console.log("Username not found!");
				res.status(401).render("error", {
					error_message: "Authentication error!"
				});
			}
		}
	);
});
app.post("/checkAvailability", (req, res) => {
	if (req.session.user) {
		con.query(
			"SELECT slot_hall FROM booking WHERE event_id IN (SELECT id FROM events WHERE date_wanted = ?)",
			req.body.date_wanted,
			(err, result) => {
				if (!err) {
					res.send(result);
				} else {
					console.log(err);
					res.status(500).render("error", {
						error_message: "Availability checking failed!"
					});
				}
			}
		);
	} else {
		res.redirect("/login");
	}
});
app.post("/makeRequest", (req, res) => {
	if (req.session.user) {
		var user_id = req.session.user.id;
		var date_wanted = req.body.date_wanted;
		var slot_hall = "";
		for (var i = 1; i <= 7; i++)
			for (var j = 1; j <= 9; j++) {
				if (req.body[`cell${j}${i}`]) {
					slot_hall += j.toString() + i.toString();
				}
			}
		var club = req.body.club_name;
		var details = req.body.desc;
		var title = req.body.event_name;
		var requirements = req.body.requirements;
		var event_obj = {
			title: title,
			club: club,
			requirements: requirements,
			details: details,
			date_wanted: date_wanted,
			user_id: user_id
		};
		con.query("insert into events set ?", event_obj, err => {
			if (!err) {
				console.log(`Inserted ${event_obj.title} into events.`);
				con.query(
					"select id from events WHERE user_id= ? ORDER BY id DESC LIMIT 1",
					req.session.user.id,
					(err, event_id) => {
						if (!err) {
							var booking_obj = {
								user_id: user_id,
								event_id: event_id[0].id,
								slot_hall: slot_hall
							};
							con.query(
								"insert into booking set ?",
								booking_obj,
								err => {
									if (!err) {
										console.log(
											`Inserted event with id ${booking_obj.event_id} into booking.`
										);
										res.redirect("/dashboard");
									} else {
										console.log(err);
										res.status(500).render("error", {
											error_message:
												"Inserting into booking failed!"
										});
									}
								}
							);
						} else {
							console.log(err);
							res.status(500).render("error", {
								error_message: "Retrieving event_id failed!"
							});
						}
					}
				);
			} else {
				console.log(err);
				res.status(500).render("error", {
					error_message: "Inserting into event failed!"
				});
			}
		});
	} else {
		res.redirect("/login");
	}
});
app.post("/updateBooking", (req, res) => {
	if (req.session.user) {
		console.log("updateRequest");
		res.status(500).send("Need to add. Contact Aravind.");
	} else {
		res.redirect("/login");
	}
});
app.post("/deleteBooking", (req, res) => {
	if (req.session.user) {
		con.query(
			"select event_id from booking where id = ?",
			req.body.booking_id,
			(err, result) => {
				if (result) {
					con.query(
						"delete from events where id = ?",
						result[0].event_id,
						err => {
							if (!err) {
								con.query(
									"delete from booking where id =?",
									req.body.booking_id,
									(err, result) => {
										if (!err) {
											console.log(
												`${req.body.booking_id} is deleted`
											);
											res.send(JSON.stringify(result));
										} else
											res.send(JSON.stringify(err.code));
									}
								);
							} else res.send(JSON.stringify(err.code));
						}
					);
				} else res.send(JSON.stringify(err.code));
			}
		);
	} else {
		res.redirect("/login");
	}
});
app.post("/updateStatus", (req, res) => {
	console.log(req.body.type);
	if (req.session.user) {
		if (req.body.type === "approve") {
			con.query(
				'update booking set status="Approved" where id = ?',
				req.body.booking_id,
				(err, result) => {
					if (!err) {
						console.log(`${req.body.booking_id} is approved`);
						res.send(JSON.stringify(result));
					} else res.send(JSON.stringify(err.code));
				}
			);
		} else if (req.body.type === "reject") {
			con.query(
				'update booking set status="Rejected" where id = ?',
				req.body.booking_id,
				(err, result) => {
					if (!err) {
						console.log(`${req.body.booking_id} is rejected`);
						res.send(JSON.stringify(result));
					} else res.send(JSON.stringify(err.code));
				}
			);
		} else {
			console.log(`${req.body.booking_id} status update failed.`);
			res.status(500).render("error", {
				error_message: "Status Update failed!"
			});
		}
	} else {
		res.redirect("/login");
	}
});
app.use((req, res) => {
	res.status(404).render("error", {
		error_message: "404!"
	});
});
