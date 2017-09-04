/* ./routes/EmailSendEmail.js */

const express = require('express');
var router = express.Router();
var sql = require('mssql');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var Config = require('../DBConfig');

router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({
  extended: true
}));

router.post('/', function (req, res) {

  var connection = new sql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {

    var query = `SELECT [IDSendEmail] ,[Name] ,[Room] ,[Email] ,[Form] ,convert(VARCHAR(10), [Date], 106) as Date ,[MarketSegmentCode] ,[rsl_rateplan] ,[User] ,[Status] ,[Floor] ,[Preference] ,[StatusSend]
        FROM EmailSending where ([Date] >= '${req.body.DateArr}' and [Date] <= '${req.body.DateDep}') `;

    if (req.body.user != "" && req.body.user != undefined) {
      if (req.body.user == "null") {
        query += ` and User = '${req.body.user}' `;
      } 
    } else {
      query += ` and User = 'Arnoma' `;
    }
    if (req.body.Template != "" && req.body.Template != undefined) {
      query += ` and [Form] = (SELECT Code FROM [EmailTemplate] WHERE [IDEmailTemplate] = '${req.body.Template}')`;
    }
    if (req.body.rateplan != "" && req.body.rateplan != undefined) {
      query += ` and rsl_rateplan = '${req.body.rateplan}' `;
    }
    if (req.body.status != "" && req.body.status != undefined) {
      query += ` and Status = '${req.body.status}' `;
    }
    if (req.body.marketsec != "" && req.body.marketsec != undefined) {
      query += ` and MarketSegmentCode = '${req.body.marketsec}' `;
    }
    if (req.body.preference != "" && req.body.preference != undefined) {
      query += ` and Preference = '${req.body.preference}' `;

    } else {
      query += ` and Preference = 'null' `;
    }
    if (req.body.floor != "" && req.body.floor != undefined) {
      if (req.body.floor == "null") {
        query += ` and Room is null`;
      } else {
        query += ` and Room = '${req.body.floor}' `;
      }
    }

    var request = new sql.Request(connection);

    console.log(query);

    request.query(query, function (err, result) {
      if (err) {
        res.json(err.message);
        connection.close();
      } else {
        res.json(result.recordset);
        connection.close();
      }
    });
  });
});

router.get('/market', function (req, res) {

  var connection = new sql.ConnectionPool(Config.ArnomaDB);

  connection.connect().then(function () {


    var request = new sql.Request(connection);

    // query to the database and get the records
    request.query('SELECT rs.MarketSegmentCode as marketsegment FROM reservation as rs GROUP BY rs.MarketSegmentCode', function (err, recordset) {

      if (err) {
        res.json(err.message);
        connection.close();
      } else {
        res.json(recordset.recordset);
        connection.close();
      }
    });
  });
});

router.get('/rateplan', function (req, res) {

  var connection = new sql.ConnectionPool(Config.ArnomaDB);

  connection.connect().then(function () {


    var request = new sql.Request(connection);

    // query to the database and get the records
    request.query('SELECT rsl.rsl_rateplan as rateplan FROM P5RESERVATIONLIST as rsl GROUP BY rsl.rsl_rateplan', function (err, recordset) {

      if (err) {
        res.json(err.message);
        connection.close();
      } else {
        res.json(recordset.recordset);
        connection.close();
      }

    });
  });
});

router.get('/status', function (req, res) {

  var connection = new sql.ConnectionPool(Config.ArnomaDB);

  connection.connect().then(function () {


    var request = new sql.Request(connection);

    // query to the database and get the records
    request.query('SELECT rsl.rsl_status as [status] FROM P5RESERVATIONLIST as rsl GROUP BY rsl.rsl_status', function (err, recordset) {

      if (err) {
        res.json(err.message);
        connection.close();
      } else {
        res.json(recordset.recordset);
        connection.close();
      }

    });
  });
});

router.get('/preference', function (req, res) {

  var connection = new sql.ConnectionPool(Config.ArnomaDB);

  connection.connect().then(function () {


    var request = new sql.Request(connection);

    // query to the database and get the records
    request.query('SELECT resp.PreferenceCode as Preference FROM ReservationStayPreference as resp GROUP BY resp.PreferenceCode', function (err, recordset) {

      if (err) {
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

