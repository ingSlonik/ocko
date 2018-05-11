// @flow

const fs = require('fs');
const http = require('http');
const chalk = require('chalk');
const sendmail = require('sendmail')({ silent: true });

/*::
export type Configuration = {
    host: string,
    path?: string,
    // time delay to next check [min]
    timeout: number,
    // deep compare of http response
    response?: { [keyOfResponse: string]: mixed },
    mailFrom: string,
    mails: Array<{
        // default false
        sentSuccess?: boolean,
        // default true
        sentErrors?: boolean,
        mail: string,
    }>,
    // returned array of errors to sent by mail
    check?: (body: string, response: HttpResponse) => { 
        successes: Array< string >, 
        errors: Array< string >
    }
};
*/

function deepEqual(originalObject, compareObject) /*: { successes: Array< string >, errors: Array< string > } */ {
    let errors = [];
    let successes = [];

    for (const key in compareObject) {
        const value = compareObject[key];
        if (typeof value === "object") {
            const checkResult = check(body, httpResponse);
            checkResult.errors.forEach(error => errors.push(error));
            checkResult.successes.forEach(success => successes.push(success));
        } else {
            if (value !== originalObject[key]) {
                errors.push(`The property "${key}" of request is not equal with defined. Defined: ${JSON.stringify(value)}, response: ${originalObject[key]}.`);
            } else {
                successes.push(`The property "${key}" of request is equal with defined: ${JSON.stringify(value)}.`);
            }
        }
    }
    return { successes, errors };
}

function test(conf /*: Configuration */) {
    const { host, path, check, response, mailFrom, mails } = conf;
    const url = `${host}${path ? path : ""}`;

    http.get({ host, path }, httpResponse => {
        let body = '';
        httpResponse.on('data', d => body += d);
        httpResponse.on('end', () => {

            let errors = [];
            let successes = [];

            if (response) {
                const checkResult = deepEqual(httpResponse, response);
                checkResult.errors.forEach(error => errors.push(error));
                checkResult.successes.forEach(success => successes.push(success));
            }

            if (check) {
                const checkResult = check(body, httpResponse);
                checkResult.errors.forEach(error => errors.push(error));
                checkResult.successes.forEach(success => successes.push(success));
            }

            // show in console
            console.log(`\nCheck "${url}":`);
            successes.forEach(success => console.log(`    ${chalk.green("✓")} ${chalk.gray(success)}`));
            errors.map(error => console.log(`    ${chalk.red("✘")} ${chalk.gray(error)}`));

            if (errors.length < 1) {
                // success
                const mailsToSend = mails.filter(mail => mail.sentSuccess === true).map(mail => mail.mail).join(", ");
                if (mailsToSend) {
                    console.log(`    ${chalk.yellow("!")} ${chalk.gray(`Success mail is sending to ${mailsToSend}.`)}`);
                    sendmail({
                        from: mailFrom,
                        to: mailsToSend,
                        subject: `Očko [${url}] | success`,
                        html: `<h2>The checking of "${url}" was successful:</h2>${successes.map(s => `<p><span style="color: green;">✓ </span> ${s}</p>`).join("")}`,
                    }, function (err, reply) {
                        if (err) {
                            console.log(err && err.stack);
                        }
                    });
                }
            } else {
                // error
                const mailsToSend = mails.filter(mail => mail.sentErrors !== false).map(mail => mail.mail).join(", ");
                if (mailsToSend) {
                    console.log(`    ${chalk.yellow("!")} ${chalk.gray(`Mails with errors is sanding to ${mailsToSend}.`)}`);
                    sendmail({
                        from: mailFrom,
                        to: mailsToSend,
                        subject: `Očko [${url}] | error`,
                        html: `<h2>The checking of "${url}" caused following errors:</h2>${errors.map(e => `<p><span style="color: red;">✘ </span> ${e}</p>`).join("")}`,
                    }, function (err, reply) {
                        if (err) {
                            console.log(err && err.stack);
                        }
                    });
                }
            }

            setTimeout(function () { test(conf) }, conf.timeout * 100 * 60);
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
