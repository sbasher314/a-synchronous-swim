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
  let params = new URLSearchParams(req.url.split('?')[1]);
  let type = params.get('type')

  res.on('end', () => {
    next();
  })

  if (req.method === 'GET') {
    // randomize swim command
    res.type = 'cors';
    if (type === 'swim') {
      headers['Content-Type'] = 'text/plain';
      res.writeHead(200, headers);
      res.end(messageQueue.dequeue() ?? '');
    } else if (type === 'background' || req.url === '/background.jpg') {
      let path = ('./' + this.backgroundImageFile);
      if (fs.existsSync(path)) {
        headers['Cache-Control'] = 'no-store';
        headers['Content-Type'] = 'image/jpg';
        res.writeHead(200, headers);
        fs.createReadStream(path).pipe(res);
      } else {
        res.writeHead(404, headers);
        res.end('background not found');
      }
      // http://127.0.0.1:3000/background.jpg
      //if image not found
        //404 error
    } else if (req.url !== '/') {
      res.writeHead(404, headers);
      res.end('invalid path');
      next();
    }

  }
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  }

  if (req.method === 'POST') {
    let path = ('./' + this.backgroundImageFile);
    let chunks = Buffer.alloc(0);
    req.on('data', function(data) {
      chunks = Buffer.concat([chunks, data]);
    });
    req.on('end', () => {
      let file = multipart.getFile(chunks);
      let parse = multipart.parse(chunks);
      let boundary = multipart.getBoundary(chunks);
      console.log(file, parse, boundary);
      fs.writeFile(this.backgroundImageFile, file.data, (err) => {
        res.writeHead(err ? 400 : 200, headers);
        res.end();
        next();
      })
    });

    // req.data.get('file')

    // if file exists, delete it
    /*if (fs.existsSync(path)) {
      fs.unlink(path, function(err) {
        if (err) throw err;
        console.log('sucessfully deleted');
      });
    }


    let fd = fs.open(Buffer.from(path), 'w', function(err) {
      if (err) throw err;
      console.log('create success');

      });
    });

    req.on('data', function(data) {
      fs.appendFile(fd, data, function(err) {
        if (err) throw err;
        console.log('write success');
      };
      */

    req.on('end', function() {
      console.log('POSTed');
      res.writeHead(200, headers);
      res.end();
    })

  }


   // invoke next() at the end of a request to help with testing!
};

