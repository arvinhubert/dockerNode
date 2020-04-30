var WebS = require('ws')
let audience = {};
let ots_count_storage ={};
let attentionTimeThreshold = 3;
var ws = new WebS("ws://127.0.0.1:2974", {
    protocol: 'quividi'
});
let firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyDm6f2zWH2DWNr51LxNQp-jC4uSYVTCDDM",
    authDomain: "skunkworksph.firebaseapp.com",
    databaseURL: "https://skunkworksph.firebaseio.com",
    projectId: "skunkworksph",
    storageBucket: "skunkworksph.appspot.com",
    messagingSenderId: "102672368836",
    appId: "1:102672368836:web:acf1d8fa91f2fa9aefb591"
  };

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
db.settings({timestampsInSnapshots: true});
let watcher_events_collection = db.collection('watcher_events'),
    ots_count_collection = db.collection('ots_count');
ws.on('open', function (d) {
    console.log('quividi service connected');
    ws.send('periodic');
});

ws.on('message', function (data, flags) {
    try {
        data = JSON.parse(data);
    } catch (err) {
        return;
    }
    
    
    if(data.ots_count){
        ots_count_collection.add(data.watcher_event)
    }
    if(data.watcher_event){
        //person is on screen but not looking  
        data.watcher_event['date_created'] = firebase.firestore.FieldValue.serverTimestamp();
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
            watcher_events_collection.add(data.watcher_event).then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                
                watcher_events_collection.get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                    });
                });
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            })

        }
        else{
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
connectContentApi()
 function connectContentApi() {
        var wsx = new WebS("ws://127.0.0.1:2974", {
            protocol: 'quividicontent'
        });

        wsx.on('open', function () {
        });

        wsx.on('close', function () {
        });

        wsx.on('error', function (err) {

            this.close();
            wsx.close();
        });

        wsx.on('message', function (data, flags) {
           // console.log('quividicontent response: ' + data);
        });

        return wsx;
    }