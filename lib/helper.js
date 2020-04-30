const moment = require('moment');
const fs = require('fs');
const path = require("path");



exports.getUTCTimestamp = function () {
    return moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
};

exports.getHeartbeat = function () {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, "../config/heartbeat.json"), 'utf8', (err, content) => {
            if(err) {
                console.log(err);
                reject(null);
            } 
            else {
                try {
                    resolve(JSON.parse(content));
                } catch(err) {
                    console.log(err);
                    reject(null);
                }
            }
        })
    });

};

exports.getCameras = function () {
    return new Promise((resolve, reject) => {
        fs.readFile(path.resolve(__dirname, "../config/cameras.json"), 'utf8', (err, content) => {
            if(err) {
                console.log(err);
                reject(null);
            } 
            else {
                try {
                    resolve(JSON.parse(content));
                } catch(err) {
                    console.log(err);
                    reject(null);
                }
            }
        })
    });

};