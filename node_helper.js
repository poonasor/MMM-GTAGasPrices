const NodeHelper = require("node_helper");
const fetch = require("node-fetch");
const { parse } = require("node-html-parser");

module.exports = NodeHelper.create({
	requiresVersion: "2.1.0",

	start: function() {
		console.log("Starting node helper for: " + this.name);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "GET_GAS_PRICES") {
			this.fetchGasPrices();
		}
	},

	fetchGasPrices: async function() {
		const url = "https://toronto.citynews.ca/toronto-gta-gas-prices/";
		
		try {
			console.log(this.name + ": Fetching gas prices from " + url);
			
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error("HTTP error! status: " + response.status);
			}
			
			const html = await response.text();
			const root = parse(html);
			
			const container = root.querySelector("#gas_price_latest_container");
			
			if (!container) {
				throw new Error("Could not find gas price container");
			}

			const dataBox = container.querySelector(".data-box-change");
			let changeType = "nochange";
			let change = "No Change";
			
			if (dataBox) {
				const upArrow = dataBox.querySelector(".up-arrow");
				const downArrow = dataBox.querySelector(".down-arrow");
				const changeText = dataBox.querySelector(".float-start");
				
				if (upArrow && upArrow.getAttribute("style") !== "display: none;") {
					changeType = "up";
				} else if (downArrow && downArrow.getAttribute("style") !== "display: none;") {
					changeType = "down";
				}
				
				if (changeText) {
					change = changeText.text.trim();
				}
			}

			const floatBox = container.querySelector(".float-box");
			let forecast = "";
			let price = "N/A";
			
			if (floatBox) {
				const text = floatBox.text;
				
				const priceMatch = text.match(/(\d+\.\d+)\s*cent/i);
				if (priceMatch) {
					price = priceMatch[1];
				}
				
				const forecastText = text.replace(change, "").trim();
				forecast = forecastText;
			}

			const gasData = {
				price: price,
				change: change,
				changeType: changeType,
				forecast: forecast,
				date: new Date(Date.now()).toLocaleString()
			};

			console.log(this.name + ": Gas price data fetched successfully:", gasData);
			this.sendSocketNotification("GAS_PRICES_DATA", gasData);
			
		} catch (error) {
			console.error(this.name + ": Error fetching gas prices:", error);
			this.sendSocketNotification("GAS_PRICES_ERROR", error.message);
		}
	}
});
