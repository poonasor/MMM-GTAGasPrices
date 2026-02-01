Module.register("MMM-GTAGasPrices", {
	defaults: {
		updateInterval: 60 * 60 * 1000,
		animationSpeed: 1000,
		initialLoadDelay: 0,
		retryDelay: 2500,
		updateTime: "00:15",
		showIcon: true,
		showChangeIndicator: true
	},

	requiresVersion: "2.1.0",

	start: function() {
		Log.info("Starting module: " + this.name);
		this.gasData = null;
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);
		this.scheduleDailyUpdate();
	},

	getStyles: function() {
		return [this.file("MMM-GTAGasPrices.css")];
	},

	getDom: function() {
		const wrapper = document.createElement("div");
		wrapper.className = "gas-prices-wrapper";

		if (!this.loaded) {
			wrapper.innerHTML = "Loading gas prices...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.gasData) {
			wrapper.innerHTML = "No gas price data available.";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		const container = document.createElement("div");
		container.className = "gas-prices-container";

		if (this.config.showIcon) {
			const icon = document.createElement("span");
			icon.className = "gas-icon";
			icon.innerHTML = "⛽";
			container.appendChild(icon);
		}

		const priceContainer = document.createElement("div");
		priceContainer.className = "price-container";

		if (this.config.showChangeIndicator && this.gasData.change) {
			const changeIndicator = document.createElement("div");
			changeIndicator.className = "change-indicator";
			
			if (this.gasData.changeType === "up") {
				changeIndicator.innerHTML = "▲";
				changeIndicator.className += " price-up";
			} else if (this.gasData.changeType === "down") {
				changeIndicator.innerHTML = "▼";
				changeIndicator.className += " price-down";
			} else {
				changeIndicator.innerHTML = "─";
				changeIndicator.className += " price-nochange";
			}
			
			changeIndicator.innerHTML += " " + this.gasData.change;
			priceContainer.appendChild(changeIndicator);
		}

		const priceValue = document.createElement("div");
		priceValue.className = "price-value large bright";
		priceValue.innerHTML = this.gasData.price + "¢/L";
		priceContainer.appendChild(priceValue);

		if (this.gasData.forecast) {
			const forecast = document.createElement("div");
			forecast.className = "forecast small";
			forecast.innerHTML = this.gasData.forecast;
			priceContainer.appendChild(forecast);
		}

		if (this.gasData.date) {
			const dateElement = document.createElement("div");
			dateElement.className = "update-date xsmall dimmed";
			dateElement.innerHTML = "Updated: " + this.gasData.date;
			priceContainer.appendChild(dateElement);
		}

		container.appendChild(priceContainer);
		wrapper.appendChild(container);

		return wrapper;
	},

	scheduleUpdate: function(delay) {
		let nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		const self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	scheduleDailyUpdate: function() {
		const self = this;
		const now = new Date(Date.now());
		const [hours, minutes] = this.config.updateTime.split(":");
		
		let scheduledTime = new Date(Date.now());
		scheduledTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

		if (scheduledTime <= now) {
			scheduledTime.setDate(scheduledTime.getDate() + 1);
		}

		const timeUntilUpdate = scheduledTime - now;
		
		Log.info(this.name + ": Next daily update scheduled at " + scheduledTime.toLocaleString());

		setTimeout(function() {
			self.getData();
			setInterval(function() {
				self.getData();
			}, 24 * 60 * 60 * 1000);
		}, timeUntilUpdate);
	},

	getData: function() {
		this.sendSocketNotification("GET_GAS_PRICES", this.config);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "GAS_PRICES_DATA") {
			this.gasData = payload;
			this.loaded = true;
			this.updateDom(this.config.animationSpeed);
		} else if (notification === "GAS_PRICES_ERROR") {
			Log.error(this.name + ": Error fetching gas prices - " + payload);
			this.scheduleUpdate(this.config.retryDelay);
		}
	}
});
