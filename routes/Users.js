/* ./routes/Users.js */

const express = require('express');
var router = express.Router();
var mssql = require('mssql');
var Config = require('../DBConfig');

router.get('/', function(req, res) {
  // render `EmailTemplate.ejs` with the list of posts
        // create Request object

var connection = new mssql.ConnectionPool(Config.EmailDB);

connection.connect().then(function () {

        var request = new mssql.Request(connection);

        // query to the database and get the records
        request.query('select * from EmailUsers', function (err, recordset) {

            if(err){
              res.send(err.message);
              connection.close();
            } else {
                //console.log(recordset);
                //res.render('Users', {posts: recordset.recordset});
              res.json(recordset.recordset);
              connection.close();
            }
        });

  });
})

module.exports = router;
