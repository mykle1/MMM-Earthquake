 /* Magic Mirror
  * Module: MMM-Earthquake
  *
  * By Mykle1
  * 
  */
 Module.register("MMM-Earthquake", {

     // Module config defaults.
     defaults: {
         place: "New+York,+NY", // New+York,+NY is default (follow this format)
         radius: "50", // 50km = 31.0686 miles (search radius)
         days: "365", // 365 is default within how many days (1 - 365)
         mag: "2.5", // Magnitude = 1.0 - 9.9 (9.5 highest ever recorded)
         maxWidth: "300px",
         header: "",
         updateInterval: 60 * 60 * 1000, // every hour
         animationSpeed: 10,
         initialLoadDelay: 1875, // of module
         retryDelay: 1500,
     },


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

         var wrapper = document.createElement("div");
         wrapper.className = "wrapper";
         wrapper.style.maxWidth = this.config.maxWidth;


         if (!this.loaded) {
             wrapper.classList.add("wrapper");
             wrapper.innerHTML = "EARTHQUAKE!...";
             wrapper.className = "bright light small";
             return wrapper;
         }

         // common header
         var header = document.createElement("header");
         header.classList.add("xsmall", "dimmed", "header");
         header.innerHTML = this.config.header;
         wrapper.appendChild(header);


         var top = document.createElement("div");
         top.classList.add("list-row");


         // Location (city)
         var place = document.createElement("div");
         place.classList.add("xsmall", "bright", "place");
         place.innerHTML = eq.location[0].place[0];
         top.appendChild(place);


         // Latitude from response
         var lat = document.createElement("div");
         lat.classList.add("xsmall", "bright", "lat");
         lat.innerHTML = "Latitude = &nbsp" + eq.location[0].lat[0];
         top.appendChild(lat);


         // Longitude from response
         var lng = document.createElement("div");
         lng.classList.add("xsmall", "bright", "lng");
         lng.innerHTML = "Longitude = &nbsp" + eq.location[0].lng[0];
         top.appendChild(lng);


         // Radius of search // Math.round to shorten response. <radius unit="km">100.000000</radius>
         var radius = document.createElement("div");
         radius.classList.add("xsmall", "bright", "radius");
         radius.innerHTML = "Within a " + Math.round(eq.location[0].radius[0]["_"]) + " km radius"; // <- Use this format to get data from -> <radius unit="km">100.000000</radius>
         top.appendChild(radius);


         // Within days
         var days = document.createElement("div");
         days.classList.add("xsmall", "bright", "days");
         days.innerHTML = "In the next " + eq.forecast[0].window[0]["_"] + " days"; // <- Use this format to get data from -> <radius unit="km">100.000000</radius>
         top.appendChild(days);


         // Magnitude
         var mag = document.createElement("div");
         mag.classList.add("xsmall", "bright", "mag");
         mag.innerHTML = "Magnitude of &nbsp" + eq.forecast[0].mag[0];
         top.appendChild(mag);


         // Probability
         var prob = document.createElement("div");
         prob.classList.add("small", "bright", "prob");
         prob.innerHTML = "Probability = &nbsp" + eq.forecast[0].prob[0];
         top.appendChild(prob);

         wrapper.appendChild(top);
         return wrapper;

     },

     getUrl: function() {
         var url = null;
         var eq = this.eq;
         var place = this.config.place;
         var days = this.config.days;
         var mag = this.config.mag;
         var radius = this.config.radius;


         if (place === "" || days === "" || mag === "" || radius === "") {
             url = "http://api.openhazards.com/GetEarthquakeProbability?q=New+York,+NY&w=365&m=2.2&r=100";
         } else if (place !== "" || days !== "" || mag !== "" || radius !== "");
         url = "http://api.openhazards.com/GetEarthquakeProbability?q=" + this.config.place + "&w=" + this.config.days + "&m=" + this.config.mag + "&r=" + this.config.radius;
         //   console.log("Error can't get Earthquake url");

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