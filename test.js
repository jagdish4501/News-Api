async function fetchData() {
    const url = `http://localhost:5000/api/top-headlines?country=us&category=general&page=1&pageSize=12`;
    const data = await fetch(url);
    const parsData = await data.json();
    console.log(parsData)
}


fetchData()