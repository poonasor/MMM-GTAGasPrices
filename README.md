# MMM-GTAGasPrices

A MagicMirror² module that displays current and forecasted gas prices for the Greater Toronto Area (GTA) from CityNews.

![Gas Prices Display](screenshot.png)

## Features

- Displays current average gas price per litre for GTA stations
- Shows price change indicators (up/down/no change)
- Displays En-Pro's forecast for upcoming price changes
- Automatically updates daily at 00:15 (12:15 AM) when CityNews typically updates their data
- Clean, customizable display with gas pump icon
- Configurable update intervals and styling

## Dependencies

- **External API**: [Toronto CityNews GTA Gas Prices](https://toronto.citynews.ca/toronto-gta-gas-prices/)
- **API Key Required**: No
- **Free**: Yes

This module scrapes public gas price data from CityNews Toronto's GTA gas prices page.

## Installation

1. Navigate to your MagicMirror's `modules` folder:

```bash
cd ~/MagicMirror/modules
```

2. Clone this repository:

```bash
git clone https://github.com/poonasor/MMM-GTAGasPrices.git
```

3. Navigate to the module folder:

```bash
cd MMM-GTAGasPrices
```

4. Install dependencies:

```bash
npm install
```

## Configuration

Add the module to your `config/config.js` file:

### Minimal Configuration

```javascript
{
    module: "MMM-GTAGasPrices",
    position: "top_right",
    config: {}
}
```

### Full Configuration with Defaults

```javascript
{
    module: "MMM-GTAGasPrices",
    position: "top_right",
    header: "GTA Gas Prices",
    config: {
        updateInterval: 60 * 60 * 1000,  // Update every hour (in milliseconds)
        animationSpeed: 1000,              // Animation speed for updates (in milliseconds)
        initialLoadDelay: 0,               // Delay before first load (in milliseconds)
        retryDelay: 2500,                  // Retry delay on error (in milliseconds)
        updateTime: "00:15",               // Time to fetch updated prices daily (HH:MM format, 24-hour)
        showIcon: true,                    // Show gas pump icon
        showChangeIndicator: true,         // Show price change indicator (up/down/no change)
        showForecast: true,                // Show/hide the forecast text block
        maxWidth: "400px"                 // Optional: constrain the module width (CSS value)
    }
}
```

## Configuration Options

| Option                | Type      | Default   | Description                                                        |
| --------------------- | --------- | --------- | ------------------------------------------------------------------ |
| `updateInterval`      | `number`  | `3600000` | How often to check for updates in milliseconds (default: 1 hour)   |
| `animationSpeed`      | `number`  | `1000`    | Speed of the update animation in milliseconds                      |
| `initialLoadDelay`    | `number`  | `0`       | Delay before loading data for the first time in milliseconds       |
| `retryDelay`          | `number`  | `2500`    | Time to wait before retrying after an error in milliseconds        |
| `updateTime`          | `string`  | `"00:15"` | Daily scheduled time to fetch new prices (24-hour format: "HH:MM") |
| `showIcon`            | `boolean` | `true`    | Display the gas pump emoji icon                                    |
| `showChangeIndicator` | `boolean` | `true`    | Show whether prices are going up, down, or staying the same        |
| `showForecast`        | `boolean` | `true`    | Show the forecast text block                                       |
| `maxWidth`            | `string`  | `null`    | Optional CSS max-width for the module wrapper (e.g. `"400px"`)     |

## How It Works

1. **Data Source**: The module fetches gas price data from CityNews Toronto's public gas prices page
2. **Parsing**: It extracts the price container element (`#gas_price_latest_container`) which contains:
   - Current average price per litre
   - Price change direction (up/down/no change)
   - En-Pro's forecast for the next price change
   - Expected change time
3. **Scheduling**:
   - Updates automatically at the configured `updateTime` (default 00:15 AM) when new data is typically available
   - Also checks periodically based on `updateInterval` for any updates
4. **Display**: Shows the information in a clean, easy-to-read format with visual indicators

## Display Elements

- **Gas Icon**: ⛽ emoji (can be hidden with `showIcon: false`)
- **Price Change Indicator**:
  - ▲ Red background for price increases
  - ▼ Green background for price decreases
  - ─ Yellow background for no change
- **Current Price**: Large, bold display in cents per litre
- **Forecast**: Text description from En-Pro about expected price changes
- **Last Updated**: Timestamp of when the data was last fetched

## Styling

The module includes default styling in `MMM-GTAGasPrices.css`. You can customize the appearance by:

1. Editing the CSS file directly
2. Adding custom CSS in your MagicMirror's `custom.css` file
3. Using MagicMirror's built-in classes (`.bright`, `.dimmed`, `.small`, etc.)

## Example Output

```
⛽  ▲ No Change
   130.9¢/L

   En-Pro tells CityNews that prices are expected
   to remain unchanged at 12:01am on February 2, 2026
   holding at an average of 130.9 cent(s)/litre at local stations.

   Updated: 2/1/2026, 12:15:00 AM
```

## Notes

- Gas prices typically update around midnight (00:00) daily, so the default `updateTime` is set to 00:15 to catch the new data
- The module will display "Loading gas prices..." while fetching initial data
- If data cannot be fetched, it will show "No gas price data available." and retry after `retryDelay`
- The module requires MagicMirror² version 2.1.0 or higher

## Troubleshooting

**Module not appearing:**

- Check the MagicMirror logs for errors: `pm2 logs MagicMirror`
- Ensure dependencies are installed: `cd ~/MagicMirror/modules/MMM-GTAGasPrices && npm install`

**No data showing:**

- Check your internet connection
- Verify the CityNews website is accessible: https://toronto.citynews.ca/toronto-gta-gas-prices/
- Check browser console (F12) for errors

**Outdated prices:**

- Verify your `updateTime` is set correctly
- Check system time is accurate
- Manually trigger an update by restarting MagicMirror

## License

MIT License - see LICENSE file

## Credits

- Gas price data provided by [En-Pro](http://www.en-pro.com/) via [CityNews Toronto](https://toronto.citynews.ca/)
- Developed for MagicMirror² by Ricky Poon

## Contributing

Issues and pull requests are welcome!
