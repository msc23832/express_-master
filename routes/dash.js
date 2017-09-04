const express = require('express');
var router = express.Router();
var mssql = require('mssql');
var Config = require('../DBConfig');
var bodyParser = require('body-parser');

router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', function(req, res) {
  //res.json({ message: 'dashboard api!' });
  var connection = new mssql.ConnectionPool(Config.EmailDB);
  
  connection.connect().then(function () {
  
          var request = new mssql.Request(connection);
  
          // query to the database and get the records
          request.query("SELECT T.MarketSegmentCode as keyz,COUNT(T.MarketSegmentCode)as y FROM EmailSending T where MONTH(Date) = MONTH(getdate()) and YEAR(Date) = YEAR(getdate()) GROUP BY T.MarketSegmentCode", 
          function (err, recordset) {
  
              if(err){
                res.json(err.message);
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
  
  router.get('/update', function(req, res) {
    //res.json({ message: 'dashboard api!' });
    var connection = new mssql.ConnectionPool(Config.EmailDB);
    
    connection.connect().then(function () {
    
            var request = new mssql.Request(connection);
    
            // query to the database and get the records
            request.query("SELECT top 100 Email as _email,CASE WHEN StatusSend = 1 THEN 'success' ELSE 'false' END as _status FROM EmailSending order by Date desc", 
            function (err, recordset) {
    
                if(err){
                  res.json(err.message);
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

    router.get('/send_count', function(req, res) {
      //res.json({ message: 'dashboard api!' });
      var connection = new mssql.ConnectionPool(Config.EmailDB);
      
      connection.connect().then(function () {
      
              var request = new mssql.Request(connection);
      
              // query to the database and get the records
              request.query("SELECT COUNT(*) as _count FROM EmailSending T where T.Date >= dateadd(dd, datediff(dd, 0, GETDATE())+0, 0)", 
              function (err, recordset) {
      
                  if(err){
                    res.json(err.message);
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

      router.get('/users_count', function(req, res) {
        //res.json({ message: 'dashboard api!' });
        var connection = new mssql.ConnectionPool(Config.EmailDB);
        
        connection.connect().then(function () {
        
                var request = new mssql.Request(connection);
        
                // query to the database and get the records
                request.query("SELECT COUNT(*) as _count FROM EmailUsers", 
                function (err, recordset) {
        
                    if(err){
                      res.json(err.message);
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

        router.get('/template_count', function(req, res) {
          //res.json({ message: 'dashboard api!' });
          var connection = new mssql.ConnectionPool(Config.EmailDB);
          
          connection.connect().then(function () {
          
                  var request = new mssql.Request(connection);
          
                  // query to the database and get the records
                  request.query("SELECT COUNT(*) as _count FROM EmailTemplate", 
                  function (err, recordset) {
          
                      if(err){
                        res.json(err.message);
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