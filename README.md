# OČKO 

![OČKO](./img/ocko.png)

Očko **[otʃko]** is a tool for easy&lite checking your websites or http applications.

## Install

```
$ npm install -g ocko
```

## Create configuration file

```
$ ocko --init ./configuration.js
```

Update the file `./configuration.js`!

## Run

```
$ ocko ./configuration.js
```

## Use ocko in your node project

```javascript
const ocko = require('ocko');

ocko(configuration);
```

## Configuration

All configuration is in array. You can check all of your websites.

### `host`
A domain name or IP address of the server to issue the request to. 

**type:** string      
**example:** `google.com`

### `path`
It's behind the `host`.

**type:** string  
**default value:** `/`  
**example:** `/search?q=npm+ocko`

### `timeout`
Time delay to next check [`min`].

**type:** number  
**example:** `60`

### `response`
Object to deep compare with HttpResponse of node.

**type:** `{ [key: string]: mixed }`  
**default value:** `{ statusCode: 200 }`  

### `mailFrom`
Mail to send errors or/and successes.

**type:** string  
**example:** `xxx@gmail.com`

### `mails`
Mail to send errors or/and successes.

**type:** `Array<{ sentSuccess?: boolean, sentErrors?: boolean,mail: string }>`  
**default value:** `{ sentSuccess: false, sentErrors: true }`     
**example:** `[ { mail: "xxx@gmail.com" },  ]`

### `check`
Your own method to check 

**type:** `?(body: string, response: HttpResponse) => { successes: Array< string >, errors: Array< string > }`     
**example:** 
```javascript
(body) => {
    let errors = [];
    let successes = [];

    try {
        const bodyInJson = JSON.parse(body);
        if (bodyInJson.statusCode === 401) {
            successes.push("My API is o.k. ;-)");
        } else {
            errors.push("My API doesn't work :(");
        }
    } catch (e) { 
         errors.push("Response is not JSON.");
    }

    return { errors, successes };
}
```

## Examples

### Example of a statement to the console:
```
Check "github.com/":
    ✓ The property "statusCode" of request is equal with defined: 301.

Check "sdjilm.cz/api/pagemenu":
    ✓ The property "statusCode" of request is equal with defined: 200.
    ✓ Response is JSON.
    ✓ My API is o.k. ;-)

Check "google.cz/":
    ✘ The property "statusCode" of request is not equal with defined. Defined: 200, response: 301.
    ! Mails with errors is sanding to xxx@xxx.cz.
```

### Example of received e-mail:

```
The checking of "google.cz/" caused following errors:
    ✘ The property "statusCode" of request is not equal with defined. Defined: 200, response: 301.
```