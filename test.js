async function fetchData() {
    const url = `http://localhost:5000/api/everything?q=bitcoin`;
    // const url = `https://newsapi.org/v2/everything?apiKey=30ea0ceca22b42958b4d2fba9a800165`;
    const data = await fetch(url);
    const parsData = await data.json();
    console.log(parsData)
}

fetchData()