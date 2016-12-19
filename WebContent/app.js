var loginDiv = $('<div id = "login">');
var makeUserDiv = $('<div id = "makeUser">');
var deadlinesDiv = $('<div id = "dlDiv">');
var addButton;
var ticking = true;
var firstEditClick = false;
var sortStyle = "";

window.addEventListener('load', function() {

	$('body').append($('<h1 id = "introTitle">Deadliner</h1>'));
	loginScreen();

});

var loginScreen = function() {

	$('body').append(loginDiv);
	var loginForm = $('<form id = "loginForm">');
	$('#login').append(loginForm);
	var nameField = $('<input name = "nameField" type = "text" placeholder = "Username">');
	$('#loginForm').append(nameField);
	var passField = $('<input name = "passField" type = "password" placeholder = "Password">');
	$('#loginForm').append(passField);
	var subButton = $('<button name = "submit" type = "button" value = "submit">Enter</button>');
	$('#loginForm').append(subButton);
	createButton = $('<button name = "create" type = "button" value = "create">Create Account</button>');
	$('#loginForm').append(createButton);

	subButton.click(function(e) {
		verify();
	});
	createButton.click(function(e) {
		console.log("createee");
		makeUser();
	});

}

var verify = function() {

	var obj = {
		name : $('#loginForm :input[name = nameField]').val(),
		password : $('#loginForm :input[name = passField]').val()
	};

	var myReq = $.ajax({
		type : "POST",
		url : "api/users/verify",
		dataType : "json",
		contentType : "application/json",
		data : JSON.stringify(obj)
	});

	myReq.fail(function() {

		$('#loginForm').remove();
		$('#warning').remove();
		loginScreen();
		$('#login').append($('<h6 id = "warning" style = "color:red">Sorry, I don\'t recognize that information</h6>'));
	});

	myReq.done(function(data) {
		dashboard(data);
	});

}

var makeUser = function() {

	$('#loginForm').remove();
	$('#login').remove();
	$('#makeUserForm').remove();
	$('#makeUser').remove();

	$('body').append(makeUserDiv);
	var header = $('<h4>Create Account</h4>');
	$('#makeUser').append(header);
	var makeUserForm = $('<form id = "makeUserForm">');
	$('#makeUser').append(makeUserForm);
	var nameField = $('<input name = "nameField" type = "text" placeholder = "Username">');
	$('#makeUserForm').append(nameField);
	var passField = $('<input name = "passField" type = "text" placeholder = "Password">');
	$('#makeUserForm').append(passField);
	var makeButton = $('<button name = "submit" type = "button" value = "submit">Create</button>');
	$('#makeUserForm').append(makeButton);
	var backButton = $('<button name = "back" type = "button" value = "back">Go Back</button>');
	$('#makeUserForm').append(backButton);

	backButton.click(function(e) {
		header.remove();
		$('#makeUserForm').remove();
		$('#makeUser').remove();
		$('#login').remove();
		loginScreen();
	});

	makeButton.click(function(e) {
		$('#warning').remove();

		var nameVal = $('#makeUserForm :input[name = nameField]').val();
		var passVal = $('#makeUserForm :input[name = passField]').val();

		if (typeof nameVal === 'string' && typeof passVal === 'string') {
			createUser(nameVal, passVal);
		} else {
			$('#makeUser').append($('<h6 id = "warning" style = "color:red">Sorry, that information won\'t work</h6>'));
		}
	});

}

var createUser = function(name, pass) {

	var obj = {
		name : name,
		password : pass
	};

	var myReq = $.ajax({
		type : "POST",
		url : "api/users",
		dataType : "json",
		contentType : "application/json",
		data : JSON.stringify(obj)
	});

	myReq.fail(function() {

		$('#warning').remove();
		$('#makeUser').append($('<h6 id = "warning" style = "color:red">Sorry, that information won\'t work</h6>'));

	});

	myReq.done(function(data) {
		dashboard(data);
	});
}

var dashboard = function(user) {

	var name = user.name;
	var deadlines = user.deadlines;
	var dateSortButton = $('<button id = "dateSort" name = "dateSort" type = "button" value = "dateSort">Arrange by Date</button>');
	var prioritySortButton = $('<button id = "prioritySort" name = "prioritySort" type = "button" value = "prioritySort">Arrange by Priority</button>');
	
	if(sortStyle === "byDate"){
		dateSortButton.hide();
		prioritySortButton.show();
		deadlines = deadlines.sort(function(a, b){
			return a.dueDate - b.dueDate;
		});
	} else {
		prioritySortButton.hide();
		dateSortButton.show();
		deadlines = deadlines.sort(function(a, b){
			return b.priority - a.priority;
		});
	}
	
	$('body').empty();

	$('body').append('<h1 id "dashTitle">Your deadlines:</h1>');
	$('body').append(deadlinesDiv);

	var dlTable = $("<table id = 'dlTable' name = 'dlTable'>");
	deadlinesDiv.append(dlTable);
	var thead = $("<thead><tr><th>Deadline&emsp;&emsp;</th><th>Priority</th><th>Date Due</th><th>Time Elapsed</th><th>Time left</th></tr></thead>");
	dlTable.append(thead);
	var tbody = $("<tbody>");
	dlTable.append(tbody);

	if (deadlines != null) {

		for (var i = 0; i < deadlines.length; i++) {
			var id = deadlines[i].id;
			var name = deadlines[i].name;
			var priority = deadlines[i].priority;
			var dueDate = new Date(deadlines[i].dueDate);
			var createDate = new Date(deadlines[i].createDate);
			var now = new Date();
			var timeElapsed = timeRemaining(createDate, now);
			var timeLeft = timeRemaining(dueDate, now);

			var newRow = $('<tr class = "tableRow" title = ' + id + '><td>'
					+ name + '</td><td>' + priority + '</td><td>'
					+ dueDate.toDateString() + '</td><td>' + timeElapsed
					+ '</td><td>' + timeLeft + '</td><td></tr>');
			dlTable.append(newRow);
		}
	}
	
	var exitButton = $('<button id = "exit" name = "exit" type = "button" value = "exit">Leave Deadliner</button>');
	deadlinesDiv.append(exitButton);
	exitButton.click(function(){
		location.reload();
	});
	
	deadlinesDiv.append(dateSortButton);
	dateSortButton.click(function(){
		dateSortButton.hide();
		prioritySortButton.show();
		sortStyle = "byDate";
	});
	
	deadlinesDiv.append(prioritySortButton);
	prioritySortButton.click(function(){
		prioritySortButton.hide();
		dateSortButton.show();
		sortStyle = "byPriority";
	});
	
	var editButton = $('<button id = "edit1" name = "edit" type = "button" value = "edit">Edit Deadlines</button>');
	deadlinesDiv.append(editButton);
	editButton.click(function(e) {
		ticking = false;
		firstEditClick = true;
	});

	if (ticking) {
		setTimeout(function() {
			deadlinesDiv.empty();
			dashboard(user);
		}, 1000);
	} else if (firstEditClick) {
		editTable(user);
		prioritySortButton.hide();
		dateSortButton.hide();
	} else {
		prioritySortButton.hide();
		dateSortButton.hide();
	}

}

var timeRemaining = function(date1, date2) {

	var delta = Math.abs(date1 - date2) / 1000;

	// calculate (and subtract) whole days
	var days = Math.floor(delta / 86400);
	delta -= days * 86400;

	// calculate (and subtract) whole hours
	var hours = Math.floor(delta / 3600) % 24;
	delta -= hours * 3600;

	// calculate (and subtract) whole minutes
	var minutes = Math.floor(delta / 60) % 60;
	delta -= minutes * 60;

	// what's left is seconds
	var seconds = Math.floor(delta % 60); 

	var leftString = "&emsp;&emsp; D: " + days + " H: " + hours + " M: "
			+ minutes + " S: " + seconds + " ";

	return leftString;

}

var editTable = function(user) {

	ticking = false;
	firstEditClick = false;

	$('#edit1').remove();
	var finishEditButton = $('<button id = "stopEdit" name = "stopEdit" type = "button" value = "stopEdit">Done Editing</button>');
	deadlinesDiv.append(finishEditButton);
	addButton = $('<button name = "addDl" type = "button" value = "addDl">Add</button>');
	deadlinesDiv.append(addButton);

	finishEditButton.click(function(e) {

		ticking = true;
		deadlinesDiv.empty();
		$('body').empty();
		dashboard(user);

	});

	addButton.click(function(e) {
		addButton.hide();
		addDl(user);
	});

	$.each($('.tableRow'),function() {
		var id = $(this).attr("title");
		console.log(id);
		var editButton = $('<td><button name = "editDl" type = "button" value = "editDl">Edit</button></td>');
		var deleteButton = $('<td><button name = "deleteDl" type = "button" value = "deleteDl">Delete</button></td>');

		$(this).append(editButton);
		$(this).append(deleteButton);

		editButton.click(function(e) {
			addButton.hide();
			editDl(user, id);
		});

		deleteButton.click(function(e) {
			deleteDl(user, id);
		});

	});

}

var addDl = function(thisUser) {

	$('dlTable').remove();

	$('body').append($('<h2 id = "addTitle">Add a New Deadline</h2>'));
	var newDlForm = $('<form id = "newDlForm">');

	$('body').append(newDlForm);
	var nameField = $('<input name = "nameField" type = "text" placeholder = "Title">');
	$('#newDlForm').append(nameField);

	var priorityField = $('<select name = "priority"><option value="" disabled selected>Priority</option>'
			+ '<option value = "1">1</option><option value = "2">2</option>'
			+ '<option value = "3">3</option><option value = "4">4</option>'
			+ '<option value = "5">5</option><option value = "6">6</option>'
			+ '<option value = "7">7</option><option value = "8">8</option>'
			+ '<option value = "9">9</option><option value = "10">10</option></select>');
	$('#newDlForm').append(priorityField);

	var yearField = $('<select name = "years">');
	yearField.append($('<option value="1" disabled selected>Year</option>'));
	for (var i = 2016; i < 2116; i++) {
		var yearOption = $('<option value = "' + i + '">' + i + '</option>');
		yearField.append(yearOption);
	}
	$('#newDlForm').append(yearField);

	var monthField = $('<select name = "months">');
	monthField.append($('<option value="1" disabled selected>Month</option>'));
	for (var i = 0, k = 1; i < 12; i++, k++) {
		var monthOption = $('<option value = "' + i + '">' + k + '</option>');
		monthField.append(monthOption);
	}
	$('#newDlForm').append(monthField);

	var dayField = $('<select name = "days">');
	dayField.append($('<option value="1" disabled selected>Day</option>'));
	for (var i = 1; i < 32; i++) {
		var dayOption = $('<option value = "' + i + '">' + i + '</option>');
		dayField.append(dayOption);
	}
	$('#newDlForm').append(dayField);

	var hourField = $('<select name = "hours">');
	hourField.append($('<option value="1" disabled selected>Hour</option>'));
	for (var i = 1; i < 13; i++) {
		var hourOption = $('<option value = "' + i + '">' + i + '</option>');
		hourField.append(hourOption);
	}
	$('#newDlForm').append(hourField);

	var minField = $('<select name = "mins">');
	minField.append($('<option value="1" disabled selected>Minutes</option>'));
	for (var i = 0; i < 60; i++) {
		var minOption = $('<option value = "' + i + '">' + i + '</option>');
		minField.append(minOption);
	}
	$('#newDlForm').append(minField);

	var amHour = $('<input type = "radio" name = "ampm" value = "am">AM</input>');
	var pmHour = $('<input type = "radio" name = "ampm" value = "pm">PM</input>');
	$('#newDlForm').append(amHour);
	$('#newDlForm').append(pmHour);

	var makeButton = $('<button name = "submit" type = "button" value = "submit">Create</button>');
	$('#newDlForm').append(makeButton);

	makeButton.click(function(e) {

		var uId = thisUser.id;
		var hours = $('#newDlForm :input[name = hours]').val();
		if ($('#newDlForm :input[name = ampm]').val() === "pm") {
			hours += 12;
		}

		var dDate = new Date($('#newDlForm :input[name = years]').val(),
			$('#newDlForm :input[name = months]').val(), $('#newDlForm :input[name = days]').val(),
			hours, $('#newDlForm :input[name = mins]').val(), 0, 0);
			// year, month, day, hour, minute, second, millisecond

		var obj = {
			name : $('#newDlForm :input[name = nameField]').val(),
			priority : $('#newDlForm :input[name = priority]').val(),
			dueDate : dDate,
			createDate : new Date(),
			user : thisUser
		};
		var myReq = $.ajax({
			type : "POST",
			url : "api/users/" + uId + "/dls",
			dataType : "json",
			contentType : "application/json",
			data : JSON.stringify(obj)
		});

		myReq.fail(function() {
			$('#warning').remove();
			$('#newDlForm').append($('<h6 id = "warning" style = "color:red">Sorry, that information won\'t work</h6>'));
		});

		myReq.done(function(data) {

			deadlinesDiv.empty();
			$('body').empty();


			var uId = thisUser.id;


			var data = "";
			var xhr = new XMLHttpRequest();

			xhr.open('GET', 'api/users/' + uId);

			xhr.onreadystatechange = function() {
				if (xhr.status < 400 && xhr.readyState === 4) {

					var data = JSON.parse(xhr.responseText);
					$('body').empty();
					dashboard(data);
					editTable(data);

				} else if (xhr.readyState === 4 && xhr.status >= 400) {
					console.error('ERROR!!!!');
				}
			};

			xhr.send(null);

		});

	});

	var retButton = $('<button name = "ret" type = "button" value = "ret">Nevermind</button>');
	$('#newDlForm').append(retButton);
	retButton.click(function(e) {

		newDlForm.remove();
		$('#addTitle').remove();
		deadlinesDiv.show();
		$('#dashTitle').show();
		addButton.show();

	});

}

var deleteDl = function(user, id) {
	var uId = user.id;

	var myReq = $.ajax({
		type : "DELETE",
		url : "api/users/" + uId + "/dls/" + id
	});

	myReq.fail(function() {

		console.log('no dice');

	});

	myReq.done(function(data) {

		console.log('dice');

		deadlinesDiv.empty();
		$('body').empty();

		var uId = user.id;

		console.log('uId: ' + uId);

		var data = "";
		var xhr = new XMLHttpRequest();

		xhr.open('GET', 'api/users/' + uId);

		xhr.onreadystatechange = function() {
			if (xhr.status < 400 && xhr.readyState === 4) {

				console.log(xhr.responseText);
				var data = JSON.parse(xhr.responseText);
				console.log(data);
				console.log(data.name);

				$('body').empty();
				dashboard(data);
				editTable(data);

			} else if (xhr.readyState === 4 && xhr.status >= 400) {
				console.error('ERROR!!!!');
			}
		};

		xhr.send(null);

	});

}

var editDl = function(user, dlId) {

	var uId = user.id;

	var data = "";
	var xhr = new XMLHttpRequest();

	xhr.open('GET', 'api/users/' + uId + '/dls/' + dlId);

	xhr.onreadystatechange = function() {
		if (xhr.status < 400 && xhr.readyState === 4) {

			$('dlTable').remove();

			var deadline = JSON.parse(xhr.responseText);
			var dueDate = new Date(deadline.dueDate);
			console.log('dueDate: ' + dueDate);

			$('body').append($('<h2 id = "editTitle">Edit Deadline</h2>'));
			var editDlForm = $('<form id = "editDlForm">');
			$('body').append(editDlForm);

			var nameField = $('<input name = "nameField" type = "text" value = "' + deadline.name + '">');
			$('#editDlForm').append(nameField);

			var priorityField = $('<input name = "priorityField" type = "text" value = "' + deadline.priority + '">');
			$('#editDlForm').append(priorityField);

			var yearField = $('<select name = "years">');
			yearField.append($('<option selected="selected" value="' + dueDate.getFullYear() + '">'+ dueDate.getFullYear() +'</option>'));
			for (var i = 2016; i < 2116; i++) {
				var yearOption = $('<option value = "' + i + '">' + i + '</option>');
				yearField.append(yearOption);
			}
			$('#editDlForm').append(yearField);

			var monthField = $('<select name = "months">');
			monthField.append($('<option selected="selected" value="' + dueDate.getMonth() + '">'+ dueDate.getMonth() +'</option>'));
			for (var i = 0, k = 1; i < 12; i++, k++) {
				var monthOption = $('<option value = "' + i + '">' + k + '</option>');
				monthField.append(monthOption);
			}
			$('#editDlForm').append(monthField);

			var dayField = $('<select name = "days">');
			dayField.append($('<option selected="selected" value="' + dueDate.getDate() + '">'+ dueDate.getDate() +'</option>'));
			for (var i = 1; i < 32; i++) {
				var dayOption = $('<option value = "' + i + '">' + i
						+ '</option>');
				dayField.append(dayOption);
			}
			$('#editDlForm').append(dayField);

			var hourField = $('<select name = "hours">');
			hourField.append($('<option selected="selected" value="' + dueDate.getHours() + '">'+ dueDate.getHours() +'</option>'));
			for (var i = 1; i < 13; i++) {
				var hourOption = $('<option value = "' + i + '">' + i
						+ '</option>');
				hourField.append(hourOption);
			}
			$('#editDlForm').append(hourField);

			var minField = $('<select name = "mins">');
			minField.append($('<option selected="selected" value="' + dueDate.getMinutes()+ '">'+ dueDate.getMinutes() +'</option>'));
			for (var i = 0; i < 60; i++) {
				var minOption = $('<option value = "' + i + '">' + i
						+ '</option>');
				minField.append(minOption);
			}
			$('#editDlForm').append(minField);

			var amHour = $('<input type = "radio" name = "ampm" value = "am">AM</input>');
			var pmHour = $('<input type = "radio" name = "ampm" value = "pm">PM</input>');
			if(dueDate.getHours() > 12){
				pmHour = $('<input type = "radio" name = "ampm" value = "pm" checked = "checked">PM</input>');
			} else {
				amHour = $('<input type = "radio" name = "ampm" value = "am" checked = "checked">AM</input>');
			}
			
			$('#editDlForm').append(amHour);
			$('#editDlForm').append(pmHour);

			var finishButton = $('<button name = "finish" type = "button" value = "finish">Finish</button>');
			$('#editDlForm').append(finishButton);

			finishButton.click(function(e) {

				var hours = $('#editDlForm :input[name = hours]').val();
				if ($('#editDlForm :input[name = ampm]').val() === "pm") {
					hours += 12;
				}

				// year, month, day, hour, minute, second, and
				// millisecond, in that order:
				var dDate = new Date($(
						'#editDlForm :input[name = years]').val(), $(
						'#editDlForm :input[name = months]').val(), $(
						'#editDlForm :input[name = days]').val(),
						hours, $('#editDlForm :input[name = mins]')
								.val(), 0, 0);

				var obj = {
					name : $('#editDlForm :input[name = nameField]').val(),
					priority : $('#editDlForm :input[name = priorityField]').val(),
					dueDate : dDate,
					createDate : new Date(),
					user : user
				};

				var myReq = $.ajax({
					type : "PUT",
					url : "api/users/" + uId + "/dls/" + dlId,
					dataType : "json",
					contentType : "application/json",
					data : JSON.stringify(obj)
				});

				myReq.fail(function() {
					$('#warning').remove();
					$('#editDlForm').append($('<h6 id = "warning" style = "color:red">Sorry, that information won\'t work</h6>'));
				});

				myReq.done(function(data) {

					deadlinesDiv.empty();
					$('body').empty();

					var data = "";
					var xhr = new XMLHttpRequest();

					xhr.open('GET', 'api/users/' + uId);

					xhr.onreadystatechange = function() {
						if (xhr.status < 400 && xhr.readyState === 4) {

							var data = JSON.parse(xhr.responseText);

							dashboard(data);
							editTable(data);

						} else if (xhr.readyState === 4 && xhr.status >= 400) {
							console.error('ERROR!!!!');
						}
					};

					xhr.send(null);

				});

			});

			var retButton = $('<button name = "ret" type = "button" value = "ret">Nevermind</button>');
			$('#editDlForm').append(retButton);
			retButton.click(function(e) {

				editDlForm.remove();
				$('#editTitle').remove();
				deadlinesDiv.show();
				$('#dashTitle').show();
				addButton.show();

			});

		} else if (xhr.readyState === 4 && xhr.status >= 400) {
			console.error('ERROR!!!!');
		}
	};

	xhr.send(null);

}
