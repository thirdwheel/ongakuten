const fastcgi = require('node-fastcgi');
const fs = require('fs');
const url = require('url');
const request = require('sync-request');

const config = JSON.parse(fs.readFileSync('config.json'));

let REQUEST_GET='GET'
let REQUEST_POST='POST';

let route = {
    list: {
        methods: [REQUEST_GET],
        exec()
        {
            return [
                200,
                {},
                [
                    {
                        id: 1,
                        name: 'This is a song',
                        length: 183,
                        price: 4
                    },
                    {
                        id: 2,
                        name: 'This is also a song',
                        length: 143,
                        price: null
                    }
                ]
            ];
        }
    },
    login: {
        methods: [REQUEST_GET],
        exec()
        {

            return [400, {}, 'Not yet implemented.'];
        }
    }
};

let defaultHeaders={
    'Content-Type': 'application/json'
}

if (fs.existsSync(config.fastcgi.sock))
{
    fs.unlinkSync(config.fastcgi.sock);
}

fastcgi.createServer(function (req, res)
{
    let returnCode, headers, content;
    let params=url.parse(req.url, true);
    // Split url and then drop the first empty field
    let urlTest=params.pathname.split('/'); urlTest.shift();
    if (urlTest[0] == config.fastcgi.pathPrepend)
    {
        urlTest.shift();
    }
    while (urlTest.length > 0)
    {
        if (route[urlTest.join('/')] !== undefined)
        {
            let oRoute=route[urlTest.join('/')];
            if (oRoute.methods.indexOf(req.method) == -1)
            {
                console.log(req.url, req.method);
                throw_405(res);
                return;
            }
            [returnCode, headers, content] = route[urlTest.join('/')].exec(req);
            for (let sHeader in defaultHeaders)
            {
                if (headers[sHeader] === undefined)
                {
                    headers[sHeader]=defaultHeaders[sHeader];
                }
            }
            if (typeof content == 'object')
            {
                content=JSON.stringify(content);
            }
            headers['Content-Length']=content.length;
            res.writeHead(returnCode, headers);
            res.end(content);
            return;
        }
        urlTest.pop();
    }
    // Still here? Then this is the wrong place, this is FastCGI Total Landscaping.
    console.log(req.url);
    throw_404(res);
}).listen(config.fastcgi.sock);

fs.chmodSync(config.fastcgi.sock, 0o777);

function throw_405(res)
{
    res.writeHead(405, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: 'Method not allowed'}));
}
function throw_404(res)
{
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({error: 'Not Found'}));
}
