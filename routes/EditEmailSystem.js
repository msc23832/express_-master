/* ./routes/EditEmailSystem.js */

const express = require('express');
var router = express.Router();
var mssql = require('mssql');
var bodyParser = require('body-parser');
var Config = require('../DBConfig');

router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/chkDuplicate/:IDEmailSystem', function (req, res) {
    // find the post in the `posts` array

    var connection = new mssql.ConnectionPool(Config.EmailDB);

    connection.connect().then(function () {

        var request = new mssql.Request(connection);

        // query to the database and get the records
        request.query(`select * from EmailSystem WHERE IDEmailSystem != ${req.params.IDEmailSystem} AND [Email] = '${req.body.Email}'`, function (err, result) {

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

router.get('/:IDEmailSystem', function (req, res) {
    // find the post in the `posts` array

    var connection = new mssql.ConnectionPool(Config.EmailDB);

    connection.connect().then(function () {

        var request = new mssql.Request(connection);

        // query to the database and get the records
        request.query('select * from EmailSystem WHERE IDEmailSystem = ' + req.params.IDEmailSystem, function (err, result) {

            if (err) {
                res.json(err.message);
                connection.close();
            } else {

                //const posts = recordset.recordset ;
                // const post = posts.filter((post) => {
                //  return post.IDEmailSystem == req.params.IDEmailSystem
                //})[0]

                ////console.log(posts);

                //// render the `post.ejs` template with the post content
                //res.render('EditEmailSystem', {
                //  Email: post.Email,
                //  Detail: post.Detail,
                //  Host: post.Host,
                //  Port: post.Port,
                //  Proxy: post.Proxy,
                //  Password: post.Password
                //})
                //console.log(result.recordset);
                res.json(result.recordset);
                connection.close();

                //console.log(post);

            }
            // send records as a response
            //res.send(recordset);
        });
    });
})

router.post('/:IDEmailSystem/save', function (req, res) {

    var connection = new mssql.ConnectionPool(Config.EmailDB);

    connection.connect().then(function () {
        var request = new mssql.Request(connection);
        var sql = "UPDATE EmailSystem SET Email = '" + req.body.Email + "' , Password = '" + req.body.Password + "' , Host = '" + req.body.Host + "' , Port = " + req.body.Port + " , Proxy = '" + req.body.Proxy + "' , Detail = '" + req.body.Detail + "' WHERE IDEmailSystem = " + req.params.IDEmailSystem;

        // query to the database and get the records
        request.query(sql, function (err, result) {

            if (err) {
                res.json({ 'Error': err.message });
                connection.close();
            } else {
                res.json({ 'record(s) updated Success!!': result.rowsAffected });
                connection.close();
            }
        });
    });
});

router.delete('/:IDEmailSystem/delete', function (req, res) {

    var connection = new mssql.ConnectionPool(Config.EmailDB);

    connection.connect().then(function () {
        var request = new mssql.Request(connection);
        var sql = "DELETE FROM EmailSystem WHERE IDEmailSystem = " + req.params.IDEmailSystem;
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
