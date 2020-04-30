let axios = require('axios');

let helper = require('./helper');

let config = require('../config/');
let PouchDB = require('pouchdb');
const settings = config.viana.settings;

const local_watcher = new PouchDB('http://localhost:5984/watchers');
const local_ots = new PouchDB('http://localhost:5984/ots');


    
exports.addWatcherEvents = addWatcherEvents;

function addWatcherEvents(data){
    data['device_timestamp'] = helper.getUTCTimestamp();
    return local_watcher.post(data)
    .catch(function(error) {
        return Promise.reject(error);
    })
};

function addOtsCount(data){
    data['device_timestamp'] = helper.getUTCTimestamp();
    return local_ots.post(data)
    .catch(function(error) {
        return Promise.reject(error);
    })
};

exports.addOtsCount = addOtsCount;

function set_config(data){
    data['sub_id'] = settings.sub_id;
    data['network_id'] = settings.network_id;
    data['site_id'] = settings.site_id;
    //feeder details
    let feeders = config.viana.feeders;
    if(feeders){
        let feeder = feeders.find(f=>f.cam_id==data.cam_id);
        data['location_id'] = feeder.location_id;
        data['device_id'] = feeder.device_id;
        data['feeder_id'] = feeder.feeder_id;

    }
    data['device_timestamp'] = helper.getUTCTimestamp();

}

