import http from 'http';
import axios from 'axios'
const PORT = 5000;
import { myFunction, index } from './Util.js';
import 'dotenv/config'
const API_KEY = process.env.API_KEY.replace(/[\[\]']/g, '').split(',')
let hit = 0;
const memo = {}

const server = http.createServer(async (req, res) => {
    const filter = myFunction(req.url)
    console.log(filter, hit = hit % 250, index(hit))
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.url.match(/\/api\/everything/) && req.method === "GET") {
        let url = 'https://newsapi.org/v2/everything?apiKey=' + API_KEY[3]
        try {
            let q = ''
            for (let key of Object.keys(filter))
                q = q + '&' + key + '=' + filter[key]
            url += q
            q += 'everything'
            if (!memo[q]) {
                const respose = await axios.get(url);
                memo[q] = respose.data
                hit++;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(memo[q]))

        } catch (error) {
            console.error('Error fetching data:', error);
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Error se" }));
        }
    } else if (req.url.match(/\/api\/top-headlines/) && req.method === "GET") {
        let url = 'https://newsapi.org/v2/top-headlines?apiKey=' + API_KEY[index(hit)]
        try {
            let q = ''
            for (let key of Object.keys(filter))
                q = q + '&' + key + '=' + filter[key]
            url += q
            q += 'top-headlines'
            if (!memo[q]) {
                const respose = await axios.get(url);
                memo[q] = respose.data
                hit++;
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(memo[q]))

        } catch (error) {
            console.error('Error fetching data:', error);
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
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

