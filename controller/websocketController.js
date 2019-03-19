"use strict";

const path = require('path');
const config = require('../config/config.json');

module.exports = (model) => {
    return (ws, broadcast) => {
        ws.on('message', (e) => {
            const data = JSON.parse(e);
            switch (data.type) {
                case 'ping':
                    ws.send(JSON.stringify({
                        type: 'pong',
                        payload: {
                            mails: mails
                        }
                    }));
                    break;

                default:
                    console.log('Unknown message type received: ', data.type);
            }
        });
    }
}