# OČKO 

Očko **[otʃko]** is a tool for checking your websites or http applications.

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

### Example of a statement to the console:
```
Check "sdjilm.cz/api/pagemenu":
    ✓ The property "statusCode" of request is equal with defined: 200.
    ✓ Response is JSON.
    ✓ My API is o.k. ;-)

Check "google.cz/":
    ✘ The property "statusCode" of request is not equal with defined. Defined: 200, response: 301.
    ! Mails with errors is sanding to xxx@xxx.com.

Check "github.com/":
    ✘ The property "statusCode" of request is not equal with defined. Defined: 200, response: 301.
    ! Mails with errors is sanding to xxx@xxx.com.
```

### Example of received e-mail:

```
The checking of "github.com/" caused following errors:
  ✘ The property "statusCode" of request is not equal with defined. Defined: 200, response: 301.
```