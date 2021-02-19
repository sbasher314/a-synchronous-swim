const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url)
  var params = new URLSearchParams(req.url.split('?')[1]);
  var type = params.get('type')
  let statusCode = 200;

  if (req.method === 'GET') {
    // randomize swim command
    res.type = 'cors';
    if (type === 'swim') {
      let command = messageQueue.dequeue() ?? '';
      res.write(command);
    }
    if (type === 'background') {
      console.log(type);
      console.log(module.exports.backgroundImageFile);
      if (fs.existsSync('./' + module.exports.backgroundImageFile)) {
        console.log('it exists!');
      } else {
        statusCode = 404;
        res.statusMessage = 'background'
      }
      // http://127.0.0.1:3000/background.jpg
      //if image not found
        //404 error
    }

  }
  res.writeHead(statusCode, headers);
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};
