const myFunction = (url) => {
    const regex = /[?&](searchIn|excludeDomains|q|page|category|country|pageSize|from|to|sortBy|language)=([^&]+)/g;
    const attributes = {};
    let match;
    while ((match = regex.exec(url)) !== null) {
        attributes[match[1]] = match[2];
    }
    return attributes
}

const getQerry = (url) => {
    const regex = /\?(.*)/;
    return url.match(regex) ? url.match(regex)[1] : '';
}

const getPath = (url) => {
    const regex = /\/(.*)/
    return url.match(regex) ? url.match(regex)[1] : '';
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

export { myFunction, index, getQerry, getPath };