var medium = require('medium-sdk')
var express = require('express');

var app = express();


var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)


var client = new medium.MediumClient({
  clientId: 'f9ac9c750c0a',
  clientSecret: '92b6bd6f149866abe1872ef77da25c0f70ea4955'
})


//routes

// route for home page
  app.get('/', function(req, res) {
      console.log("yolo");
      res.sendfile('./public/index.html');
  });

  app.get('/auth/medium',function(req,res) {
      res.redirect('https://medium.com/m/oauth/authorize?client_id=f9ac9c750c0a&scope=basicProfile,publishPost&state=yolo&response_type=code&redirect_uri=http://127.0.0.1:8080/auth/callback');
  });

  app.get('/auth/callback',function(req,res) {
      console.log("code is : " + req.query.code);
      res.sendfile('./public/wait.html');
      var code = req.query.code;
      client.exchangeAuthorizationCode(code, 'http://127.0.0.1:8080/auth/callback',function(err,token) {
          if (!err) {
            client.getUser(function(err,user){
              console.log(JSON.stringify(user.data.imageUrl));
            });

          } else {console.log(token + " error : " + err);
          }
      })

  });

  app.get('/auth/done',function(req,res){
    console.log("Done : " + req);
    res.sendfile('./public/welcome.html');

  })



// listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");


var url = client.getAuthorizationUrl('yolo', 'https://google.com', [
  medium.Scope.BASIC_PROFILE, medium.Scope.PUBLISH_POST
])



//(Send the user to the authorization URL to obtain an authorization code.)
//
// client.exchangeAuthorizationCode('c01adc1e279d', "https://www.getpostman.com/oauth2/callback",function(err,token) {
//     console.log(token + " error : " + err);
// })
//
// client.getUser(function(err,data) {
//     console.log("User : "JSON.stringify(data));
// });
//

// client.setAccessToken('1421909a8e1587310749ef32e772d702a');
// client.createPost({
//   userId : "12bc3354bcc5350bd53426c426064ef32c6abd5c0d1e6715d9aaa556de8b72d2d",
//   title : "My First Post using the Medium Publish API",
//   content : "<h1>This is pretty cool</h1><p>Loving this</p>",
//   contentFormat : "html",
//   tags : ["API", "Medium API", "Medium"]},
//   function(err, data) {
//     if (!err) {
//       console.log("No error in creating post: " + data);
//     } else {
//       console.log("error in creating post: " + err);
//     }
//   }
// );
