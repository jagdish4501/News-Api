import http from 'http';
import fs from 'fs';
import { makeApiRequest } from './ApiReq.js';
import compile from './compiler/compiler.js';
const PORT = 5000;

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Connection with cross Origin are enbled' }));
    }
    else if (req.url.match(/\/api\/everything/) && req.method === 'GET') {
        makeApiRequest('everything', req, res);
    } else if (req.url.match(/\/api\/top-headlines/) && req.method === 'GET') {
        makeApiRequest('top-headlines', req, res);
    } else if (req.url.match(/\/api\/compile/) && req.method === 'POST') {
        compile(req, res)
    }
    else {
        try {
            fs.readFile('page_404.html', (err, data) => {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end();
            });
        } catch (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('Something Unexpected Happened');
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
