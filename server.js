var express = require('express');
var bodyPaeser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var csrf = require('csurf');

// way 1 of managing session(https://www.npmjs.com/package/express-session)
//var session = require('express-session');

// way 2 of managing session(https://www.npmjs.com/package/client-sessions)
var session = require('client-sessions');

// other way of managing session
/*https://www.npmjs.com/package/cookie-session
https://www.npmjs.com/package/client-session
https://www.npmjs.com/package/cookie-parser
*/

// database connectivity and schema definition
mongoose.connect('mongodb://localhost/testdb');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	username : String,
	email : String,
	firstname : String,
	lastname :String,
	password : String
});
var User = mongoose.model('users', userSchema);

var app = express();

app.set('views', __dirname + '/view');
app.set('view engine', 'ejs');

// middleware
app.use(bodyPaeser.urlencoded({extended:true}));

// way 1 of managing session
/*app.use(session({
	secret : "superSecret",
	saveUninitialized : true,
	resave : true,
	cookie : {  // these are default values, we can change per our need
		path: '/', 
		httpOnly: true, 
		secure: false, 
		maxAge: null 
	}
}));*/

// way 2 of managing session
app.use(session({
	cookieName: 'session', // cookie name dictates the key name added to the request object 
	secret: 'superSecret', // should be a large unguessable string 
	duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms 
	activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds 
	httpOnly: true,
	secure: true
}));


app.use(csrf());

app.use(function(req, res, next){
	res.locals.csrfToken = req.csrfToken();
	next();
});

/**
 * Session Middleware
 */
app.use(function(req, res, next){
	if(req.session && req.session.user){
		// lookup the user in the DB by pulling their email from the session
		User.findOne({'email':req.session.user.email}, function(err, user){
			if(err){
				res.redirect('/login');
			}
			if(!user){
				req.session.reset();
				res.redirect('/login');
			} else{
				req.user = user;
				req.session.user = user;
				// expose the user to the template
				res.locals.user = user;
			}
			next();
		});
	} else {
		next();
	}
	
});

/*
 * Middleware function to check if the user is logged in
 */
function isLogedIn(req, res, next){
	if(req.user){
		next();
	} else{
		res.redirect('/login');
	}

};

/**
 * Index Route
 */
app.get('/', function(req, res){
	res.render('index');
});

/**
 * Login Route
 */
app.get('/login', function(req, res){
	res.render('login');
});

/**
 * Register Route
 */
app.get('/register', function(req, res){
	res.render('register');
});

/**
 * Dashboard route
 */
app.get('/dashboard', isLogedIn, function(req, res) {
	res.render('dashboard');
});

/**
 * Login route when user submit form
 */
app.post('/login', function(req, res){
	User.findOne({ 'email': req.body.email }, function(err, user) {
		if(err) {
			res.render('login');
		}
		if(!user) {
			res.render('login');
		} else{
			if(bcrypt.compareSync(req.body.password, user.password)) {
				//req.session.email = req.body.email;
				req.session.user = user;
				res.redirect('/dashboard');
				
			} else {
				res.render('login');
			}
		}
	});
	
});

/**
 * Register route when user submit form
 */
app.post('/register', function(req, res){
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(req.body.password, salt);

	var user = new User({
		username : req.body.usernmae,
		email : req.body.email,
		firstname : req.body.firstname,
		lastname : req.body.lastname,
		password : hash
	});

	user.save(function(err){
		if(!err) {
			req.session.user = user; 
			res.redirect('/dashboard');
		}
	});
});

/**
 * Logout route
 */
app.get('/logout', function(req, res){
	req.session.reset()
	res.redirect('/login');
});

app.listen(3000, function(req, res){
	console.log('yay! server is up and running');
});