'use strict';
const express = require('express');
const path = require('path');
// const middleware = require('./middleware');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
//
// app.use(middleware.morgan('dev'));
// app.use(middleware.cookieParser());
// app.use(middleware.bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

//app.use(middleware.auth.session);
//app.use(middleware.passport.initialize());
//app.use(middleware.passport.session());
//app.use(middleware.flash());

app.use(express.static(path.join(__dirname, '../public')));


//app.use('/', routes.auth);
app.use('/api', routes.api);
//app.use('/api/profiles', routes.profiles);
app.use('/api/newGame', routes.newGame);
app.use('/api/updateGame', routes.updateGame);




//socket crap

const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const socketIdsInRoom = (name) => {
  var socketIds = io.nsps['/'].adapter.rooms[name];
  if (socketIds) {
    var collection = [];
    for (var key in socketIds) {
      collection.push(key);
    }
    return collection;
  } else {
    return [];
  }
};

io.on('connection', function(socket) {
  console.log('connection');
  socket.on('disconnect', function() {
    console.log('disconnect');
    if (socket.room) {
      var room = socket.room;
      io.to(room).emit('leave', socket.id);
      socket.leave(room);
    }
  });

  socket.on('join', function(name, callback) {
    console.log('join', name);
    var socketIds = socketIdsInRoom(name);
    callback(socketIds);
    socket.join(name);
    socket.room = name;
  });


  socket.on('exchange', function(data) {
    console.log('exchange', data);
    data.from = socket.id;
    var to = io.sockets.connected[data.to];
    to.emit('exchange', data);
  });
});



module.exports = app;
