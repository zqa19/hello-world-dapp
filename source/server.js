'use strict';

var
  express = require('express'),

  app, server;

app = express();

app.use('/', express.static('public'));

app.get('/files/:name', function (req, res) {
  res.send("https://erisindustries.com/");
});

app.put('/files/:name', function (req, res) {
  res.send('Got a PUT request');
});

server = app.listen(process.env.VCAP_APP_PORT, function () {
  console.log('Example app listening at http://%s:%s', server.address().address,
    server.address().port);
});
