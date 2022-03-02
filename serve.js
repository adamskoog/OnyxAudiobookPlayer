const express = require('express');
const path = require("path");
const fs = require("fs");
const yargs = require('yargs');

// First we need to parse our command line args.
const argv = yargs
    .option('port', {
        description: 'The port number to use - default: 3001',
        type: 'number'
    })
    .option('host', {
        description: 'The host ip/name - default: 127.0.0.1'
    })
    .help()
    .alias('help', 'h').argv;

    
const host = argv.host || '127.0.0.1';
const port = argv.port || 3001;

// Now we can fire up our express web server.
const app = express();
app.set('trust proxy', true);   //'127.0.0.1');

// Utilize the build directory for the application
app.use(express.static(path.join(__dirname, 'build')));

// Start up the server
app.listen(port, host);
console.log(`Listening on port ${port} with host ${host}`);