import http from 'http';
import axios from 'axios'
import fs from 'fs'
const memo = {}
const PORT = 5000;
import { index, getQerry } from './Util.js';
import 'dotenv/config'
const API_KEY = [process.env.API_KEY1, process.env.API_KEY2, process.env.API_KEY3, process.env.API_KEY4, process.env.API_KEY5]

let hit = 0, globalHit = 0;
const ExpireTime = 1000 * 60 * 30;

setInterval(() => { hit = 0 }, (ExpireTime * 2 * 24));

const server = http.createServer(async (req, res) => {
    globalHit++;
    let q = getQerry(req.url)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    console.log("Hit On our Api: ", globalHit, ", hit: ", hit, ", API_KEY index :", index(hit))

    if (req.url.match(/\/api\/everything/) && req.method === "GET") {
        let url = 'https://newsapi.org/v2/everything?apiKey=' + API_KEY[index(hit)]
        url = url + '&' + q
        q += 'everything'
        try {
            if (!memo[q]) {
                hit = (hit + 1) % 250
                console.log(url)
                var respose = await axios.get(url);
                memo[q] = {
                    data: respose.data,
                    id: setTimeout(() => { delete memo[q]; console.log('key ', q, " Expired") },
                        ExpireTime)
                }
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(memo[q].data))
        } catch (error) {
            if (error.request.res.statusCode === 429)
                hit = (index(hit) + 1) * 51;
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error.request.res.statusMessage }));
        }


    } else if (req.url.match(/\/api\/top-headlines/) && req.method === "GET") {
        let url = 'https://newsapi.org/v2/top-headlines?apiKey=' + API_KEY[index(hit)]
        url = url + '&' + q
        q += 'top-headlines'
        try {
            if (!memo[q]) {
                hit = (hit + 1) % 250
                console.log(url)
                const respose = await axios.get(url);
                memo[q] = {
                    data: respose.data,
                    id: setTimeout(() => { delete memo[q]; console.log('key ', q, " Expired") },
                        ExpireTime)
                }
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(memo[q].data))

        } catch (error) {
            if (error.request.res.statusCode === 429)
                hit = (index(hit) + 1) * 51;
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error.request.res.statusMessage }));
        }
    }

    // If no route present
    else {
        try {
            fs.readFile('page_404.html', function (err, data) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.write(data);
                return res.end();
            });
        } catch (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write("somthing Unexpected Happen");
        }

    }

});


server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

