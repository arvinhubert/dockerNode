let helper = require('./helper');

let firebase = require('firebase-admin');
let config = require('../config/');
console.log({config})
const settings = config.viana.settings;
const firebaseConfig = {
    credential: firebase.credential.applicationDefault(),
    apiKey: settings.apiKey,
    authDomain: settings.authDomain,
    databaseURL: settings.databaseURL,
    projectId: settings.projectId,
    storageBucket: settings.storageBucket,
    messagingSenderId: settings.messagingSenderId,
    appId: settings.appId
  };

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
db.settings({timestampsInSnapshots: true});

let watcher_events_collection = db.collection(config.viana.firebase.watcher_events),
    ots_events_collection = db.collection(config.viana.firebase.ots_events)

//globals
let _heartbeatData = null;

exports.addWatcherEvents = addWatcherEvents;

function addWatcherEvents(data){
    if(!data.sub_id && !data.network_id  && !data.site_id && !data.device_id && !data.location_id && !data.feeder_id ){
        return Promise.reject("No feeder data");
    }
    else{
        data['device_timestamp'] = helper.getUTCTimestamp();
        data['date_created'] = firebase.firestore.FieldValue.serverTimestamp();
        return watcher_events_collection.add(data).then(function(docRef) {
            return Promise.resolve(docRef);
        })
        .catch(function(error) {
            return Promise.reject(error);
        })
    }

};

exports.addOtsCount = addOtsCount;
function addOtsCount(data){
    if(!data.sub_id && !data.network_id  && !data.site_id && !data.device_id && !data.location_id && !data.feeder_id ){
        return Promise.reject("No feeder data");
    }
    else{
        data['device_timestamp'] = helper.getUTCTimestamp();
        data['date_created'] = firebase.firestore.FieldValue.serverTimestamp();
        return ots_events_collection.add(data).then(function(docRef) {
            return Promise.resolve(docRef);
        })
        .catch(function(error) {
            return Promise.reject(error);
        })
    }

};

exports.addAudienceStats = addAudienceStats;
function addAudienceStats(data){
    if(!data.sub_id){
        return Promise.reject("No feeder data");
    }
    else{
        return audience_stats_collection.add(data).then(function(docRef) {
            return Promise.resolve(docRef);
        })
        .catch(function(error) {
            return Promise.reject(error);
        })
    }

};

exports.addAudienceCurrent = addAudienceCurrent;
function addAudienceCurrent(data){
    if(!data.sub_id){
        return Promise.reject("No feeder data");
    }
    else{
        return audience_current_collection.add(data).then(function(docRef) {
            return Promise.resolve(docRef);
        })
        .catch(function(error) {
            return Promise.reject(error);
        })
    }

};


function set_config(data){
    data['device_timestamp'] = helper.getUTCTimestamp();
    data['date_created'] = firebase.firestore.FieldValue.serverTimestamp();

}
