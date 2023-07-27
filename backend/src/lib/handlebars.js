const { format} = require('timeago.js');

const helpers ={};

helpers.timeago = (timestamp) => {
    console.log(`timeago: ${timestamp}`); 
    return format(timestamp);
  };
  
module.exports = helpers;