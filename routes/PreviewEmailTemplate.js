/* ./routes/PreviewEmailTemplate.js */

const express = require('express');
var router = express.Router();
var mssql = require('mssql');
var bodyParser = require('body-parser');
var Config = require('../DBConfig');

router.use(bodyParser.json()); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/:IDEmailTemplate', function(req, res, next) {
  // find the post in the `posts` array
var connection = new mssql.ConnectionPool(Config.EmailDB);

connection.connect().then(function () {
  var request = new mssql.Request(connection);

        // query to the database and get the records
        request.query('select * from EmailTemplate; select * from EmailSystem; select * from HotelInformation;', function (err, recordset) {

            if(err){
                res.json(err.message);
                connection.close();
            } else {
                const posts = recordset.recordset ;
                const post = posts.filter((post) => {
                  return post.IDEmailTemplate == req.params.IDEmailTemplate
                })[0]

                const Sysposts = recordset.recordsets[1];
                const Syspost = Sysposts.filter((Syspost) => {
                  return Syspost.IDEmailSystem == post.IDEmailSystem
                })[0]

                const HIposts = recordset.recordsets[2];
                const HIpost = HIposts.filter((HIpost) => {
                  return HIpost.IDHotelInformation
                })[0]

                //console.log(Syspost.Email);
                //console.log(Syspost);

                // render the `post.ejs` template with the post content
                res.json(recordset.recordset);
                connection.close();

                //res.render('PreviewEmailTemplate', {
                //  IDEmailTemplate: post.IDEmailTemplate,
                //  Code: post.Code,
                //  Name: post.Name,
                //  IDEmailSystemTP: post.IDEmailSystem,
                //  Message1: post.Message1,
                //  Message2: post.Message2,
                //  posts: posts,
                //  Img1: post.Img1,
                //  Img2: post.Img2,
                //  IDEmailSystem: Syspost.IDEmailSystem,
                //  Email: Syspost.Email,
                //  Sysposts: Sysposts,
                //  HIposts: HIpost
                //})
            }
        });
  });


});


module.exports = router;
