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

### `url`
A url or IP address of the server to issue the request to. 

**type:** string      
**example:** `https://google.com`

### `timeout`
Time delay to next check [`min`].

**type:** number  
**example:** `60`

### `response`
Object to deep compare with HttpResponse of node.

**type:** `{ [key: string]: mixed }`  
**default value:** `{ statusCode: 200 }`  

### `mailFrom`
Mail from send errors or/and successes.

**type:** string  
**example:** `xxx@gmail.com`

### `mails`
Mails to send errors or/and successes.

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
2018-7-16 19:50:05 Check "http://github.com/":
    ✘ The property "statusCode" of request is not equal with defined. Defined: 200, response: 301.
    ! Mails with errors are being sent to xxx@xxx.com.

2018-7-16 19:50:10 Check "http://sdjilm.cz/api/pagemenu":
    ✓ The property "statusCode" of request is equal with defined: 200.
    ✓ Response is JSON.
    ✓ My API is o.k. ;-)

2018-7-16 19:50:12 Check "https://google.cz/":
    ✓ The property "statusCode" of request is equal with defined: 200.
```

### Example of received e-mail:

```
The checking of "http://github.com/" caused following errors:
    ✘ The property "statusCode" of request is not equal with defined. Defined: 200, response: 301.
```