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
    , convert(VARCHAR(10), rsl.rsl_arrivaldate, 105) as arrival, convert(VARCHAR(10), rsl.rsl_departuredate, 105) as departure,  rsl.rsl_email as email, rsl.rsl_roomtype as roomtype
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

  //setTimeout(function () {

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
    
  //}, 10000);
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
        //console.log(post);

        res.json(recordset.recordset);
        connection.close();

        var smtpTransport = nodemailer.createTransport({
          //host: 'mail.arnoma.com',
          //host: "smtp.gmail.com", // hostname
          host: `${post.Host}`,
          //secureConnection: false, // use SSL
          secure: true,
          //port: 465,
          port: `${post.Port}`, // port for secure SMTP
          // tls: {
          //   // do not fail on invalid certs
          //   ciphers: 'SSLv3'
          // },
          auth: {
            //user: 'arnomainf@arnoma.com',
            //pass: 'infarnoma'
            user: `${post.Email}`,
            pass: `${post.Password}`
          }
        });


        var mailOptions = {
          from: `${post.Email}` + "<arnomainf@arnoma.com>", // sender address
          to: `${req.body.email}`, // list of receivers
          subject: `${post.Topics}`,//req.body.subject, // Subject line
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
          //host: "smtp.gmail.com", // hostname
          host: `${post.Host}`,
          //secureConnection: false, // use SSL
          secure: true,
          //requiresAuth: true,
          //port: 587,
          port: `${post.Port}`, // port for secure SMTP
          // tls: {
          //   // do not fail on invalid certs
          //   ciphers: 'SSLv3'
          // },
          auth: {
            //user: 'arnomainf@arnoma.com',
            //pass: 'infarnoma'
            user: `${post.Email}`,
            pass: `${post.Password}`
          }
        });
        var mailOptions = {
          from: `${post.Email}` + "<arnomainf@arnoma.com>", // sender address
          to: `${req.body.Email}`, // list of receivers
          subject: `${post.Topics}`,//req.body.subject, // Subject line
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

