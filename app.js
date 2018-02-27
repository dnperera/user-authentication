var express = require('express');
var sessions = require('express-session');
var mongoose = require('mongoose');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user');

var app = express();
var port = process.env.PORT || 3000;
var ip = process.env.IP || '127.0.0.1';

app.use(bodyParser.urlencoded({extended:true}));

//connect or create  mongo db 'camp_grounds'
mongoose.connect('mongodb://localhost/camp_grounds');

//set view engine
app.set('view engine','ejs');

//set up express sessions
app.use(sessions({
	secret: 'Denith & Dasthi are the best',
	resave: false,
	saveUninitialized: false
}));


//set passport as middle ware in Express
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

//take user data from session and encod & decod
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set the root route
app.get('/',function ( req,res ){
	res.render('home');
});

app.get('/profile',isLoggedIn ,function( req,res ){
	res.render('profile');
});

//Auth Route - show sign up form
app.get('/register', function( req,res ){
	res.render('register');
});

app.post('/register', function( req, res ){
	console.log(req.body);
	User.register(new User({username:req.body.username,email:req.body.email}),req.body.password, function( error, user ){
		if( error) {
			console.log(error);
			return res.send('register')
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect('/profile');
		});
	});
});

//--- Login Routes
app.get('/login',function( req,res ) {
	res.render('login');
});

//Login logic
app.post('/login',passport.authenticate('local',{
	successRedirect:'/profile',
	failureRedirect: '/login'
}),function( req,res ) {});

//Logout
app.get('/logout',function( req,res ){
	req.logout();
	res.redirect('/');
});

function isLoggedIn( req,res,next ){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/login');
}

app.listen(port,ip,() => {
	console.log(`Server started listening on port ${port}`);
});



