# chrome-cookies-access-extension

## this extension use manifest v2, it allows you to access the cookies of the browser

Useful for making chrome-based scrapers, allowing your greesemonkey scripts to access ALL the cookies of the page if you
need for some odd reason...

## Features

- get all cookies by domain as an array
- get all cookies by domain serialized, ready to use in a fetch cookie header

## Installation

##### 1. make sure you got chromium-based-browser that still allows manifest v2

##### 2. clone the repo anywhere

##### 3. go to manage extensions

##### 4. enable dev mode

##### 5. load extension as a folder.

##### 6. Have a good day and enjoy!

## Example usage:

```js
    getAllCookies(['example1.com','example2.com'])
        .then(cookies=>{
            // contains cookies as an array for each of the selected domain {'example1.com':[...], 'example2.com':[...]}
            console.log(cookies);
        });
    getAllCookiesSerialized(['example1.com','example2.com'])
        .then(cookies=>{
            // contains cookies as a string for each of the selected domain, readdy for fetch use {'example1.com':'serialized cookie...', 'example2.com':'serialized cookie...'}
            console.log(cookies);
        });
    getFirstCookieSerialized(['example1.com','example2.com'])
        .then(cookie=>{
            // returns the first domain serialized, ready for fetch use 'serialized cookie ...'
            console.log(cookie);
        });        
```

## License

MIT