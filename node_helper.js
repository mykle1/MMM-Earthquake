/* Magic Mirror
    * Module: MMM-Earthquake
    *
    * By Mykle1
    * 
    */
const NodeHelper = require('node_helper');
const request = require('request');
const parser = require('xml2js').parseString;
const fs = require('fs');


module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
    },
    
    getEarthquake: function(url) {
    	request({ 
    	          url: url,
    	          method: 'GET' 
    	        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                parser(body, (err, result)=> {
                    if(result.hasOwnProperty('xml')){
                    //    var result = JSON.parse(JSON.stringify(result.xml.channel[0].item[0]));
						var result = JSON.parse(JSON.stringify(result));
						console.log(result + response.statusCode);
                        this.sendSocketNotification("EARTHQUAKE_RESULT", result);
                    }
                });
            }
       });
    },

    //Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_EARTHQUAKE') {
                this.getEarthquake(payload);
            }
         }  
    });
