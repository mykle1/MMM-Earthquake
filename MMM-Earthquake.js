 /* Magic Mirror
  * Module: MMM-Earthquake
  *
  * By Mykle1
  * 
  */
   
Module.register("MMM-Earthquake", {

       // Module config defaults.
       defaults: {
		   place: "New+York,+NY",  // New+York,+NY is default (follow this format)
	       radius: "50",           // 50km = 31.0686 miles (search radius)
		   days: "365",          // 365 is default within how many days (1 - 365)
		   mag: "2.5",           // Magnitude = 1.0 - 9.9 (9.5 highest ever recorded)
		   maxWidth: "400px",
           updateInterval: 60 * 60 * 1000, // every hour
           animationSpeed: 10,
           initialLoadDelay: 1875, // of module
           retryDelay: 1500,
        //   fadeSpeed: 7,
       },
       
       // Define required scripts.
    //   getScripts: function() {
    //       return ["moment.js"];
    //   },
       
       getStyles: function() {
           return ["MMM-Earthquake.css"];
       },

       // Define start sequence.
       start: function() {
           Log.info("Starting module: " + this.name);
           
           // Set locale.
           this.url = this.getUrl();
           this.today = "";
           this.scheduleUpdate();
       },
       
       

      getDom: function() {

         
         var eq = this.eq;
    //     var place = this.config.place;
	//	 var radius = this.config.radius;
	//	 var days = this.config.days;
	//	 var mag = this.config.mag;
		 
		 
         
         var wrapper = document.createElement("div");
         wrapper.className = "wrapper";
         wrapper.style.maxWidth = this.config.maxWidth;

         if (!this.loaded) {
         	 wrapper.classList.add("wrapper");        	 
             wrapper.innerHTML = "EARTHQUAKE!...";
             wrapper.className = "bright light small";
            return wrapper;
         }
        
         //var header = document.createElement("header");
        // header.classList.add("xsmall", "dimmed", "header");
        // header.innerHTML = "";
        // wrapper.appendChild(header);
		
         var top = document.createElement("div");
         top.classList.add("list-row");
		 
		 
        // Location (city)
         var place = document.createElement("div"); // div if span is no good
         place.classList.add("xsmall", "bright", "place");
         place.innerHTML = eq.place;
         top.appendChild(place);
		 
		 
		 
		// Latitude from response
         var lat = document.createElement("div");
         lat.classList.add("xsmall", "bright", "lat");
         lat.innerHTML = eq.lat;
         top.appendChild(lat);
		 
		 
		 
		// Longitude from response
         var lng = document.createElement("div");
         lng.classList.add("xsmall", "bright", "lng");
         lng.innerHTML = eq.lng;
         top.appendChild(lng);
		 
		 
		// Radius of search
         var radius = document.createElement("div");
         radius.classList.add("xsmall", "bright", "radius");
         radius.innerHTML = eq.radius; // <radius unit="km">100.000000</radius>
         top.appendChild(radius);
		 
		 
		// Within days
         var days = document.createElement("div");
         days.classList.add("xsmall", "bright", "days");
         days.innerHTML = eq.window; // <window unit="days">365</window>
         top.appendChild(days);
		 
		 
		// Magnitude
         var mag = document.createElement("div");
         mag.classList.add("xsmall", "bright", "mag");
         mag.innerHTML = eq.mag;
         top.appendChild(mag);
		 
		 
		// Rate of occurrence
         var rate = document.createElement("div");
         rate.classList.add("xsmall", "bright", "rate");
         rate.innerHTML = eq.rate;
         top.appendChild(rate);
		 
		 
		// Probability
         var prob = document.createElement("div");
         prob.classList.add("xsmall", "bright", "prob");
         prob.innerHTML = eq.prob;
         top.appendChild(prob);
		 
		 
		 
     // might not need this spacer
    //     var spacer = document.createElement("p");
    //     spacer.innerHTML = '';
    //     top.appendChild(spacer);
         

         wrapper.appendChild(top);
         return wrapper;

     },
     
     getUrl: function() {
       var url = null;
    //   var str = this.config.hScope;
    //   var hType = str.toLowerCase();
         var eq = this.eq;
         var place = this.config.place;
		 var days = this.config.days;
		 var mag = this.config.mag;
		 var radius = this.config.radius;
		 
		 
        
      if (place === "" || days === "" || mag === "" || radius === "") {
	  url = "http://api.openhazards.com/GetEarthquakeProbability?q=New+York,+NY&w=365&m=2.2&r=100";
	} else if (place !== "" || days !== "" || mag !== "" || radius !== "");
	  url = "http://api.openhazards.com/GetEarthquakeProbability?q=" + this.config.place + "&w=" + this.config.days + "&m=" + this.config.mag + "&r=" + this.config.radius;
	//    console.log("Error can't get Earthquake url" + response.statusCode); // response.statusCode not defined
       	
    
  return url;
   
  },
     
     processEarthquake: function(data) {
         this.today = data.Today;
         this.eq = data;
         this.loaded = true;
     },
     
     scheduleUpdate: function() {
         setInterval(() => {
             this.getEarthquake();
         }, this.config.updateInterval);
         this.getEarthquake(this.config.initialLoadDelay);
     },

     getEarthquake: function() {
         this.sendSocketNotification('GET_EARTHQUAKE', this.url);
     },

     socketNotificationReceived: function(notification, payload) {
         if (notification === "EARTHQUAKE_RESULT") {
             this.processEarthquake(payload);
             this.updateDom(this.config.animationSpeed);
         }
         this.updateDom(this.config.initialLoadDelay);
     },

 });
