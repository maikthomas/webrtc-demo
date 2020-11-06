import EventEmitter from 'eventemitter3';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { openSocket } from './signalling';
import { start } from './webrtc';

const eventEmitter = new EventEmitter();

const mountNode = document.getElementById('app');
ReactDOM.render(<App eventEmitter={eventEmitter} />, mountNode);
start(openSocket(), eventEmitter);
