/* app.js */

// require and instantiate express
const app = require('express')();
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
var port = Number(process.env.PORT || 2017);

var Config = require('./DBConfig');
var mssql = require('mssql');

express = require('express');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//var EmailDB = require('./EmailDB');
//var ArnomaDB = require('./ArnomaDB')

// connect MSSQL
//var mssql = require('mssql');

//mssql.close();

//var config = {
//    user: 'sa',
//    password: 'P@ssw0rd',
//    server: 'MSC23832',
//    database: 'EmailDB'
//}
//var connection = mssql.connect(config, function (err) {
//    if (err)
//        throw err;
//});

//module.exports = connection;
app.use(cors());
app.use('/api', require('./routes/_routes'));
app.use('/', (req, res) => {
  //res.status(200).json({ message: 'Connected!' });  
  res.render('home')
});

// set the view engine to ejs

app.set(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var server = app.listen(port, () => {
  // Success callback
  console.log(`Listening at http://localhost:${port}/`);
});

var io = require('socket.io')(server);
var i = 0;
io.on('connection', function (socket) {
  socket.on('add-message', (data) => {
    //socket.emit('message', data);

    var connection = new mssql.ConnectionPool(Config.EmailDB);
    
    connection.connect().then(function () {
    
      var request = new mssql.Request(connection);
    
      // query to the database and get the records
      request.query("SELECT top 100 Email as _email,CASE WHEN StatusSend = 1 THEN 'success' ELSE 'false' END as _status FROM EmailSending order by Date desc",
        function (err, recordset) {
    
          if (err) {
            console.log('error');
            socket.emit('message', err.message);
            //res.json(err.message);
            connection.close();
          } else {
            console.log(recordset.recordset);
            //res.render('Users', {posts: recordset.recordset});
            socket.emit('message', recordset.recordset);
            //res.json(recordset.recordset);
            connection.close();
          }
        });
    
    });
    
    // data=+ i++ +""+ '- ' + data    ;
    // console.log(data);
    // socket.emit('message', data);
    
  });

});


// blog home page
// app.get('/', (req, res) => {
//   // render `home.ejs` with the list of posts
//   res.render('home')
// })
//  Connect all our routes to our application


// call page routes.js
// app.use(express.static(__dirname));
// app.use('/HotelInformation', HotelInformation);

// app.use('/EmailTemplate', EmailTemplate);
// app.use('/NewEmailTemplate', NewEmailTemplate);
// app.use('/EditEmailTemplate', EditEmailTemplate);
// app.use('/PreviewEmailTemplate', PreviewEmailTemplate);

// app.use('/EmailSystem', EmailSystem);
// app.use('/NewEmailSystem', NewEmailSystem);
// app.use('/EditEmailSystem', EditEmailSystem);

// app.use('/SendEmail', SendEmail);

// app.use('/Users', Users);
// app.use('/NewUsers', NewUsers);
// app.use('/EditUsers', EditUsers);
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

// call http
//app.listen(port)
console.log('listening on port ' + port)


