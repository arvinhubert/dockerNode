const moment = require('moment');
const fs = require('fs');
const path = require("path");
const axios = require("axios");



exports.getUTCTimestamp = function () {
    return moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ');
};

exports.getHeartbeat = function () {
    return axios.get("http://localhost:5000/heartbeat.json");

};

exports.getCameras = function () {
    return axios.get("http://localhost:5000/cameras.json");

};