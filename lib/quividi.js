let WebSocket = require('ws'),
    config = require('../config/'),
    helper = require('./helper'),
    service = require('./local');

let audience = {};
let attentionTimeThreshold = config.quividi.attentionTimeThreshold || 3;

exports.start = start;

function start(opts){
    connectQuividi();

    function connectQuividi(){
        let ws = new WebSocket(opts.endpoint,{
            protocol: 'quividi'
        });

        ws.on('open', function(){
            console.log('quividi realtime service connected');
            
            ws.send('periodic');
        });
        ws.on('message', function (data, flags) {

            try {
                data = JSON.parse(data);
            } catch (err) {
                return;
            }
            if(data.watcher_event){
                //person is on screen but not looking
                if (data.watcher_event.status === '0x2') { 
                }
                //person is looking in the screen
                else if (data.watcher_event.status === '0x22') {
                    if(data.watcher_event){
                        //delete audience[data.watcher_event.watcher_id];
                    }
        
                    // Trigger if Attention attention time more than 3
                    if (data.watcher_event.attention_time && ( data.watcher_event.attention_time >= attentionTimeThreshold)) {
                        //send to database
                    }
                }
                //person left the screen
                else if (data.watcher_event.status === '0x3') {
                    console.log('person left the screen');
                    //send to database
                    service.addWatcherEvents(data.watcher_event).then(function(docRef) {
                        console.log("Document written with ID: ", docRef);
                    })
                    .catch(function(error) {
                        console.error("Error adding document: ", error);
                    })
        
                }
                else if(data.ots_count){
                    service.addOtsCount(data.ots_count);
                } else if (data.audience_stats) {
                    service.addAudienceStats(data.audience_stats);
                } else if (data.audience_current) {
                    service.addAudienceCurrent(data.audience_current);
                }
        
            }
        });
        
        ws.on('close', function () {
            console.log('quividi service disconnected');
        });
        
        ws.on('error', function (err) {
            console.log('quividi: ' + err.message);
        });
        
        ws.on('quividi', function (data) {
            console.log('quividi event: ' + data);
        });
    }
}
    