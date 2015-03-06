'use strict';

var
  express = require('express'),

  app, server;

app = express();

app.use('/helloworld', express.static('public'));

app.get('/apis/helloworld/files/:name', function (req, res) {
  res.send(JSON.stringify({data: encodeURI("https://erisindustries.com/")}));
});

app.post('/apis/helloworld/files', function (req, res) {
  res.send('Got a POST request');
});

server = app.listen(process.env.VCAP_APP_PORT, function () {
  console.log('Example app listening at http://%s:%s', server.address().address,
    server.address().port);
});
