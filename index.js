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
		windowMs: 15 * 1000, // 15 seconds
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
	} else {
		res.render("index");
	}
});
app.get("/login", (req, res) => {
	if (req.session.user) {
		res.redirect("/dashboard");
	} else {
		res.render("login");
	}
});
app.get("/dashboard", (req, res) => {
	if (req.session.user) {
		if (req.session.user.role === "teacher") {
			con.query(
				"select * from booking where userID= ?",
				req.session.user.id,
				(err, bookingData) => {
					con.query(
						"select * from events where userID= ?",
						req.session.user.id,
						(err, eventsData) => {
							res.render("dashboard_teacher", {
								res: req.session.user,
								bookingData,
								eventsData
							});
						}
					);
				}
			);
		} else if (req.session.user.role === "dean") {
			con.query("select * from booking;", (err, bookingData) => {
				con.query("select * from events;", (err, eventsData) => {
					res.render("dashboard_dean", {
						res: req.session.user,
						bookingData,
						eventsData
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
		con.query("select * from booking;", (err, bookingData) => {
			con.query("select * from events;", (err, eventsData) => {
				res.render("dashboard_facility_card", {
					res: req.session.user,
					bookingData,
					eventsData
				});
			});
		});
	} else {
		res.redirect("/login");
	}
});
app.get("/dashboard_facility_table", (req, res) => {
	if (req.session.user) {
		con.query("select * from booking;", (err, bookingData) => {
			con.query("select * from events;", (err, eventsData) => {
				res.render("dashboard_facility_table", {
					res: req.session.user,
					bookingData,
					eventsData
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
		con.query("select * from booking where id=4;", (err, bookingData) => {
			con.query(
				"select * from events where id=30;",
				(err, eventsData) => {
					res.render("requestUpdate", {
						res: req.session.user,
						bookingData,
						eventsData
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
	con.query(
		"select * from users where username= ?",
		req.body.username,
		(err, rows) => {
			if (!err) {
				if (rows.length > 0) {
					if (
						req.body.password ===
						AES.decrypt(rows[0].password, `${process.env.AES_key}`)
					) {
						req.session.user = rows[0];
						res.redirect("/dashboard");
					} else {
						console.log("Invalid password");
						res.status(401).render("error", {
							errorMessage: "Authentication error!"
						});
					}
				} else {
					console.log("Username not found!");
					res.status(401).render("error", {
						errorMessage: "Authentication error!"
					});
				}
			} else {
				console.log("Username not found!");
				res.status(401).render("error", {
					errorMessage: "Authentication error!"
				});
			}
		}
	);
});
app.post("/checkAvailability", (req, res) => {
	if (req.session.user) {
		con.query(
			"SELECT slotHall FROM booking WHERE eventID IN (SELECT id FROM events WHERE dateWanted = ?)",
			req.body.dateWanted,
			(err, result) => {
				if (!err) {
					res.send(result);
				} else {
					console.log(err);
					res.status(500).render("error", {
						errorMessage: "Availability checking failed!"
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
		var slotHall = "";
		for (var i = 1; i <= 7; i++) {
			for (var j = 1; j <= 9; j++) {
				if (req.body[`cell${j}${i}`]) {
					slotHall += j.toString() + i.toString();
				}
			}
		}
		var eventPayload = {
			title: req.body.event_name,
			club: req.body.clubName,
			requirements: req.body.requirements,
			details: req.body.desc,
			dateWanted: req.body.dateWanted,
			userID: req.session.user.id
		};
		con.query("insert into events set ?", eventPayload, (err) => {
			if (!err) {
				console.log(`Inserted ${eventPayload.title} into events.`);
				con.query(
					"select id from events WHERE userID= ? ORDER BY id DESC LIMIT 1",
					req.session.user.id,
					(err, eventID) => {
						if (!err) {
							var bookingPayload = {
								userID: req.session.user.id,
								eventID: eventID[0].id,
								slotHall
							};
							con.query(
								"insert into booking set ?",
								bookingPayload,
								(err) => {
									if (!err) {
										console.log(
											`Inserted event with id ${bookingPayload.eventID} into booking.`
										);
										res.redirect("/dashboard");
									} else {
										console.log(err);
										res.status(500).render("error", {
											errorMessage:
												"Inserting into booking failed!"
										});
									}
								}
							);
						} else {
							console.log(err);
							res.status(500).render("error", {
								errorMessage: "Retrieving eventID failed!"
							});
						}
					}
				);
			} else {
				console.log(err);
				res.status(500).render("error", {
					errorMessage: "Inserting into event failed!"
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
			"select eventID from booking where id = ?",
			req.body.booking_id,
			(err, result) => {
				if (result) {
					con.query(
						"delete from events where id = ?",
						result[0].eventID,
						(err) => {
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
										} else {
											res.send(JSON.stringify(err.code));
										}
									}
								);
							} else {
								res.send(JSON.stringify(err.code));
							}
						}
					);
				} else {
					res.send(JSON.stringify(err.code));
				}
			}
		);
	} else {
		res.redirect("/login");
	}
});
app.post("/updateStatus", (req, res) => {
	if (req.session.user) {
		if (req.body.type === "approve") {
			con.query(
				"update booking set status='Approved' where id = ?",
				req.body.booking_id,
				(err, result) => {
					if (!err) {
						console.log(`${req.body.booking_id} is approved`);
						res.send(JSON.stringify(result));
					} else {
						res.send(JSON.stringify(err.code));
					}
				}
			);
		} else if (req.body.type === "reject") {
			con.query(
				"update booking set status='Rejected' where id = ?",
				req.body.booking_id,
				(err, result) => {
					if (!err) {
						console.log(`${req.body.booking_id} is rejected`);
						res.send(JSON.stringify(result));
					} else {
						res.send(JSON.stringify(err.code));
					}
				}
			);
		} else {
			console.log(`${req.body.booking_id} status update failed.`);
			res.status(500).render("error", {
				errorMessage: "Status Update failed!"
			});
		}
	} else {
		res.redirect("/login");
	}
});
app.use((req, res) => {
	res.status(404).render("error", {
		errorMessage: "404!"
	});
});
