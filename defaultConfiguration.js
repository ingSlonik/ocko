// @flow

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

const configuration /*: Array< Configuration > */ = [
    {
        host: "google.cz",
        path: "/",
        timeout: 10,
        response: { statusCode: 200 },
        mailFrom: "mymail@gmail.com",
        mails: [{ mail: "mymail@gmail.com"}],
        check: (body, response) => {
            let errors = [];
            let successes = [];

            try {
                const bodyInJson = JSON.parse(body);
                if (bodyInJson.statusCode === 401 && bodyInJson.error === "Api-Key Error") {
                    successes.push("My API is o.k. ;-)");
                } else {
                    errors.push("My API doesn't work :(");
                }
            } catch (e) { 
                errors.push("Response is not JSON.");
            }

            return { errors, successes };
        }
    },
];

module.exports = configuration;