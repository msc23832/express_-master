/* ./routes/NewUsers.js */

const express = require('express');
var router = express.Router();
var mssql = require('mssql');
var bodyParser = require('body-parser');
var Config = require('../DBConfig');

router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({
  extended: true
}));

// router.get('/', function(req, res) {
//   res.json({ message: 'welcome to our api!' });
//   //res.render('NewUsers');
// });

router.route('/save')

    .post(function(req, res) {


var connection = new mssql.ConnectionPool(Config.EmailDB);

connection.connect().then(function () {
  var request = new mssql.Request(connection);
        var sql = "INSERT INTO [EmailUsers] ([User],[Password],[Fullname],[Group]) VALUES ('" + req.body.user + "' , '" + req.body.password + "' , '" + req.body.fullname + "' , '" + req.body.group + "')";

        request.query(sql , function (err, result) {

            if(err){
                res.json(err.message);
                connection.close();
                //return next(err);
            } else {
                res.json(result.rowsAffected + " record(s) insert Success!!");
                connection.close();
                //res.redirect('/');
               // console.log(result.rowsAffected + " record(s) Success");
            }
        });
  });


        // save the bear and check for errors
        //bear.save(function(err) {
        //    if (err)
        //        res.send(err);

        //    res.json({ message: 'save' });
        //});

});


router.post('/', function (req, res) {
    // find the post in the `posts` array
    var connection = new mssql.ConnectionPool(Config.EmailDB);

    connection.connect().then(function () {
        var request = new mssql.Request(connection);
        console.log(req.body.user);

        // query to the database and get the records
        request.query(`select * from EmailUsers WHERE [User] = '${req.body.user}'` , function (err, recordset) {

            if (err) {
                console.log(err.message);
                res.json(err.message);
                connection.close();
            } else {
                console.log(recordset.recordset);
                res.json(recordset.recordset);
                connection.close();

            }
        });
    });
})

//router.post('/save', function(req, res) {
//  var request = new mssql.Request();

//  var sql = "INSERT INTO [EmailUsers] ([User],[Fullname],[Group]) VALUES ('" + req.body.User + "' , '" + req.body.Fullname + "' , '" + req.body.Group + "')";
  //console.log(sql);
        // query to the database and get the records
//        request.query(sql , function (err, result) {

//            if(err){
//                res.send(err.message);
                //return next(err);
//            } else {
//                res.send(result.rowsAffected + " record(s) insert Success!!");
                //res.redirect('/');
                //console.log(result.rowsAffected + " record(s) Success");
//            }
//        });
//});

module.exports = router;
