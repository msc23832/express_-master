/* ./routes/NewEmailTemplate.js */

const express = require('express');
var router = express.Router();
var mssql = require('mssql');
var bodyParser = require('body-parser');
var Config = require('../DBConfig');


router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({
  extended: true
}));

router.post('/', function (req, res) {
  // find the post in the `posts` array
  var connection = new mssql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {
      var request = new mssql.Request(connection);
      console.log(req.body);

      // query to the database and get the records
      request.query(`select * from EmailSystem WHERE [Email] = '${req.body.Email}'` , function (err, recordset) {

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

router.post('/save', function(req, res) {
var connection = new mssql.ConnectionPool(Config.EmailDB);

connection.connect().then(function () {
  var request = new mssql.Request(connection);
  var sql = "INSERT INTO EmailSystem (Email,[Password],Host,Port,Proxy,Detail) VALUES ('" + req.body.Email + "' , '" + req.body.Password + "' , '" + req.body.Host + "' , " + req.body.Port + " ,'" + req.body.Proxy + "' , '" + req.body.Detail + "')";
  //console.log(sql);
        // query to the database and get the records
        request.query(sql , function (err, result) {

            if(err){
                res.json(err.message);
                connection.close();
            } else {
                res.json(result.rowsAffected + " record(s) insert Success!!");
                connection.close();
            }

        });
  });
});

module.exports = router;
