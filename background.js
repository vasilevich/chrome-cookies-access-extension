/**
 * get currently active tab
 * @returns {Promise<unknown>}
 */
const getCurrentTab = () => new Promise(resolve => {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabArray) {
        resolve(tabArray[0]);
    });
});
/**
 * get all the cookies of the chosen domain
 * @param domain
 * @returns {Promise<unknown>}
 */
const getCookies = async (domain) => {
    domain = domain || new URL((await getCurrentTab()).url).hostname;
    return new Promise(resolve => chrome.cookies.getAll({domain}, (cookies) => resolve(cookies)));
};

/**
 * inject script into the web page, to allow the scripts to fetch cookies
 * @returns {Promise<void>}
 */
async function injectScriptIntoWebPage() {
    const tab = await getCurrentTab();
    chrome.tabs.executeScript(tab.id, {
        code: `
    const script = document.createElement("script");
    script.innerHTML = \`
    const extensionId = '${chrome.runtime.id}';
    const mergeCookiesArray = cookiesArray => cookiesArray.map(({name, value}) =>[name,value].join('=') ).join(';')
    const getAllCookies = (domains) => {
        return new Promise(resolve=> chrome.runtime.sendMessage(extensionId, {domains}, resolve));
    };
    const getAllCookiesSerialized = async (domains) => {
           const allCookies = await getAllCookies(domains);
           for(const key of Object.keys(allCookies)){
                allCookies[key] = mergeCookiesArray(allCookies[key]);
           }
           return allCookies;
    };
    const getFirstCookieSerialized = async (domains) => {
           return (await getAllCookiesSerialized(domains))[domains[0]];
    };
    
    window.getAllCookies = getAllCookies;
    window.getAllCookiesSerialized = getAllCookiesSerialized;
    window.getFirstCookieSerialized = getFirstCookieSerialized;
    
    \`;
    document.head.appendChild(script);
    `
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        // do your things
        injectScriptIntoWebPage();
    }
})


chrome.runtime.onMessageExternal.addListener(async function (message, sender, sendResponse) {
    Promise.all(message.domains.map((domain) => {
        return getCookies(domain)
            .then(cookies => ({domain, cookies}));
    }))
        .then(cookies => {
            const r = {};
            for (const cookie of cookies) {
                r[cookie.domain] = cookie.cookies;
            }
            return sendResponse(r);
        });

    return true;
});