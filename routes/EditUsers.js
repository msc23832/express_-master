/* ./routes/EditUsers.js */

const express = require('express');
var router = express.Router();
var mssql = require('mssql');
var bodyParser = require('body-parser');
var Config = require('../DBConfig');

router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({
    extended: true
}));


router.get('/:IDUsers', function (req, res) {
    // find the post in the `posts` array
    var connection = new mssql.ConnectionPool(Config.EmailDB);

    connection.connect().then(function () {
        var request = new mssql.Request(connection);

        // query to the database and get the records
        request.query('select * from EmailUsers WHERE IDUsers = ' + req.params.IDUsers, function (err, recordset) {

            if (err) {
                res.json(err.message);
                connection.close();
            } else {
                res.json(recordset.recordset);
                connection.close();

            }
        });
    });
})

router.post('/:IDUsers/save', function (req, res) {

    console.log(req.body);

    var connection = new mssql.ConnectionPool(Config.EmailDB);

    connection.connect().then(function () {
        var request = new mssql.Request(connection);
        var sql = "UPDATE EmailUsers SET [Password] = '" + req.body.Password + "' , [Fullname] = '" + req.body.Fullname + "' , [Group] = '" + req.body.Group + "' WHERE IDUsers = " + req.body.IDUsers;

        request.query(sql, function (err, result) {

            if (err) {
                console.log('error');
                res.json({ 'Error': err.message });
                connection.close();
            } else {
                console.log('success');
                res.json({ 'record(s) updated Success!!': result.rowsAffected });
                connection.close();
            }
        });
    });

});

//router.post('/:IDUsers/save', function(req, res) {
//  var request = new mssql.Request();
//  var sql = "UPDATE EmailUsers SET [User] = '" + req.body.User + "' , [Fullname] = '" + req.body.Fullname + "' , [Group] = '" + req.body.Group + "' WHERE IDUsers = " + req.params.IDUsers;
// query to the database and get the records
//        request.query(sql , function (err, result) {

//            if(err){
//                res.send(err.message);
//            } else {
//                res.send(result.rowsAffected + " record(s) updated Success!!");
//            }
//        });
//});

//router.post('/:IDUsers/delete', function(req, res, next){
router.delete('/:IDUsers/delete', function (req, res) {
    var connection = new mssql.ConnectionPool(Config.EmailDB);

    connection.connect().then(function () {
        var request = new mssql.Request(connection);
        var sql = "DELETE FROM EmailUsers WHERE IDUsers = " + req.params.IDUsers;
        console.log(req.params.IDUsers);
        //var sql = "DELETE FROM EmailUsers WHERE IDUsers = " + req.params.IDUsers;
        // query to the database and get the records
        request.query(sql, function (err, result) {

            if (err) {
                res.json({ 'Error': err.message });
                connection.close();
            } else {
                res.json({ 'Delete Success': result.rowsAffected });
                connection.close();
            }
        });
    });
});


module.exports = router;
