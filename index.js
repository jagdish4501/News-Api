import http from 'http';
import axios from 'axios'
const PORT = 5000;
import { index, getQerry } from './Util.js';
import 'dotenv/config'
const API_KEY = [process.env.API_KEY1, process.env.API_KEY2, process.env.API_KEY3, process.env.API_KEY4, process.env.API_KEY5]

let hit = 0, globalHit = 0;
const memo = {}
const ExpireTime = 1000 * 60 * 30;
console.log(ExpireTime)

const server = http.createServer(async (req, res) => {
    globalHit++;
    let q = getQerry(req.url)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    console.log("Hit On our Api: ", globalHit, ", hit: ", hit, ", API_KEY index :", index(hit))
    if (req.url.match(/\/api\/everything/) && req.method === "GET") {
        let url = 'https://newsapi.org/v2/everything?apiKey=' + API_KEY[index(hit)]
        try {
            url = url + '&' + q
            q += 'everything'
            if (!memo[q]) {
                hit = (hit + 1) % 250
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
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error.message, cause: error.name }));
        }
    } else if (req.url.match(/\/api\/top-headlines/) && req.method === "GET") {
        let url = 'https://newsapi.org/v2/top-headlines?apiKey=' + API_KEY[index(hit)]
        try {
            url = url + '&' + q
            q += 'top-headlines'
            if (!memo[q]) {
                hit = (hit + 1) % 250
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
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error.message, cause: error.name }));
        }
    }
    // If no route present
    else {
        console.log("Invalind route Hit")
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});


server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});

