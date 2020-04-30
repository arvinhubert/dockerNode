
module.exports = {
    "viana": {
        "enabled": true,
        "server": "ws://127.0.0.1:5050",
        "attentionTimeThreshold": 3,
        "settings": {
            "apiKey": "AIzaSyDe30ABF0fWo5a3wlxpqJ5pKILIa3uQ3tM",
            "authDomain": "ace-sector-251421.firebaseapp.com",
            "databaseURL": "https://ace-sector-251421.firebaseio.com",
            "projectId": "ace-sector-251421",
            "storageBucket": "ace-sector-251421.appspot.com",
            "messagingSenderId": "101701694836",
            "appId": "1:101701694836:web:3fb902a5bad8be46512821",
        },
        "pushToCloud": true,
        "firebase":{
            "watcher_events": "watcher_events_production",
            "ots_events": "ots_events_production"
        }
    },
    "receivers": {
        "enabled": true,
        "server": "ws://127.0.0.1:5050"
    },
    "quividi": {
        "enabled": false,
        "server": "ws://127.0.0.1:2974",
        "attentionTimeThreshold": 3
    },
    "HOST": '127.0.0.1',
    "PORT": 6060,


};
