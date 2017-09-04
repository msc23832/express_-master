/* ./routes/HotelInformation.js */

const express = require('express');
var router = express.Router();
var mssql = require('mssql');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var Config = require('../DBConfig');

router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({
  extended: true
}));

router.post('/', function(req, res) {
    console.log(req.body);

var connection = new mssql.ConnectionPool(Config.EmailDB);

connection.connect().then(function () {

  var request = new mssql.Request(connection);

        // query to the database and get the records
        request.query(`select * from EmailUsers Where [User] = '${req.body.User}' AND [Password] = '${req.body.Password}'`, function (err, recordset) {

            if(err){
              res.json(err.message);
              connection.close();
            } else {
              res.json(recordset.recordset);
              connection.close();
            }
        });
  });

});


module.exports = router;