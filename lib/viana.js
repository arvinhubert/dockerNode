let WebSocket = require('ws'),
    config = require('../config/'),
    helper = require('./helper'),
    service = require('./service'),
    local = require('./local'),
    logger = require('./logging');

    let audience = {};
//let attentionTimeThreshold = config.quividi.attentionTimeThreshold || 3;
let _heartbeatData = null;
let _cameras = null;
exports.start = start;
 
function start(opts){
    logger.info('start viana');
    helper.getCameras()
    .then(cams =>{
        _cameras = cams;
        connectViana();
    })

    function connectViana(){
        
        logger.info('connect viana');
        let ws = new WebSocket(opts.endpoint,{
            protocol: 'viana'
        });

        ws.on('open', function(){
            console.log('viana realtime service connected');
            logger.info('viana realtime service connected');
            ws.send('periodic');
        });
        ws.on('message', function (data, flags) {
            try {
                data = JSON.parse(data);
            } catch (err) {
                console.log(data)
                return;
            }
            if(data.watcher_event){
                set_config(data.watcher_event)
                if (data.watcher_event.status === 'left') {
                    logger.info('person left the screen');
                    console.log('person left the screen');
                    //send to local database
                    
                    local.addWatcherEvents(data.watcher_event)
                    .then(r => {
                        if(config.viana.pushToCloud === true){
                            return service.addWatcherEvents(data.watcher_event);
                        }
                        else{
                            return r;
                        }
                        
                    })    
                    .then(function(docRef) {
                        logger.info('add watcher event success');
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch(function(error) {
                        logger.error('add watcher event fail %s', error);
                        console.error("Error adding document: ", error);
                    })
        
                }
        
            }
            else if(data.ots_count){
                let counts = data.ots_count;
                let all = counts.map(count => {
                    set_config(count)
                    return local.addOtsCount(count)
                })
                Promise.all(all)
                .then(function(docRef) {
                    logger.info('lts count success');
                })
                .catch(function(error) {
                    logger.error('lts count fail %s', error);
                    console.error("Error", error);
                })
            }
            else if(data.ots_event){
                //set_config(data.ots_event)
                console.log("OTS_EVENT")
                let counts = data.ots_event;

                let all = counts.map(count => {
                    return service.addOtsCount(count)
                })
                Promise.all(all)
                .then(function(docRef) {
                    logger.info('lts event success');
                    console.log("Success ots_event");
                })
                .catch(function(error) {
                    logger.error('lts event fail %s', error);
                    console.error("Error", error);
                })
            }
        });
        
        ws.on('close', function () {
            logger.error('viana service disconnected');
            console.log('viana service disconnected');
        });
        
        ws.on('error', function (err) {
            
            logger.error('viana: %s', err.message);
            console.log('viana: ' + err.message);
        });
        
        ws.on('viana', function (data) {
            console.log('viana event: ' + data);
        });
    }
}

exports.setHeartBeatData = async function(heartbeatjson){
    _heartbeatData = heartbeatjson;
    
    _cameras = await helper.getCameras();


}
    
function set_config(data){
    if(!_heartbeatData){
        return;
    }
    if(!_cameras){
        return;
    }
    //feeder details
    let feeders = _heartbeatData.feeders;
    //find camera via index
    let camera = _cameras[data.cam_id];
    let feeder = feeders.find(f=>f.camera["Name"]==camera["Name"]);
    if(feeder){
        data['sub_id'] = _heartbeatData.sub_id;
        if(_heartbeatData.site_id){
            data['site_id'] = _heartbeatData.site_id;
            data['network_id'] = _heartbeatData.site.network_id;
        }
        data['location_id'] = feeder.location_id;
        data['device_id'] = feeder.device_id;
        data['feeder_id'] = feeder.id;
    }
    else{
        logger.error('No feeder data. local camera and viana camera did not matched');
        console.log("No feeder data. local camera and viana camera did not matched");
    }

}