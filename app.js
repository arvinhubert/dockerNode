
let env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
const http = require('http');
let helper = require("./lib/helper");

const hostname = process.env.HOST || '127.0.0.1';
const port_webserver = process.env.PORT || 6060;

// globals
let hearbeatInProgress = false;
const logger = require('./lib/logging');


function start(){
    logger.info('Start %s', 'receiver');
    prepareEnvironment()
    .then(async function(){
        //enable services specially quividi
        //startQuividi();
        pingHeartBeat();
        startWebServer();
        

    })
}



function prepareEnvironment(){
    
    return Promise.resolve();
}

function startWebServer(){
    
    logger.info('startWebServer');
    let webserver = http.createServer((req, res) => {
        let statusCode = 200;
        let data = {"status": true};
        endpoint = req.url;
        if(req.url != '/health'){
            statusCode = 404;
        }
        res.statusCode = statusCode;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));

    })
    
    webserver.listen(port_webserver, hostname, () => {
        console.log(`Server running at http://${hostname}:${port_webserver}/`)
    })
}

function pingHeartBeat(){
    logger.info('pingHeartBeat');
    if (hearbeatInProgress){
        return;
    }
    hearbeatInProgress = true;
    console.log('pingHeartBeat', new Date());
    helper.getHeartbeat()
    .then(heartbeatdata=>{
        hearbeatInProgress = false;
        setTimeout(pingHeartBeat, 60000);
    })
    .catch(err=>{
        console.error('pingHeartBeat heartbeat.json not found')
        logger.error('pingHeartBeat heartbeat.json not found');
        hearbeatInProgress = false;
        setTimeout(pingHeartBeat, 60000);
    })

}

start();