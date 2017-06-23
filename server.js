//start database by mongod --dbpath D:\development\node\rarepuppers\data

//requirements
var express = require("express"),
	path = require('path'),
  http = require('http'),
	fs = require('fs'),
	multer = require('multer'),
  mongoose = require('mongoose'),
	pupSwitcher = require('./pupSwitcher'),
	socketio = require('socket.io');

var mongo = require('mongodb'),
	monk = require('monk'),
  db = monk('localhost:27017/rarepupper_users');



var	clients = [],
	uploadedFiles = [],
	votes = [];

//start server
const app = express();
var port =  process.env.PORT || 3001;
app.set('port', port);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

var server = http.Server(app);
var io = socketio(server);

server.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console

	setTimeout(switchImage, 3000);
});

//Connect to the database
/*
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/rarepupper_users');
var db = mongoose.connection;
db.on('error', console.error.bind(console, '# Mongo DB: connection error:'));
db.once('open', function (callback) {
  console.log("# Mongo DB:  Connected to server");
});

var Schema = mongoose.Scshema,
  ObjectId = Schema.ObjectID;

var User = new Schema({
	score: { type: Number, required: true }
});
var User = mongoose.model('User', User);
*/

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});
var userCollection = db.get('users');

// The event will be called when a client is connected.
io.on('connection', function (socket) {
	var user_id = socket.handshake.query.user_id;

  console.log('A client just joined on ' + socket.id + " with user " + user_id);

	var user;
	//if the user id isn't defined then we need to create a new one
	if (typeof user_id === 'undefined' || !user_id || user_id === 'undefined') {
		createNewUser(socket.id);
	}
	//otherwise, find the existing entry
	else {
		userCollection.findOne({ '_id': user_id }, function (err, user) {
		  if (err) {
				return handleError(err);
			}

			if(user){
				var newUser = { id: user._id, score: user.score };
				clients[user._id] = socket.id;
				sendUser(newUser);
			} else {
				createNewUser(socket.id)
			}
		})
	};

	io.emit('updateCurrentImage', getClientPath(getFileName(currentFile)));

	socket.on("disconnect", function(){
		console.log("A client just disconnected on ", socket.id);

		Object.keys(clients).forEach(function(key) {
  		var val = clients[key];
  		if(val == socket.id){
				delete clients[key];
			}
		});
	});

	socket.on('userVote', function (voteKey) {
		votes[socket.id] = voteKey;
	});

});

//tracking variables
var uploadCounter = 0;
var currentFile;

//handle image uploads
app.post('/api/upload', function(req, res) {

	var upload = multer({
		storage: storage
	}).single('file')

	upload(req, res, function(err) {
		var filename = req.file.filename;
		var userId = req.body.userId;

		uploadedFiles[filename.toLowerCase()] = userId;  //probably should put a safety null check here...

	})
})

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './client/public/uploads');
	},

	filename: function(req, file, callback) {
		callback(null, 'queued-pupper' + (uploadCounter++) + path.extname(file.originalname));
	}
})

//server functions (maybe put in separate files someday?)
function switchImage(){
	var fileToDelete = currentFile;

	pupSwitcher.getNextPupper(getFileName(fileToDelete), (err, result) => {

		//console.log(currentFile + " || " + result)
		if(err || result == null) {
			//error
		} else {
			//tally up the votes for the current pupper
			tallyVotes(votes, getFileName(currentFile));

			//switch out to the new pupper
			currentFile = result;
			votes = {};  //clear out existing votes

			if(currentFile != fileToDelete) {
				//update all clients
      	io.emit('updateCurrentImage', getClientPath(getFileName(currentFile)));

				//delete old pupper
				if(fileToDelete) {
					/*fs.unlink(fileToDelete, (err) => {
						if (err) console.log(err);
					})*/
		 	 	}
		 	}
		}
	})

	setTimeout(switchImage, 3000);
}

function getClientPath(fileName) {
	if(fileName == null) {return null; }
	else {
		return "./uploads/" + fileName;
	}
}

function getFileName(fullPath){
	if(fullPath == null) { return null; }
	return fullPath.replace(/^.*[\\\/]/, '')
}

function sendUser(newUser){
	console.log("sending user: " + newUser.id + " " + newUser.score);
	io.emit("user", newUser);
}

function createNewUser(socketId){
	var user = { score: 0 };

  db.collection("users").insert(user, function(error, data) {
		if(error){
				console.log(error);
		}
		else {
				var newUser = { id: data._id, score: 0 };
				sendUser(newUser);

				clients[user._id] = socketId;
		}
	});
}

function tallyVotes(votes, currentFilename) {
	var voteTotal = 0;
	var userId = "";

	if(currentFilename) {
		userId = uploadedFiles[currentFilename.toLowerCase()];
	}

	if(!userId) { return; }

	Object.keys(votes).forEach(function(key) {
		var voteKey = votes[key];

		switch (voteKey) {
			case 0:
				voteTotal += -1;
				break;
			case 1:
				voteTotal += 1;
				break;
			case 2:
				voteTotal += 5;
				break;
			default:
				//do nothing
		}

	});

	userCollection.findOne({ '_id': userId }, 'score', function (err, user) {
		var currentScore = user.score;
	 	var newScore = currentScore + voteTotal;

		userCollection.update({'_id': userId}, {$set: {'score': newScore}});

		var socketId = clients[userId];

		if (socketId) {
			io.to(socketId).emit('score', newScore);
		}
	});
}
