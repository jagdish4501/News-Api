import axios from 'axios'

async function fetchData() {
    const url = `https://newsapi.org/docs/endpoints`;
    let data = await axios.get(url);
    console.log(data.data)
}

fetchData()