import optionsStorage from './options-storage.js';

// initialisation function
async function init() {

    // load settings
    const options = await optionsStorage.getAll();

    // if username or password are empty, open options page
    if (options.username === '' || options.password === '') {
        chrome.runtime.openOptionsPage();
    }

    // create context menu
    chrome.contextMenus.create({
        id: 'EasynewsSearcherContextMenu',
        title: 'Download NZB from Easynews',
        contexts: ['link']
    });

    // add context menu listener
    chrome.contextMenus.onClicked.addListener(function(info, tab) {

        // check if clicked link is a NZBLNK link
        if (info.hasOwnProperty('linkUrl') && info.linkUrl.startsWith('nzblnk')) {

            // extract titel, header and password from NZBLNK
            const results = info.linkUrl.matchAll(/(?:(?:h=(?<header>[^&]*)|t=(?<title>[^&]*)|p=(?<password>[^&]*))(?:&|$))+?/ig);
            let nzblnk = {};
            for (let result of results) {
                nzblnk.title = result.groups.title ? result.groups.title : nzblnk.title;
                nzblnk.header = result.groups.header ? result.groups.header : nzblnk.header;
                nzblnk.password = result.groups.password ? result.groups.password : nzblnk.password;
            }

            // start the search
            searchNZB(nzblnk);
            notification(`Search for header "${nzblnk.header}" started.`)
        }
    });

}

// function to search the header on the easynews web search
async function searchNZB({ title, header, password}) {

    // load settings
    const options = await optionsStorage.getAll();
    
    // construct the header with authentication
    const headers = { 'Authorization' : `Basic ${btoa(`${options.username}:${options.password}`)}` };
    
    // fetch the results
    const url = `https://members.easynews.com/2.0/search/solr-search/?fly=2&sbj=${header}&pby=1000&pno=1&s1=nsubject&s1d=%2B&s2=nrfile&s2d=%2B&s3=dsize&s3d=%2B&sS=0&st=adv&safeO=0&sb=1`;
    const response = await fetch(url, {
        credentials: 'same-origin',
        headers : new Headers(headers),
     });

     // check the response
     if (response.status === 401) {
        notification(`ERROR: Authentication failed. Please check your username and password.`)
     } else if (response.status === 200) {
        let data;
        try {
            data =  (await response.json()).data;
        } catch (e) {
            notification(`ERROR: Cannot read response from Easynews.`)
        }
        let results = {};

        // loop through the search results
        for (let item of data) {

            // generate a hash of the base filename and the poster name
            const basefilename = item[10].match(/^([^\.]*?)(?:\.|$)/im)[1];
            const hash = await digestMessage(basefilename + item[7]);

            // group results belonging together based on the hash
            if (!results.hasOwnProperty(hash)) {
                results[hash] = new Array;
            }
            results[hash].push(item)
        }

        // if there are results get the NZB file of first result
        if (Object.keys(results).length >= 1) {
            getNZB({ title, header, password}, results[Object.keys(results)[0]])
        } else {
            notification(`ERROR: Easynews returned no results.`)
        }
    } else {
        notification(`ERROR: Unknown error while connectiong to easynews to search for the header.`)
    }

}

// function to load the NZB file from the easynews web search
async function getNZB({ title, header, password}, data) {

    // load settings
    const options = await optionsStorage.getAll();

    // generate the body
    let body = 'autoNZB=1';
    for (const [key, item] of Object.entries(data)) {
        body += `&${key}%26sig%3D${encodeURIComponent(item.sig)}=${encodeURIComponent(item[0])}`;
    }

    // construct the header with authentication and correct content type
    const headers = { 
        'Authorization' : `Basic ${btoa(`${options.username}:${options.password}`)}`,
        'Content-Type' : 'application/x-www-form-urlencoded',
    };

    // fetch the NZB file
    const url = `https://members.easynews.com/2.0/api/dl-nzb`;
    const response = await fetch(url, {
        credentials: 'same-origin',
        headers : new Headers(headers),
        method: "post",
        body: body,
    });

    // check the response
    if (response.status === 401) {
        notification(`ERROR: Authentication failed. Please check your username and password.`)
    } else if (response.status === 200) {
        let nzbfile = await response.text();
        saveNZB({ title, header, password}, nzbfile)
    } else {
        notification(`ERROR: Unknown error while connecting to easynews to download the NZB file`)
    }
}

// function to save the NZB file to the harddisk
async function saveNZB({ title, header, password}, nzbfile) {

    // construct the filename
    let filename = await processTitle(title);
    if (password && password !== "") {
        if (!/[\/\\%*:"?~<>*|]/.test(password)) {
            filename += "{{" + password + "}}";
        }
    }
    filename += ".nzb";

    // save the file
    chrome.downloads.download({
        url: `data:text/nzb,${nzbfile}`,
        filename: filename,
        conflictAction: "uniquify"
    });

}

// function to process the titel
async function processTitle(title) {

    // load settings
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

// function to create the browser notifications
function notification (message) {
    chrome.notifications.create("EasynewsSearcherNotification_"+Math.floor(Math.random() * 100000), {
        type: "basic",
        iconUrl: "icon.png",
        title: "Easynews Searcher",
        message: message
    });
}

// function to generate a SHA-1 hash
async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                             // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);               // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                       // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

// run the script
init();