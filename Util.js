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

function plain2html(text) {
    text = (text || "");
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\t/g, "    ")
        .replace(/ /g, "&nbsp;")
        .replace(/\r\n|\r|\n/g, "<br />");
}

const a = 1;
export { myFunction, index, getQerry, getPath, plain2html };