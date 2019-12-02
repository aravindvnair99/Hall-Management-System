app.post('/dashboardDean', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	con.query(
		"select * from users where Username='" +
			username +
			"' and Designation='Dean';",
		function(err, rows) {
			if (!err) {
				if (rows.length > 0) {
					if (password === rows[0].Password) {
						res.render('dashboardDean');
					} else {
						console.log('Password is Wrong Buddy!');
						res.render('error', {
							message: 'Password is Wrong Buddy!'
						});
					}
				} else {
					console.log('Username Not Found!');
					res.render('error', { message: 'Username Not Found!' });
				}
			} else {
				res.render('error', {
					message: "Dont Poke Your Nose where you don't Belong!"
				});
			}
		}
	);

	//res.render('dashboardDean');
});

app.post('/dashboardFaculty', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	con.query(
		"select * from users where Username='" +
			username +
			"' and Designation='Faculty';",
		function(err, rows) {
			if (!err) {
				if (rows.length > 0) {
					if (password === rows[0].Password) {
						res.render('dashboardFaculty');
					} else {
						console.log('Password is Wrong Buddy!');
						res.render('error', {
							message: 'Password is Wrong Buddy!'
						});
					}
				} else {
					console.log('Username Not Found!');
					res.render('error', { message: 'Username Not Found!' });
				}
			} else {
				console.log("Dont Poke Your Nose where you don't Belong!");
				res.render('error', {
					message: "Dont Poke Your Nose where you don't Belong!"
				});
			}
		}
	);
});

app.post('/dashboardFacility', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	con.query(
		"select * from users where Username='" +
			username +
			"' and Designation='Facility';",
		function(err, rows) {
			if (!err) {
				if (rows.length > 0) {
					if (password === rows[0].Password) {
						res.render('dashboardFacility');
					} else {
						console.log('Password is Wrong Buddy!');
						res.render('error', {
							message: 'Password is Wrong Buddy!'
						});
					}
				} else {
					console.log('Username Not Found!');
					res.render('error', { message: 'Username Not Found!' });
				}
			} else {
				console.log("Dont Poke Your Nose where you don't Belong!");
				res.render('error', {
					message: "Dont Poke Your Nose where you don't Belong!"
				});
			}
		}
	);

	//res.render('dashboardFacility');
});

app.post('/dashboardClub', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	con.query(
		"select * from users where Username='" +
			username +
			"' and Designation='Dhara';",
		function(err, rows) {
			if (!err) {
				if (rows.length > 0) {
					if (password === rows[0].Password) {
						res.render('dashboardClub');
					} else {
						console.log('Password is Wrong Buddy!');
						res.render('error', {
							message: 'Password is Wrong Buddy!'
						});
					}
				} else {
					console.log('Username Not Found!');
					res.render('error', { message: 'Username Not Found!' });
				}
			} else {
				console.log("Dont Poke Your Nose where you don't Belong!");
				res.render('error', {
					message: "Dont Poke Your Nose where you don't Belong!"
				});
			}
		}
	);

	//res.render('dashboardDhara');
});

app.post('/makeRequest', function(req, res) {
	var fname = req.body.first_name;
	var lname = req.body.last_name;
	var mname = req.body.mentor_name;
	var sname = req.body.sec_name;
	var cname = req.body.club_name;
	var hname = req.body.hall_name;
	var ename = req.body.event_name;
	var wname = req.body.wing_name;
	var startTime = req.body.from_slot;
	var stopTime = req.body.to_slot;
	var edate = req.body.date_slot;

	var re = {
		Fname: fname,
		Lname: lname,
		ClubName: cname,
		FacultyOrMentorName: mname,
		ClubSecName: sname,
		Wing: wname,
		Hname: hname,
		EventDate: edate,
		FromTime: startTime,
		ToTime: stopTime,
		EventName: ename
	};

	con.query('insert into requests set ?', re, function(err, result) {
		if (!err) {
			console.log('success');
			res.render('dashboardClub', { message: 'Yaay! It Worked!!!' });
		} else {
			console.log(err);
			res.render('error', { message: 'Not working.' });
		}
	});
});
app.get('/pdean', function(req, res) {
	var request = 'Select * from requests;';

	con.query(request, function(req, data) {
		console.log(data);
		res.render('pdean', { res: data });
	});
});

app.get('/pfacility', function(req, res) {
	var request = 'Select * from requests;';

	con.query(request, function(req, data) {
		console.log(data);
		res.render('pfacility', { res: data });
	});
});

app.get('/grantPermission', function(req, res) {
	rid = req.query.rid;
	status = JSON.stringify(req.query.status);
	console.log(status + '   ' + rid);
	var query = 'update requests set pd=' + status + ' where rid=' + rid + ' ;';
	console.log(query);
	query1 = 'select * from requests;';
	console.log(query1);

	con.query(query, function(err, result) {
		console.log('ash');
		res.render('dashboardDean', { message: 'Cool' });
	});
});

/* for(var i=1;i<len;i++){
	console.log(parseInt(req.query.ap1))
	var bc=parseInt(req.query.ap1);
	console.log("bc"+bc)
	 if(bc=="1"||bc=="2")
	 {
	 console.log("hey")
	console.log(req.query.i)
  con.query('update requests set pd=? where rid=?',[1,i],function(err,result){
		 console.log("hooo"+err)
		 console.log(result)
		 res.render("dashboardDean",{message:"Cool"});
			   });
			   }
		  }
	});*/

app.get('/SudhamaniHallInfo', function(req, res) {
	var request = "Select * from requests where Hname='Sudhamani';";

	con.query(request, function(req, data) {
		console.log(data);
		res.render('SudhamaniHallInfo', { res: data });
	});
});

app.get('/ValmikiHallInfo', function(req, res) {
	var request = "Select * from requests where Hname='Valmiki';";

	con.query(request, function(req, data) {
		console.log(data);
		res.render('ValmikiHallInfo', { res: data });
	});
});

app.get('/VyasaHallInfo', function(req, res) {
	var request = "Select * from requests where Hname='Vyasa';";

	con.query(request, function(req, data) {
		console.log(data);
		res.render('VyasaHallInfo', { res: data });
	});
});

app.get('/RamaHallInfo', function(req, res) {
	var request = "Select * from requests where Hname='Rama';";

	con.query(request, function(req, data) {
		console.log(data);
		res.render('RamaHallInfo', { res: data });
	});
});

app.get('/KrishnaHallInfo', function(req, res) {
	var request = "Select * from requests where Hname='Krishna';";

	con.query(request, function(req, data) {
		console.log(data);
		res.render('KrishnaHallInfo', { res: data });
	});
});

app.get('/E-LearningHallInfo', function(req, res) {
	var request = "Select * from requests where Hname='ELearning';";

	con.query(request, function(req, data) {
		console.log(data);
		res.render('E-LearningHallInfo', { res: data });
	});
});

app.get('/AmriteshwariHallInfo', function(req, res) {
	var request = "Select * from requests where Hname='Amriteshwari';";

	con.query(request, function(req, data) {
		console.log(data);
		res.render('AmriteshwariHallInfo', { res: data });
	});
});

app.get('/grantPermission', function(req, res) {
	var len = req.query.len;
	console.log('the length' + len);
	var stat = req.query.status2;

	console.log(stat);
	for (var i = 1; i <= len; i++) {}
	var pd = req.body.status + i;
	console.log('ans' + status + i);
	con.query('insert into requests set ?', pd, function(err, result) {
		if (!err) {
			console.log('success');
			res.render('/pdean', { message: 'Yaay! It Worked!!!' });
		} else {
			console.log(err);
			res.render('error', { message: 'not working.' });
		}
	});
});
