const http = require('http');
const fs = require('fs');
const path = require('path');

// const hostname = 'localhost';
const hostname = '54.197.73.76';
const port = 3001;

const server = http.createServer((req, res) => {
    console.log();
    console.log('Request for ' + req.url + ' by method ' + req.method);

    if (req.method == 'GET') {
        var fileUrl;
        if (req.url == '/') fileUrl = '/Home.html';
        else fileUrl = req.url;
        fileUrl = fileUrl.includes("?") ? fileUrl.substring(0, fileUrl.indexOf("?")) : fileUrl;
        var filePath = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filePath);
        console.log("fileExt", fileExt + ",", "fileUrl", fileUrl + ",", "req.url", req.url);
        if (fileExt == '.html') {
            let exists = fs.existsSync(filePath);
            if (!exists) {
                console.log("Error on .html, !exists");
                filePath = path.resolve('./public/404.html');
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                fs.createReadStream(filePath).pipe(res);
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filePath).pipe(res);
        } else if (fileExt == '.css') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/css');
            fs.createReadStream(filePath).pipe(res);
        } else if (fileExt == '.js') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/javascript');
            fs.createReadStream(filePath).pipe(res);
        } else {
            console.log("Error on fileExt, else");
            filePath = path.resolve('./public/404.html');
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(filePath).pipe(res);
        }
    } else {
        console.log("Error on req.method, else");
        filePath = path.resolve('./public/404.html');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(res);
    }
});


server.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});