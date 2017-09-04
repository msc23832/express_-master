/* ./routes/EditEmailTemplate.js */

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


router.get('/:IDEmailTemplate', function (req, res) {
  // find the post in the `posts` array

  var connection = new mssql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {
    var request = new mssql.Request(connection);

    // query to the database and get the records
    request.query('select * from EmailTemplate WHERE IDEmailTemplate = ' + req.params.IDEmailTemplate, function (err, recordset) {

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

router.get('/:IDEmailTemplate/System', function (req, res) {
  // find the post in the `posts` array

  var connection = new mssql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {

    var request = new mssql.Request(connection);

    // query to the database and get the records
    request.query('select * from EmailSystem;', function (err, recordset) {

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

router.get('/:IDEmailTemplate/HotelInfo', function (req, res) {
  // find the post in the `posts` array

  var connection = new mssql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {

    var request = new mssql.Request(connection);

    // query to the database and get the records
    request.query('select * from HotelInformation;', function (err, recordset) {

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


//router.get('/:IDEmailTemplate', function(req, res) {
// find the post in the `posts` array
//     var request = new mssql.Request();

// query to the database and get the records
//        request.query('select * from EmailTemplate; select * from EmailSystem; select * from HotelInformation;', function (err, recordset) {

//            if(err){
//                res.send(err.message);
//            } else {
//const posts = recordset.recordset ;
//const post = posts.filter((post) => {
//  return post.IDEmailTemplate == req.params.IDEmailTemplate
//})[0]

//const Sysposts = recordset.recordsets[1];
//const Syspost = Sysposts.filter((Syspost) => {
//  return Syspost.IDEmailSystem == post.IDEmailSystem
//})[0]

//const HIposts = recordset.recordsets[2];
//const HIpost = HIposts.filter((HIpost) => {
//  return HIpost.IDHotelInformation
//})[0]

////console.log(Syspost.Email);
////console.log(Syspost);

//// render the `post.ejs` template with the post content
//res.render('EditEmailTemplate', {
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
//            }
//        });

//});

router.post('/:IDEmailTemplate/upload1', function (req, res) {

  //console.log(req.body.Img1);
  req.param.Path1 = req.body.Img1;
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
  //   req.param.Path1 = base64str;
  //res.send(req.param.Path);
  //    console.log(req.param.Path1);
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

router.post('/:IDEmailTemplate/save', function (req, res) {

  //console.log(req.body);

  var htmlTemplate = `<body topmargin="0" leftmargin="0"> 
  <div style="border-spacing:0;width:600px !important;height:100% !important;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;background-color:#F0F0F0;color:#000000;max-width:600px;"
    bgcolor="#F0F0F0" text="#000000">

    <table width="600px" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;width:600px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;">
      <tbody>
        <tr>
          <td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"
            bgcolor="#F0F0F0">
            <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="600" style="border-collapse:collapse !important;border-spacing:0;padding:0;width:inherit;max-width:560px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;border-radius:8px;-webkit-border-radius:8px;-moz-border-radius:8px;-khtml-border-radius:8px;">
              <tbody>
                <tr>
                  <td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;font-size:24px;font-weight:bold;line-height:100%;padding-top:10px;color:#000000;font-family:sans-serif;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    <a target="_blank" style="text-decoration:none;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;color:#127DB3;"
                      href="http://www.arnoma.com/">
      
                      <img border="0" vspace="0" hspace="0" *ngFor="let data of _HotelInfo" src="cid:logo@arnoma.com" width="130px" height="110px" alt="Logo" title="Logo" style="color:#000000;font-size:10px;margin:0;padding:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:block;line-height:100%;" />
                    </a>

                    <div> ${req.body.Topics} </div>
                  </td>
                </tr>
                <tr>
                <td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-top:20px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                  <a href="${req.body.LinkImg1}"> <img border="0" vspace="0" hspace="0" src="cid:img1@arnoma.com" alt="Please enable images to view this content" title="Hero Image" width="560" style="width:100%;max-width:560px;color:#000000;font-size:13px;margin:0;padding:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:block;line-height:100%;" /> </a>                            </td>
              </tr>
                <tr>
                  <td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;font-size:17px;font-weight:400;line-height:100%;padding-top:25px;color:#000000;font-family:sans-serif;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    ${req.body.Message1}
                  </td>
                </tr>
                <!-- LINE -->
                <!-- Set line color -->
                <tr>
                  <td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;padding-top:25px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    <hr color="#E0E0E0" align="center" width="100%" size="1" noshade="" style="margin: 0; padding: 0;" /> </td>
                </tr>
                <tr>
                  <td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    <table align="center" border="0" cellspacing="0" cellpadding="0" style="width:inherit;margin:0;padding:0;border-collapse:collapse !important;border-spacing:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                      <tbody>
                        <tr>
                          <td align="left" valign="top" style="border-collapse:collapse !important;border-spacing:0;padding-top:30px;padding-right:20px;font-size:15px;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:sans-serif;"><b style="color: #333333;">#Highly compatible</b><br /> ${req.body.Message2} <b style="color: #333333;">Designer friendly</b><br
                            /> Sketch app resource file and a&nbsp;bunch of&nbsp;social media icons are&nbsp;also included
                            in&nbsp;GitHub repository. </td>
                          <!-- LIST ITEM TEXT -->
                          <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                        </tr>
                        <!-- LIST ITEM -->
                      </tbody>
                    </table>
                  </td>
                </tr>
                <!-- LINE -->
                <!-- Set line color -->
                <tr>
                  <td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;padding-top:25px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    <hr color="#E0E0E0" align="center" width="100%" size="1" noshade="" style="margin: 0; padding: 0;" /> </td>
                </tr>
                <!-- PARAGRAPH -->
                <!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->
                <tr>
                  <td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;font-size:17px;font-weight:400;line-height:100%;padding-top:20px;padding-bottom:25px;color:#000000;font-family:sans-serif;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    <div>
                      <span style="border-collapse:collapse !important;border-spacing:0;padding-top:30px;padding-right:20px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                        <a href="${req.body.LinkImg2}"><img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:reletive;color:#000000;line-height:100%;" src="cid:img2@arnoma.com" alt="D" title="Designer friendly" width="100" height="100" /></a>
                        <a href="${req.body.LinkImg3}"><img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:reletive;color:#000000;line-height:100%;" src="cid:img3@arnoma.com" alt="H" title="Highly compatible" width="100" height="100" /></a>
                        <a href="${req.body.LinkImg4}"><img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:reletive;color:#000000;line-height:100%;" src="cid:img4@arnoma.com" alt="H" title="Highly compatible" width="100" height="100" /></a>
                        <a href="${req.body.LinkImg5}"><img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:reletive;color:#000000;line-height:100%;" src="cid:img5@arnoma.com" alt="H" title="Highly compatible" width="100" height="100" /></a>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" align="center" width="600px" style="border-collapse:collapse !important;border-spacing:0;padding:0;width:inherit;max-width:600px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
              <!-- SOCIAL NETWORKS -->
              <!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 -->
              <tbody>
                <tr>
                  <td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;padding-top:25px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    <table width="256" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse:collapse !important;border-spacing:0;padding:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                      <tbody>
                        <tr>
                          <!-- ICON 1 -->
                          <td align="center" valign="middle" style="margin:0;padding:0;padding-left:10px;padding-right:10px;border-collapse:collapse !important;border-spacing:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                            <a target="_blank" href="${req.body.LinkImgFoot1}" style="text-decoration:none;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;color:#127DB3;"> <img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:inline-block;color:#000000;line-height:100%;" alt="F" title="Facebook" width="44" height="44" src="cid:imgfoot1@arnoma.com" /> </a>                                  </td>
                          <!-- ICON 2 -->
                          <td align="center" valign="middle" style="margin:0;padding:0;padding-left:10px;padding-right:10px;border-collapse:collapse !important;border-spacing:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"><a target="_blank" href="${req.body.LinkImgFoot2}" style="text-decoration:none;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;color:#127DB3;"><img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:inline-block;color:#000000;line-height:100%;" alt="T" title="Twitter" width="44" height="44" src="cid:imgfoot2@arnoma.com" /></a></td>
                          <!-- ICON 3 -->
                          <td align="center" valign="middle" style="margin:0;padding:0;padding-left:10px;padding-right:10px;border-collapse:collapse !important;border-spacing:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"><a target="_blank" href="${req.body.LinkImgFoot3}" style="text-decoration:none;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;color:#127DB3;"><img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:inline-block;color:#000000;line-height:100%;" alt="G" title="Google Plus" width="44" height="44" src="cid:imgfoot3@arnoma.com" /></a></td>
                          <!-- ICON 4 -->
                          <td align="center" valign="middle" style="margin:0;padding:0;padding-left:10px;padding-right:10px;border-collapse:collapse !important;border-spacing:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"><a target="_blank" href="${req.body.LinkImgFoot4}" style="text-decoration:none;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;color:#127DB3;"><img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:inline-block;color:#000000;line-height:100%;" alt="I" title="Instagram" width="44" height="44" src="cid:imgfoot4@arnoma.com" /></a></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <!-- FOOTER -->
                <tr>
                  <td *ngFor="let data of _HotelInfo" align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;font-size:13px;font-weight:400;line-height:100%;padding-top:20px;padding-bottom:20px;color:#999999;font-family:sans-serif;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                    ${req.body.Address}
                    <!-- ANALYTICS --><img width="1" height="1" border="0" vspace="0" hspace="0" style="margin:0;padding:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:block;line-height:100%;"
                      src="https://raw.githubusercontent.com/konsav/email-templates/master/images/tracker.png" /> </td>
                </tr>
                <!-- End of WRAPPER -->
              </tbody>
            </table>
            <!-- End of SECTION / BACKGROUND -->
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </body>`

  var connection = new mssql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {
    var request = new mssql.Request(connection);
    var sql = `UPDATE EmailTemplate SET 
    Code = '${req.body.Code}' , 
    Name = '${req.body.Name}' , 
    IDEmailSystem = '${req.body.IDEmailSystem}' , 
    Topics = '${req.body.Topics}' , 
    Message1 = '${req.body.Message1}' , 
    Message2 = '${req.body.Message2}' , 
    Img1 = '${req.body.Img1}' , 
    Img2 = '${req.body.Img2}' , 
    Img3 = '${req.body.Img3}' , 
    Img4 = '${req.body.Img4}' , 
    Img5 = '${req.body.Img5}' , 
    ImgFooter1 = '${req.body.ImgFooter1}' , 
    ImgFooter2 = '${req.body.ImgFooter2}' , 
    ImgFooter3 = '${req.body.ImgFooter3}' , 
    ImgFooter4 = '${req.body.ImgFooter4}', 
    [LinkImg1] = '${req.body.LinkImg1}',
    [LinkImg2] = '${req.body.LinkImg2}',
    [LinkImg3] = '${req.body.LinkImg3}',
    [LinkImg4] = '${req.body.LinkImg4}',
    [LinkImg5] = '${req.body.LinkImg5}',
    [LinkImgFoot1] = '${req.body.LinkImgFoot1}',
    [LinkImgFoot2] = '${req.body.LinkImgFoot2}',
    [LinkImgFoot3] = '${req.body.LinkImgFoot3}',
    [LinkImgFoot4] = '${req.body.LinkImgFoot4}',
    HTMLTemplate = '${htmlTemplate}'  
    WHERE IDEmailTemplate = ${req.params.IDEmailTemplate}`;
    // query to the database and get the records
    //console.log(sql);
    request.query(sql, function (err, result) {
      if (err) {
        res.json(err.message);
        connection.close();
      } else {
        res.json(result.rowsAffected + " record(s) updated Success!!");
        connection.close();
      }
    });
  });
});

router.delete('/:IDEmailTemplate/delete', function (req, res, next) {

  var connection = new mssql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {

    var request = new mssql.Request(connection);
    var sql = "DELETE FROM EmailTemplate WHERE IDEmailTemplate = " + req.params.IDEmailTemplate;
    // query to the database and get the records
    request.query(sql, function (err, result) {

      if (err) {
        res.json(err.message);
        connection.close();
      } else {
        res.json(result.rowsAffected + " record(s) delete Success!!");
        connection.close();
      }
    });
  });
});



module.exports = router;
