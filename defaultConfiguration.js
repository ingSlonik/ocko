// @flow

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

const configuration /*: Array< Configuration > */ = [
    {
        host: "google.cz",
        path: "/",
        timeout: 10,
        response: { statusCode: 200 },
        mails: [{ mail: "mymail@gmail.com"}],
        check: (body, response) => {
            try {
                const bodyInJson = JSON.parse(body);
                if (bodyInJson.statusCode === 401 && bodyInJson.error === "Api-Key Error") {
                    return [];
                }
            } catch (e) { }
            return ["My API doesn't work :("];
        }
    },
];

module.exports = configuration;