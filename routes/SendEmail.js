/* ./routes/EmailSendEmail.js */

const express = require('express');
var router = express.Router();
var sql = require('mssql');
var nodemailer = require("nodemailer");
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var Config = require('../DBConfig');

router.use(bodyParser.json({ limit: '50mb' })); // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));


router.get('/', function (req, res) {
  //console.log(req.body);

  var connection = new sql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {


    var query = `SELECT * FROM EmailSending`;

    var request = new sql.Request(connection);
    //var sql = "";
    //console.log(query);
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

router.post('/getArnoma', function (req, res) {

  var connection = new sql.ConnectionPool(Config.ArnomaDB);

  connection.connect().then(function () {

    var query = `SELECT ROW_NUMBER() OVER (ORDER BY  rsl.rsl_firstname) ID , rsl.rsl_firstname + ' ' + rsl.rsl_lastname  as firstname, rsl.rsl_confirmationnumber as Confirmation, rsl.rsl_room as room, room.ROO_FLOOR as Floor 
    , convert(VARCHAR(10), rsl.rsl_arrivaldate, 106) as arrival, convert(VARCHAR(10), rsl.rsl_departuredate, 106) as departure,  rsl.rsl_email as email, rsl.rsl_roomtype as roomtype
        ,rsl.rsl_status , rsl.rsl_rateplan , rs.MarketSegmentCode , resp.PreferenceCode 
        FROM P5RESERVATIONLIST as rsl 
        left join reservationstay rst on rsl.rsl_reservationid=rst.ReservationID 
        left join reservation rs on rsl.rsl_reservationid=rs.ReservationID 
        left join ReservationStayPreference resp on rst.ReservationStayID=resp.ReservationStayID 
        left join P5Room room on rsl.rsl_room=room.ROO_CODE
        where rsl.rsl_email is not null and rsl.rsl_status not in ('INHOUSE','NOSHOW','WAITLIST','CANCELED') and rsl_primaryguest='+' and (rsl.rsl_arrivaldate >= '${req.body.DateArr}' and rsl.rsl_departuredate <= '${req.body.DateDep}') `;

    if (req.body.rateplan != "" && req.body.rateplan != undefined) {
      query += ` and rsl.rsl_rateplan = '${req.body.rateplan}' `;
    }
    if (req.body.status != "" && req.body.status != undefined) {
      query += ` and rsl.rsl_status = '${req.body.status}' `;
    }
    if (req.body.marketsec != "" && req.body.marketsec != undefined) {
      query += ` and rs.MarketSegmentCode = '${req.body.marketsec}' `;
    }
    if (req.body.preference != "" && req.body.prefer != undefined) {
      query += ` and resp.PreferenceCode = '${req.body.preference}' `;

    } else {
      query += ` and resp.PreferenceCode is null `;
    }
    if (req.body.floor != "" && req.body.floor != undefined) {
      if (req.body.floor == "null") {
        query += ` and room.ROO_FLOOR is null`;
      } else {
        query += ` and room.ROO_FLOOR = '${req.body.floor}' `;
      }
    }

    var request = new sql.Request(connection);

    //console.log(query);

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
    request.query('SELECT distinct(rs.MarketSegmentCode) as marketsegment FROM reservation as rs', function (err, recordset) {

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
    request.query('SELECT distinct(rsl.rsl_rateplan) as rateplan FROM P5RESERVATIONLIST as rsl', function (err, recordset) {

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
    request.query('SELECT distinct(rsl.rsl_status) as [status] FROM P5RESERVATIONLIST as rsl', function (err, recordset) {

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
    request.query('SELECT distinct(resp.PreferenceCode) as Preference FROM ReservationStayPreference as resp', function (err, recordset) {

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

router.get('/floor', function (req, res) {

  var connection = new sql.ConnectionPool(Config.ArnomaDB);

  connection.connect().then(function () {


    var request = new sql.Request(connection);

    // query to the database and get the records
    request.query('SELECT DISTINCT(ROO_FLOOR) FROM P5Room GROUP BY ROO_FLOOR', function (err, recordset) {

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

router.post('/getTemplate', function (req, res) {

  var connection = new sql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {


    var request = new sql.Request(connection);

    // query to the database and get the records
    request.query('select * from EmailTemplate WHERE IDEmailTemplate = ' + req.body.Template, function (err, recordset) {

      if (err) {
        res.json(err.message);
        connection.close();
      } else {
        const posts = recordset.recordset;
        const post = posts.filter((post) => {
          return post.HTMLTemplate
        })[0]
        req.param.HtmlPath = post.HTMLTemplate;
        req.param.Img1 = post.Img1;
        req.param.Img2 = post.Img2;
        req.param.Img3 = post.Img3;
        req.param.Img4 = post.Img4;
        req.param.Img5 = post.Img5;
        res.json(recordset.recordset);
        connection.close();
      }

    });
  });
});

router.post('/send', function (req, res) {
  //if(req.body.email == "" || req.body.subject == "") {
  //  res.send("Error: Email & Subject should not blank");
  //  return false;
  //}

  // console.log(req.body);

  var connection = new sql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {


    var request = new sql.Request(connection);

    // query to the database and get the records
    request.query(`select * from EmailTemplate LEFT JOIN EmailSystem ON EmailSystem.IDEmailSystem = EmailTemplate.IDEmailSystem WHERE EmailTemplate.IDEmailTemplate = ${req.body.Template} ; select * from HotelInformation`, function (err, recordset) {

      if (err) {
        res.json(err.message);
        connection.close();
      } else {

        const posts = recordset.recordsets[0];
        const Hotels = recordset.recordsets[1];
        const hotel = Hotels.filter((hotel) => {
          return hotel.Logo
        })[0]
        const post = posts.filter((post) => {
          return post.HTMLTemplate
        })[0]
        console.log(post);

        res.json(recordset.recordset);
        connection.close();

        var smtpTransport = nodemailer.createTransport({
          //host: 'mail.arnoma.com',
          host: "smtp.gmail.com", // hostname
          //host: `${post.Host}`,
          //secureConnection: false, // use SSL
          secureConnection: false,
          //requiresAuth: true,
          port: 587,
          //port: `${post.Port}`, // port for secure SMTP
          tls: {
            // do not fail on invalid certs
            ciphers: 'SSLv3'
          },
          auth: {
            //user: 'arnomainf@arnoma.com',
            //pass: 'infarnoma'
            user: 'xonyfirst1@gmail.com',
            pass: 'Rata2810'
            //user: `${post.Email}`,
            //pass: `${post.Password}`
          }
        });


        var mailOptions = {
          from: 'xonyfirst1@gmail.com' + "<arnomainf@arnoma.com>", // sender address
          //to: `${req.body.email}`, // list of receivers
          to: 'sivaccha@metrosystems.co.th',
          subject: 'Get this responsive email template',//req.body.subject, // Subject line
          //text: "{{username}}", // plaintext body

          html: `${post.HTMLTemplate}`,
          attachments: [
            {   // encoded string as an attachment
              filename: 'Logo.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(hotel.Logo.split("base64,")[1], "base64"),
              cid: 'logo@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'Img1.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.Img1.split("base64,")[1], "base64"),
              cid: 'img1@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'Img2.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.Img2.split("base64,")[1], "base64"),
              cid: 'img2@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'Img3.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.Img3.split("base64,")[1], "base64"),
              cid: 'img3@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'Img4.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.Img4.split("base64,")[1], "base64"),
              cid: 'img4@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'Img5.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.Img5.split("base64,")[1], "base64"),
              cid: 'img5@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'ImgFoot1.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.ImgFooter1.split("base64,")[1], "base64"),
              cid: 'imgfoot1@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'ImgFoot2.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.ImgFooter2.split("base64,")[1], "base64"),
              cid: 'imgfoot2@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'ImgFoot3.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.ImgFooter3.split("base64,")[1], "base64"),
              cid: 'imgfoot3@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'ImgFoot4.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.ImgFooter4.split("base64,")[1], "base64"),
              cid: 'imgfoot4@arnoma.com'
            },
          ]

        }

        var SenderReplace = mailOptions.html;

        mailOptions.html = SenderReplace.replace('#Sender', `${req.body.user}`).replace('#customer', `${req.body.firstname}`).replace('#arrival', `${req.body.arrival}`).replace('#departure', `${req.body.departure}`).replace('#confirm', `${req.body.Confirmation}`).replace('#rate', `${req.body.rsl_rateplan}`).replace('#room', `${req.body.roomtype}`);

        //console.log(mailOptions.html);

        smtpTransport.sendMail(mailOptions, (error, response) => {


          var connection = new sql.ConnectionPool(Config.EmailDB);

          connection.connect().then(function () {


            var request = new sql.Request(connection);

            if (error) {

              console.log(error);

              // query to the database and get the records
              request.query(`INSERT INTO [EmailSending] ([Name],[Room],[Email],[Form],[Date],[MarketSegmentCode],[rsl_rateplan],[User],[Status],[Floor],[Preference],[StatusSend]) 
              VALUES ('${req.body.firstname}','${req.body.room}','${req.body.email}', (SELECT [Code] FROM [EmailTemplate] WHERE [IDEmailTemplate] = '${req.body.Template}'), GETDATE() ,'${req.body.MarketSegmentCode}','${req.body.rsl_rateplan}','${req.body.User}','${req.body.rsl_status}','${req.body.Floor}','${req.body.PreferenceCode}',0)`, function (err, recordset) {

                  if (err) {
                    res.json(err.message);
                    connection.close();
                  } else {
                    console.log("Email could not sent due to error: " + error);
                    res.json(recordset.recordset);
                    connection.close();
                  }
                })

            } else {
              //console.log(req.body);
              //console.log(req.param.HtmlPath);
              console.log(req.body.firstname);
              console.log(req.body.email);

              // query to the database and get the records
              request.query(`INSERT INTO [EmailSending] ([Name],[Room],[Email],[Form],[Date],[MarketSegmentCode],[rsl_rateplan],[User],[Status],[Floor],[Preference],[StatusSend]) 
              VALUES ('${req.body.firstname}','${req.body.room}','${req.body.email}', (SELECT [Code] FROM [EmailTemplate] WHERE [IDEmailTemplate] = '${req.body.Template}'), GETDATE() ,'${req.body.MarketSegmentCode}','${req.body.rsl_rateplan}','${req.body.User}','${req.body.rsl_status}','${req.body.Floor}','${req.body.PreferenceCode}',1)`, function (err, recordset) {

                  if (err) {
                    console.log(err);
                    res.json(err.message);
                    connection.close();
                  } else {
                    console.log("Email has been sent successfully");
                    res.json(recordset.recordset);
                    connection.close();
                  }
                })

            }

          });
        });

        
      }

    });
  });
});

router.post('/resend', function (req, res) {

  var connection = new sql.ConnectionPool(Config.EmailDB);

  connection.connect().then(function () {


    var request = new sql.Request(connection);

    // query to the database and get the records
    request.query(`select * from EmailTemplate LEFT JOIN EmailSystem ON EmailSystem.IDEmailSystem = EmailTemplate.IDEmailSystem WHERE EmailTemplate.IDEmailTemplate =  ${req.body.IDEmailTemplate} ; select * from HotelInformation`, function (err, recordset) {

      if (err) {
        res.json(err.message);
        connection.close();
      } else {
        const posts = recordset.recordsets[0];
        const Hotels = recordset.recordsets[1];
        const hotel = Hotels.filter((hotel) => {
          return hotel.Logo
        })[0]
        const post = posts.filter((post) => {
          return post.HTMLTemplate
        })[0]

        console.log(hotel);
        console.log(post);
        res.json(recordset.recordset);
        connection.close();

        var smtpTransport = nodemailer.createTransport({
           //host: 'mail.arnoma.com',
          host: "smtp.gmail.com", // hostname
          //host: `${post.Host}`,
          //secureConnection: false, // use SSL
          secureConnection: false,
          //requiresAuth: true,
          port: 587,
          //port: `${post.Port}`, // port for secure SMTP
          tls: {
            // do not fail on invalid certs
            ciphers: 'SSLv3'
          },
          auth: {
            //user: 'arnomainf@arnoma.com',
            //pass: 'infarnoma'
            user: 'xonyfirst1@gmail.com',
            pass: 'Rata2810'
            //user: `${post.Email}`,
            //pass: `${post.Password}`
          }
        });
        var mailOptions = {
          from: 'xonyfirst1@gmail.com' + "<arnomainf@arnoma.com>", // sender address
          //to: `${req.body.Email}`, // list of receivers
          to: 'sivaccha@metrosystems.co.th',
          subject: 'Get this responsive email template',//req.body.subject, // Subject line
          //text: "{{username}}", // plaintext body
      
          html: `${post.HTMLTemplate}`,
          attachments: [
            {   // encoded string as an attachment
              filename: 'Logo.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(hotel.Logo.split("base64,")[1], "base64"),
              cid: 'logo@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'Img1.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.Img1.split("base64,")[1], "base64"),
              cid: 'img1@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'Img2.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.Img2.split("base64,")[1], "base64"),
              cid: 'img2@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'Img3.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.Img3.split("base64,")[1], "base64"),
              cid: 'img3@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'Img4.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.Img4.split("base64,")[1], "base64"),
              cid: 'img4@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'Img5.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.Img5.split("base64,")[1], "base64"),
              cid: 'img5@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'ImgFoot1.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.ImgFooter1.split("base64,")[1], "base64"),
              cid: 'imgfoot1@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'ImgFoot2.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.ImgFooter2.split("base64,")[1], "base64"),
              cid: 'imgfoot2@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'ImgFoot3.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.ImgFooter3.split("base64,")[1], "base64"),
              cid: 'imgfoot3@arnoma.com'
            },
            {   // encoded string as an attachment
              filename: 'ImgFoot4.jpg',
              //content: new Buffer(req.param.Img1, "base64"),
              content: new Buffer(post.ImgFooter4.split("base64,")[1], "base64"),
              cid: 'imgfoot4@arnoma.com'
            },
          ]
        }
      
        var SenderReplace = mailOptions.html;
      
        mailOptions.html = SenderReplace.replace('#Sender', `${req.body.user}`).replace('#customer', `${req.body.firstname}`).replace('#arrival', `${req.body.arrival}`).replace('#departure', `${req.body.departure}`).replace('#confirm', `${req.body.Confirmation}`).replace('#rate', `${req.body.rsl_rateplan}`).replace('#room', `${req.body.roomtype}`);
      
      
        //console.log(mailOptions.html);
      
      
        smtpTransport.sendMail(mailOptions, (error, response) => {
      
      
          var connection = new sql.ConnectionPool(Config.EmailDB);
      
          connection.connect().then(function () {
      
      
            var request = new sql.Request(connection);
      
      
            if (error) {
      
              console.log(error);
              console.log(req.body);
      
              // query to the database and get the records
              request.query(`UPDATE [EmailSending] SET [Email] = '${req.body.Email}', [Date] = GETDATE() , [User] = '${req.body.User}', [StatusSend] = 0 WHERE [IDSendEmail] = '${req.body.IDSendEmail}'`, function (err, recordset) {
      
                if (err) {
                  res.json(err.message);
                  connection.close();
                } else {
                  console.log("Email could not sent due to error: " + error);
                  res.json(recordset.recordset);
                  connection.close();
                }
              })
      
            } else {
      
              console.log(req.body);
              console.log(req.body.Email);
      
              // query to the database and get the records
              request.query(`UPDATE [EmailSending] SET [Email] = '${req.body.Email}', [Date] = GETDATE() , [User] = '${req.body.User}', [StatusSend] = 1 WHERE [IDSendEmail] = '${req.body.IDSendEmail}'`, function (err, recordset) {
      
                if (err) {
                  console.log(err);
                  res.json(err.message);
                  connection.close();
                } else {
                  console.log("Email has been sent successfully");
                  res.json(recordset.recordset);
                  connection.close();
                }
              })
      
            }
      
          });
        });

      }

    });
  });

  
});

module.exports = router;




//router.get('/', function(req, res) {

//var connection = new sql.ConnectionPool(Config.ArnomaDB);

//connection.connect().then(function () {


//  var request = new sql.Request(connection);

// query to the database and get the records
//        request.query('SELECT rs.MarketSegmentCode as marketsegment FROM reservation as rs GROUP BY rs.MarketSegmentCode', function (err, recordset) {

//            if(err){
//                res.send(err.message);
//              connection.close();
//return next(err);
//            } else {
//const posts = recordset.recordset ;
//const post = posts.filter((post) => {
//  return post.IDEmailTemplate
//})[0]


//console.log(posts);

// render the `post.ejs` template with the post content
//res.render('SendEmail', {
//  IDEmailTemplate: post.IDEmailTemplate,
//  Name: post.Name,
//  posts: posts
//})
//                res.json(recordset.recordset);
//              connection.close();
//console.log(recordset.recordset);
//sql.close();
//console.log(posts);

//sql.close();
//            }

// send records as a response
//res.send(recordset);
//        });
// });
//});

// router.post('/sendtemplate', function(req, res) {

// });




  //console.log(req.body.email);

  //var request = new mssql.Request();


  // query to the database and get the records
  //request.query('select * from UploadImage', function (err, recordset) {

  //if(err){
  //    return next(err);
  //} else {
  // const posts = recordset.recordset ;
  // const post = posts.filter((post) => {
  //   return post.Img64Bit
  // })[0]
  //console.log(posts);

  // Sending Emails with SMTP, Configuring SMTP settings


  // '<body topmargin="0" leftmargin="0">' +
  // '<div style="border-spacing:0;padding:0;width:600px !important;height:100% !important;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;background-color:#F0F0F0;color:#000000;max-width:600px;" bgcolor="#F0F0F0" text="#000000">' +
  // '<table width="600px" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;width:600px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;">' +
  // '<tbody>' +
  // '<tr>' +
  // '<td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;" bgcolor="#F0F0F0">' +
  // '<table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="600" style="border-collapse:collapse !important;border-spacing:0;padding:0;width:inherit;max-width:560px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;border-radius:8px;-webkit-border-radius:8px;-moz-border-radius:8px;-khtml-border-radius:8px;">' +
  // '<tbody>' +
  // '<tr>' +
  // '<td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;font-size:24px;font-weight:bold;line-height:100%;padding-top:10px;color:#000000;font-family:sans-serif;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // '<a target="_blank" style="text-decoration:none;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;color:#127DB3;" href="https://github.com/konsav/email-templates/">' +
  // '<img border="0" vspace="0" hspace="0" src="./logo.jpg" width="130px" height="110px" alt="Logo" title="Logo" style="color:#000000;font-size:10px;margin:0;padding:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:block;line-height:100%;" />' +
  // '</a><div> Get this responsive email template </div>' +
  // '</td>' +
  // '</tr>' +
  // '<tr>' +
  // '<td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-top:20px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"> <a href="https://github.com/konsav/email-templates/"> <img border="0" vspace="0" hspace="0" src="./home.jpg" alt="Please enable images to view this content" title="Hero Image" width="560" style="width:100%;max-width:560px;color:#000000;font-size:13px;margin:0;padding:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:block;line-height:100%;" /> </a> </td>' +
  // '</tr>' +
  // '<tr>' +
  // '<td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;font-size:17px;font-weight:400;line-height:100%;padding-top:25px;color:#000000;font-family:sans-serif;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // ' More than 50%&nbsp;of&nbsp;total email opens occurred on&nbsp;a&nbsp;mobile device&nbsp;— a&nbsp;mobile-friendly design is&nbsp;a&nbsp;must for&nbsp;email campaigns.' +
  // '</td>' +
  // '</tr>' +
  // '<!-- LINE -->' +
  // '<!-- Set line color -->' +
  // '<tr>' +
  // '<td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;padding-top:25px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // '<hr color="#E0E0E0" align="center" width="100%" size="1" noshade="" style="margin: 0; padding: 0;" /> </td>' +
  // '</tr>' +
  // '<tr>' +
  // '<td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // '<table align="center" border="0" cellspacing="0" cellpadding="0" style="width:inherit;margin:0;padding:0;border-collapse:collapse !important;border-spacing:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // '<tbody>' +
  // '<tr>' +
  // '<td align="left" valign="top" style="border-collapse:collapse !important;border-spacing:0;padding-top:30px;padding-right:20px;font-size:15px;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:sans-serif;"><b style="color: #333333;">Highly compatible</b><br /> Tested on the most popular email clients for web, desktop and mobile. Checklist included. <b style="color: #333333;">Designer friendly</b><br /> Sketch app resource file and a&nbsp;bunch of&nbsp;social media icons are&nbsp;also included in&nbsp;GitHub repository. </td>' +
  // '<!-- LIST ITEM TEXT -->' +
  // '<!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->' +
  // '</tr>' +
  // '<!-- LIST ITEM -->' +
  // '</tbody>' +
  // '</table> </td>' +
  // '</tr>' +
  // '<!-- LINE -->' +
  // '<!-- Set line color -->' +
  // '<tr>' +
  // '<td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;padding-top:25px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // '<hr color="#E0E0E0" align="center" width="100%" size="1" noshade="" style="margin: 0; padding: 0;" /> </td>' +
  // '</tr>' +
  // '<!-- PARAGRAPH -->' +
  // '<!-- Set text color and font family ("sans-serif" or "Georgia, serif"). Duplicate all text styles in links, including line-height -->' +
  // '<tr>' +
  // '<td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;font-size:17px;font-weight:400;line-height:100%;padding-top:20px;padding-bottom:25px;color:#000000;font-family:sans-serif;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // '<div>' +
  // '<span style="border-collapse:collapse !important;border-spacing:0;padding-top:30px;padding-right:20px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // '<img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:reletive;color:#000000;line-height:100%;" src="https://raw.githubusercontent.com/konsav/email-templates/master/images/list-item.png" alt="D" title="Designer friendly" width="100" height="100" />' +
  // '<img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:reletive;color:#000000;line-height:100%;" src="https://raw.githubusercontent.com/konsav/email-templates/master/images/list-item.png" alt="H" title="Highly compatible" width="100" height="100" />' +
  // '<img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:reletive;color:#000000;line-height:100%;" src="https://raw.githubusercontent.com/konsav/email-templates/master/images/list-item.png" alt="H" title="Highly compatible" width="100" height="100" />' +
  // '<img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:reletive;color:#000000;line-height:100%;" src="https://raw.githubusercontent.com/konsav/email-templates/master/images/list-item.png" alt="H" title="Highly compatible" width="100" height="100" />' +
  // '</span>' +
  // '</div>' +
  // '</td>' +
  // '</tr>' +
  // '</tbody>' +
  // '</table>' +
  // '<table border="0" cellpadding="0" cellspacing="0" align="center" width="600px" style="border-collapse:collapse !important;border-spacing:0;padding:0;width:inherit;max-width:600px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // '<!-- SOCIAL NETWORKS -->' +
  // '<!-- Image text color should be opposite to background color. Set your url, image src, alt and title. Alt text should fit the image size. Real image size should be x2 -->' +
  // '<tbody>' +
  // '<tr>' +
  // '<td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;padding-top:25px;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // '<table width="256" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse:collapse !important;border-spacing:0;padding:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
  // '<tbody>' +
  // '<tr>' +
  // '<!-- ICON 1 -->' +
  // '<td align="center" valign="middle" style="margin:0;padding:0;padding-left:10px;padding-right:10px;border-collapse:collapse !important;border-spacing:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"> <a target="_blank" href="https://raw.githubusercontent.com/konsav/email-templates/" style="text-decoration:none;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;color:#127DB3;"> <img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:inline-block;color:#000000;line-height:100%;" alt="F" title="Facebook" width="44" height="44" src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/facebook.png" /> </a> </td>' +
  // '<!-- ICON 2 -->' +
  // '<td align="center" valign="middle" style="margin:0;padding:0;padding-left:10px;padding-right:10px;border-collapse:collapse !important;border-spacing:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"><a target="_blank" href="https://raw.githubusercontent.com/konsav/email-templates/" style="text-decoration:none;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;color:#127DB3;"><img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:inline-block;color:#000000;line-height:100%;" alt="T" title="Twitter" width="44" height="44" src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/twitter.png" /></a></td>' +
  // '<!-- ICON 3 -->' +
  // '<td align="center" valign="middle" style="margin:0;padding:0;padding-left:10px;padding-right:10px;border-collapse:collapse !important;border-spacing:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"><a target="_blank" href="https://raw.githubusercontent.com/konsav/email-templates/" style="text-decoration:none;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;color:#127DB3;"><img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:inline-block;color:#000000;line-height:100%;" alt="G" title="Google Plus" width="44" height="44" src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/googleplus.png" /></a></td>' +
  // '<!-- ICON 4 -->' +
  // '<td align="center" valign="middle" style="margin:0;padding:0;padding-left:10px;padding-right:10px;border-collapse:collapse !important;border-spacing:0;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"><a target="_blank" href="https://raw.githubusercontent.com/konsav/email-templates/" style="text-decoration:none;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;line-height:100%;color:#127DB3;"><img border="0" vspace="0" hspace="0" style="padding:0;margin:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:inline-block;color:#000000;line-height:100%;" alt="I" title="Instagram" width="44" height="44" src="https://raw.githubusercontent.com/konsav/email-templates/master/images/social-icons/instagram.png" /></a></td>' +
  // '</tr>' +
  // '</tbody>' +
  // '</table> </td>' +
  // '</tr>' +
  // '<!-- FOOTER -->' +
  // '<tr>' +
  // '<td align="center" valign="top" style="border-collapse:collapse !important;border-spacing:0;margin:0;padding:0;padding-left:6.25%;padding-right:6.25%;width:87.5%;font-size:13px;font-weight:400;line-height:100%;padding-top:20px;padding-bottom:20px;color:#999999;font-family:sans-serif;-webkit-font-smoothing:antialiased;text-size-adjust:100%;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;mso-table-lspace:0pt;mso-table-rspace:0pt;"> This email template was sent to&nbsp;you becouse we&nbsp;want to&nbsp;make the&nbsp;world a&nbsp;better place. You&nbsp;could change your anytime.' +
  // '<!-- ANALYTICS --> <img width="1" height="1" border="0" vspace="0" hspace="0" style="margin:0;padding:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border:0;display:block;line-height:100%;" src="https://raw.githubusercontent.com/konsav/email-templates/master/images/tracker.png" /> </td>' +
  // '</tr>' +
  // '<!-- End of WRAPPER -->' +
  // '</tbody>' +
  // '</table>' +
  // '<!-- End of SECTION / BACKGROUND --> </td>' +
  // '</tr>' +
  // '</tbody>' +
  // '</table>' +
  // '</div>' +
  // '</body>'



  //console.log(post.Img64Bit);
  //}
  // send records as a response
  //res.send(recordset);
  //});

