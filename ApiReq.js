import 'dotenv/config'
import axios from 'axios';
import { index, getQerry } from './Util.js';
const API_KEY = [process.env.API_KEY5, process.env.API_KEY2, process.env.API_KEY3, process.env.API_KEY4, process.env.API_KEY1]
console.log(API_KEY)
const memo = {};
let ExpireTime = 1000 * 60 * 30, hit = 0;
const makeApiRequest = async (endpoint, req, res) => {
    const q = getQerry(req.url);
    const url = `https://newsapi.org/v2/${endpoint}?apiKey=${API_KEY[index(hit)]}&${q}`;
    const memoKey = q + endpoint;
    try {
        console.log(url, hit)
        if (!memo[memoKey]) {
            hit = (hit + 1) % 250;
            console.log(url);
            let response = await axios.get(url);
            memo[memoKey] = {
                data: response.data,
                id: setTimeout(() => {
                    delete memo[memoKey];
                    console.log('key', memoKey, 'Expired');
                }, ExpireTime)
            };
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(memo[memoKey].data));
    } catch (error) {
        if (error.request.res.statusCode === 429) {
            hit = (index(hit) + 1) * 51;
        }
        console.log("res statusCode :", error.request.res.statusCode)
        console.log("res Message :", error.request.res.statusMessage)
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: error.request.res.statusMessage }));
    }
};

export { makeApiRequest }