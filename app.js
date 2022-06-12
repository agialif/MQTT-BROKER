var mosca = require('mosca')
var express = require('express')
const Data = require('./model/data')
const mongo = require('mongoose')
const dotenv = require('dotenv')
var http = require('http');
dotenv.config();
var app = express()
var broker = http.createServer(app);
var setting = {
    http: {
        port: process.env.PORT || 1884,
        bundle: true,
        static: './'
    }
}

var broker = new mosca.Server(setting)

broker.on('ready', () => {
    console.log("Broker is up")
});

var db_url = process.env.DB_URL
    var connect = mongo.connect(db_url, {
    });

connect.then((db) => {
    console.log("Connection to MongoDB Success")
    },
    (err) => {
    console.log("Connection to MongoDB error; ", err)
    });

broker.on('published', (packet) => {
    message = packet.payload.toString();
    if(message.slice(0,1) != '{' && message.slice(0,4) == 'mqtt'){
        console.log(message)
    } else {
        payload = JSON.parse(packet.payload)
        console.log(payload)
        const data = new Data({
            data: payload.data,
            test: payload.test
        });
        data.save(function (err) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("data inserted")
            }
        })
    }
})
