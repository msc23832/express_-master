/* ./routes/HotelInformation.js */

const express = require('express');
var router = express.Router();
var mssql = require('mssql');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var Config = require('../DBConfig');

router.use(bodyParser.json({ limit: '50mb' })); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));

router.get('/', function (req, res) {

  var connection = new mssql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {

    var request = new mssql.Request(connection);

    // query to the database and get the records
    request.query('select * from HotelInformation', function (err, recordset) {

      if (err) {
        res.send(err.message);
        connection.close();
      } else {
        const posts = recordset.recordset;
        const post = posts.filter((post) => {
          return post.IDHotelInformation
        })[0]

        //console.log(posts);
        if (posts != "") {
          //console.log('not null');
          //res.render('HotelInformation', {
          //  IDHotelInformation: post.IDHotelInformation,
          //  Code: post.Code,
          //  Name: post.Name,
          //  Address: post.Address,
          //  Logo: post.Logo,
          //  posts: posts
          //})
          res.json(recordset.recordset);
          connection.close();



        } else {
          //console.log('null');
          //res.render('HotelInformation');
          //res.render('HotelInformation', {
          //   posts: posts
          // })
          res.json([null]);
          connection.close();
        }

      }
    });
  });

});

router.post('/upload', function (req, res) {

  //console.log(req.body)

  req.param.Path = req.body.Logo;

  //  function base64_encode(file) {
  // read binary data
  //      var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  //      return new Buffer(bitmap).toString('base64');
  //  }

  //  var form = new formidable.IncomingForm();

  //  form.on('file', function(field, file) {
  //    fs.rename(file.path, path.join(form.uploadDir, file.name));
  //    var base64str = base64_encode(file.path);
  //    req.param.Path = base64str;
  //res.send(req.param.Path);
  //console.log(req.param.Path);
  //  });

  // log any errors that occur
  //  form.on('error', function(err) {
  //    console.log('An error has occured: \n' + err);
  //  });

  // once all the files have been uploaded, send a response to the client
  //  form.on('end', function() {
  //    res.end('success');
  //  });

  // parse the incoming request containing the form data
  //  form.parse(req);

});



router.post('/save', function (req, res) {


  var connection = new mssql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {

    var request = new mssql.Request(connection);

    // query to the database and get the records
    request.query('select * from HotelInformation', function (err, recordset) {

      if (err) {
        res.json(err.message);
        connection.close();
      } else {
        const posts = recordset.recordset;
        if (posts != "") {
          console.log('Update');
          var updatesql = "UPDATE [HotelInformation] SET [Code] = '" + req.body.Code + "', [Name] = '" + req.body.Name + "',[Address] = '" + req.body.Address + "', [Logo] = '" + req.body.Logo + "' WHERE [IDHotelInformation] = 1";
          // query to the database and get the records
          request.query(updatesql, function (err, result) {

            if (err) {
              res.json(err.message);
              connection.close();
            } else {
              res.json({ 'record(s) updated Success!!': result.rowsAffected });
              connection.close();
              //res.redirect('/');
              //console.log(result.rowsAffected + " record(s) Success");
            }
          });
        } else {
          console.log('Insert');
          var insertsql = "INSERT INTO HotelInformation ([Code],[Name],[Address],[Logo]) VALUES ('" + req.body.Code + "' , '" + req.body.Name + "' , '" + req.body.Address + "' , '" + req.body.Logo + "')";
          // query to the database and get the records
          //console.log(insertsql);
          request.query(insertsql, function (err, result) {

            if (err) {
              res.json(err.message);
              connection.close();
            } else {
              res.json({ 'record(s) insert Success!!': result.rowsAffected });
              connection.close();
              //res.redirect('/');
              //console.log(result.rowsAffected + " record(s) Success");
            }
          });
        }

      }
      // send records as a response
      //res.send(recordset);
    });
  });

});

module.exports = router;
