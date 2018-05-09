// @flow

const fs = require('fs');
const http = require('http');
const sendmail = require('sendmail')({ silent: true });

/*::
export type Configuration = {
    host: string,
    path?: string,
    // time delay to next check [min]
    timeout: number,
    // deep compare of http response
    response?: { [keyOfResponse: string]: mixed },
    mails: Array<{
        // default false
        sentSuccess?: boolean,
        // default true
        sentErrors?: boolean,
        mail: string,
    }>,
    // returned array of errors to sent by mail
    check?: (body: string, response: HttpResponse) => Array< string >
};
*/

function deepEqual(originalObject, compareObject) {
    for (const key in compareObject) {
        const value = compareObject[key];
        if (typeof value === "object") {
            if (!deepEqual(originalObject[key], value)) {
                return false;
            }
        } else {
            if (value !== originalObject[key]) {
                return false;
            }
        }
    }
    return true;
}

function test(conf /*: Configuration */) {
    const { host, path, check, response, mails } = conf;
    const url = `${host}${path ? path : ""}`;

    console.log(`Send request to: "${url}".`);

    http.get({ host, path }, httpResponse => {
        let body = '';
        httpResponse.on('data', d => body += d);
        httpResponse.on('end', () => {

            let errors = [];

            if (response) {
                if (!deepEqual(httpResponse, response)) {
                    errors.push(`Response is not equal as "${JSON.stringify(response)}".`);
                }
            }

            if (check) {
                const checkErrors = check(body, httpResponse);
                for (const value of checkErrors) {
                    errors.push(value);
                }
            }

            if (errors.length < 1) {
                // Success
                console.log(`"${url}" is OK. :)`);

                const mailsToSend = mails.filter(mail => mail.sentSuccess === true).map(mail => mail.mail).join(", ");
                if (mailsToSend) {
                    sendmail({
                        from: 'no-reply@codebook.com',
                        to: mailsToSend,
                        subject: `Fílovo očko [${url}] | Error!`,
                        html: `<h2>To "${url}" was errors:</h2>${errors.map(e => `<p>${e}</p>`).join("")}`,
                    }, function (err, reply) {
                        if (err) {
                            console.log(err && err.stack);
                        } else {
                            console.log(`Success mail was sent to ${mailsToSend}.`);
                        }
                    });
                }
            } else {
                // Error
                const mailsToSend = mails.filter(mail => mail.sentErrors !== false).map(mail => mail.mail).join(", ");
                if (mailsToSend) {
                    sendmail({
                        from: 'no-reply@codebook.com',
                        to: mailsToSend,
                        subject: `Fílovo očko [${url}]`,
                        html: `<h2>To "${url}" was errors:</h2>${errors.map(e => `<p>${e}</p>`).join("")}`,
                    }, function (err, reply) {
                        if (err) {
                            console.log(err && err.stack);
                        } else {
                            console.log(`Mails with errors was sent to ${mailsToSend}.`);
                        }
                    });
                }
            }

            setTimeout(() => test(conf), conf.timeout * 100 * 60);
        });
    });
}

module.exports = function ocko(configurationPath /*: string */) {
    if (!fs.existsSync(configurationPath)) {
        console.log(`The file with configuration "${configurationPath}" doesn't exist.`);
    } else {
        const configuration = require(configurationPath);
        configuration.forEach(conf => test(conf));
    }
}
