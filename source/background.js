import optionsStorage from './options-storage.js';

async function init() {
    const options = await optionsStorage.getAll();
    if (options.username === '' || options.password === '') {
        chrome.runtime.openOptionsPage();
    }
    chrome.contextMenus.create({
        id: 'NZBLContextMenu',
        title: 'Download with Easynews',
        contexts: ['link']
    });
    chrome.contextMenus.onClicked.addListener(function(info, tab) {
        if (tab) {
            if (info.hasOwnProperty('linkUrl') && info.linkUrl.startsWith('nzblnk')) {
                const results = info.linkUrl.matchAll(/(?:(?:h=(?<header>[^&]*)|t=(?<title>[^&]*)|p=(?<password>[^&]*))(?:&|$))+?/ig);
                let nzblnk = {};
                for (let result of results) {
                    nzblnk.title = result.groups.title ? result.groups.title : nzblnk.title;
                    nzblnk.header = result.groups.header ? result.groups.header : nzblnk.header;
                    nzblnk.password = result.groups.password ? result.groups.password : nzblnk.password;
                }
                searchNZB(nzblnk);
            }
        };
    });
}

async function searchNZB({ title, header, password}) {
    const options = await optionsStorage.getAll();
    const headers = { 'Authorization' : `Basic ${btoa(`${options.username}:${options.password}`)}` };
    const url = `https://members.easynews.com/2.0/search/solr-search/?fly=2&sbj=${header}&pby=1000&pno=1&s1=nsubject&s1d=%2B&s2=nrfile&s2d=%2B&s3=dsize&s3d=%2B&sS=0&st=adv&safeO=0&sb=1`;
    const response = await fetch(url, {
        credentials: 'same-origin',
        headers : new Headers(headers),
     });
     const data =  (await response.json()).data
     let results = {};
     for (let item of data) {
        const basefilename = item[10].match(/^([^\.]*?)(?:\.|$)/im)[1];
        const hash = await digestMessage(basefilename + item[7]);
        if (!results.hasOwnProperty(hash)) {
            results[hash] = new Array;
        }
        results[hash].push(item)
     }
     if (Object.keys(results).length >= 1) {
        getNZB({ title, header, password}, results[Object.keys(results)[0]])
     }
}

async function getNZB({ title, header, password}, data) {
    let body = 'autoNZB=1';
    for (const [key, item] of Object.entries(data)) {
        body += `&${key}%26sig%3D${encodeURIComponent(item.sig)}=${encodeURIComponent(item[0])}`;
    }
    const options = await optionsStorage.getAll();
    const headers = { 
        'Authorization' : `Basic ${btoa(`${options.username}:${options.password}`)}`,
        'Content-Type' : 'application/x-www-form-urlencoded',
    };
    const url = `https://members.easynews.com/2.0/api/dl-nzb`;
    const response = await fetch(url, {
        credentials: 'same-origin',
        headers : new Headers(headers),
        method: "post",
        body: body,
     });
    let nzbfile = await response.text();
    saveNZB({ title, header, password}, nzbfile)
}

async function saveNZB({ title, header, password}, nzbfile) {
    let filename = await processTitle(title);
    if (password && password !== "") {
        if (!/[\/\\%*:"?~<>*|]/.test(password)) {
            filename += "{{" + password + "}}";
        }
    }
    filename += ".nzb";
    //const url = `data:text/nzb,${nzbfile}`; 
    chrome.downloads.download({
        url: `data:text/nzb,${nzbfile}`,
        filename: filename,
        conflictAction: "uniquify"
    });
}

async function processTitle(title) {
    const options = await optionsStorage.getAll();

    // sanitize title
    title = title.replace(/[/\\?%*:|"<>\r\n\t\0\v\f\u200B]/g, "");

    // convert periods to spaces or vice versa
    switch (options.title) {
        case "periods":
            title = title.replace(/\s/g, ".");
            break;

        case "spaces":
            title = title.replace(/\./g, " ");
            break;
    }
    return title;

}

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                             // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);               // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                       // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

init();