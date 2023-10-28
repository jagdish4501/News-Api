const myFunction = (url) => {
    const regex = /[?&](searchIn|excludeDomains|q|page|category|country|pageSize|from|to|sortBy|language)=([^&]+)/g;
    const attributes = {};
    let match;
    while ((match = regex.exec(url)) !== null) {
        attributes[match[1]] = match[2];
    }
    return attributes
}

const index = (hit) => {
    let temp = 50;
    for (let i = 0; i < 100; i++) {
        if (hit < temp)
            return i;
        temp += 50
    }
    return 0;
}

const a = 1;
export { myFunction, index };