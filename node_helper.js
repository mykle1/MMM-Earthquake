/* Magic Mirror
    * Module: MMM-Earthquake
    *
    * By Mykle1
    * 
    */
const NodeHelper = require('node_helper');
const request = require('request');
const parser = require('xml2js').parseString;


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
						var result = JSON.parse(JSON.stringify(result.xmlresponse));
				//		console.log(result); // shows my data
				//		console.log(response.statusCode); // shows statusCode Ex 200
                        this.sendSocketNotification("EARTHQUAKE_RESULT", result);
                   
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
