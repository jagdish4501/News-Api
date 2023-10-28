async function fetchData() {
    const url = `http://localhost:5000/api/everything?q=bitcoin`;
    // const url = `http://localhost:5000/api/everything?q=modi&pageSize=12`;
    // const url = `http://localhost:5000/api/everything?q=bitcoin&pageSize=5`;
    // const url = `https://newsapi.org/v2/everything?apiKey=30ea0ceca22b42958b4d2fba9a800165`;
    const data = await fetch(url);
    const parsData = await data.json();
    console.log(parsData.articles.length)
}

fetchData()