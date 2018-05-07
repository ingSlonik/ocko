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
        host: "codebook.cz",
        path: "/",
        timeout: 720,
        response: { statusCode: 200 },
        mails: [{ mail: "ing.fenix@seznam.cz" }, { mail: "jaroslav.klim@gmail.com"}],
    },
    {
        host: "sdjilm.cz",
        path: "/",
        timeout: 10,
        response: { statusCode: 200 },
        mails: [{ mail: "ing.fenix@seznam.cz" }, { mail: "jaroslav.klim@gmail.com"}],
    },
    {
        host: "sdjilm.cz",
        path: "/api/pagemenu/",
        timeout: 10,
        response: { statusCode: 200 },
        mails: [{ mail: "ing.fenix@seznam.cz" }, { mail: "jaroslav.klim@gmail.com"}],
        check: (body, response) => {
            try {
                const bodyInJson = JSON.parse(body);
                if (bodyInJson.statusCode === 401 && bodyInJson.error === "Api-Key Error") {
                    return [];
                }
            } catch (e) { }
            return ["Nase API nefunguje :("];
        }
    },
];

module.exports = configuration;