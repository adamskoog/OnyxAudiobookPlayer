const express = require('express');
const path = require("path");
//const fs = require("fs");
    
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3001;
const urlBase = proces.env.BASE_URL || '';

// Now we can fire up our express web server.
const app = express();
app.set('trust proxy', true);

// Utilize the build directory for the application
app.use(express.static(path.join(__dirname, 'build')));

// Start up the server
app.listen(port, host);
console.log(`Listening on port ${port} with host ${host}`);