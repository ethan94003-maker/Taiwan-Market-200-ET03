import { Stock } from "../types";

export interface FiveMinDataPoint {
  time: string;       // e.g., "09:05"
  open: number;       // Open price
  high: number;       // High price
  low: number;        // Low price
  close: number;      // Close price
  volume: number;     // 5-minute Volume (張 / lots)
}

// Seeded random generator for deterministic charts per stock symbol
export function createSeededRandom(seedStr: string) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

// Get Taiwan local time details
export function getTaipeiTime() {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Taipei",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const weekday = parts.find(p => p.type === "weekday")?.value || "Monday";
    const hourStr = parts.find(p => p.type === "hour")?.value || "12";
    const minuteStr = parts.find(p => p.type === "minute")?.value || "00";

    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const isWeekend = weekday === "Saturday" || weekday === "Sunday";

    return { hour, minute, isWeekend, weekday };
  } catch (e) {
    // Fallback if Intl is not fully supported or throws
    const utcDay = now.getUTCDay();
    const isWeekend = utcDay === 0 || utcDay === 6;
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][utcDay];
    // Est. Taipei time (UTC + 8)
    const taipeiHours = (now.getUTCHours() + 8) % 24;
    return { hour: taipeiHours, minute: now.getUTCMinutes(), isWeekend, weekday };
  }
}

// Check if Taiwan Market is open
export function isTaiwanMarketOpen(): boolean {
  const { hour, minute, isWeekend } = getTaipeiTime();
  if (isWeekend) return false;
  const minutes = hour * 60 + minute;
  const start = 9 * 60; // 09:00
  const end = 13 * 60 + 30; // 13:30
  return minutes >= start && minutes <= end;
}

// Generate the 5-minute price and volume chart data
export function generate5MinChartData(stock: Stock): FiveMinDataPoint[] {
  const rand = createSeededRandom(stock.symbol + "-5min-v2");
  
  // Calculate how many 5-minute bars have elapsed today
  const { hour, minute, isWeekend } = getTaipeiTime();
  const currentMinutes = hour * 60 + minute;
  const marketStartMinutes = 9 * 60; // 09:00
  const marketEndMinutes = 13 * 60 + 30; // 13:30

  const maxIntervals = 54; // full trading day (9:00 - 13:30 is 270 minutes / 5 = 54 intervals)
  let elapsedIntervals = maxIntervals;

  const isToday = !isWeekend;
  const marketIsOpenNow = isTaiwanMarketOpen();

  if (isToday) {
    if (currentMinutes < marketStartMinutes) {
      // Market has not opened yet today. Show full simulated day for visual elegance.
      elapsedIntervals = maxIntervals;
    } else if (marketIsOpenNow) {
      // Market is open. Show intervals elapsed so far today (at least 2, max 54)
      const elapsedMinutes = currentMinutes - marketStartMinutes;
      elapsedIntervals = Math.max(2, Math.min(maxIntervals, Math.floor(elapsedMinutes / 5)));
    } else if (currentMinutes > marketEndMinutes) {
      // Market has closed today. Show the full completed day (54 intervals)
      elapsedIntervals = maxIntervals;
    }
  }

  // Create full list of 5-minute time stamps for the entire day (54 points)
  const times: string[] = [];
  for (let i = 1; i <= maxIntervals; i++) {
    const mins = marketStartMinutes + i * 5;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    times.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
  }

  // Generate full daily close prices walk converging to stock.price
  const closePrices: number[] = [];
  const openPrice = stock.openPrice;
  const currentPrice = stock.price;

  // Volatility scale factor based on the stock's daily change percent or standard base
  const volFactor = Math.max(0.005, Math.abs(stock.changePercent) / 100); 
  const maxNoiseRange = openPrice * volFactor * 0.6;

  closePrices.push(openPrice); // placeholder at index 0 for walk calculations

  for (let i = 1; i <= maxIntervals; i++) {
    const t = i / maxIntervals;
    // Linear baseline interpolation
    const baseline = openPrice + t * (currentPrice - openPrice);
    
    // Smooth waves to simulate trends
    const wave = Math.sin(i * 0.2) * maxNoiseRange * 0.4 + Math.cos(i * 0.1) * maxNoiseRange * 0.2;
    // Random noise
    const noise = (rand() - 0.5) * maxNoiseRange * 0.3;

    // Dampen noise as we get close to the final price (at t = 1, wave & noise will be 0)
    const multiplier = 1 - t;
    let priceAtStep = baseline + multiplier * (wave + noise);

    // Make sure price doesn't go below 0
    if (priceAtStep <= 0.1) priceAtStep = 0.1;

    closePrices.push(parseFloat(priceAtStep.toFixed(2)));
  }

  // Remove the first placeholder point so we have exactly maxIntervals
  closePrices.shift();

  // Generate volume weights for each interval (U-shaped distribution)
  const rawVolumeWeights: number[] = [];
  for (let i = 1; i <= maxIntervals; i++) {
    // U-shape base weight
    let baseWeight = 0.5;
    if (i <= 8) {
      // Morning rush (first 40 mins)
      baseWeight = 3.0 - (i * 0.25);
    } else if (i >= maxIntervals - 8) {
      // Closing rush (last 40 mins)
      const distFromEnd = maxIntervals - i;
      baseWeight = 3.0 - (distFromEnd * 0.25);
    } else {
      // Midday flat
      baseWeight = 0.4 + rand() * 0.4;
    }

    // Add random spike to volume to make it look realistic
    const randomSpike = rand() > 0.93 ? (1.5 + rand() * 2.0) : 1.0;
    const finalWeight = baseWeight * randomSpike * (0.8 + rand() * 0.4);
    rawVolumeWeights.push(finalWeight);
  }

  // Sum weights of the entire day to normalize
  const sumWeights = rawVolumeWeights.reduce((a, b) => a + b, 0);

  // Build final data points up to elapsedIntervals
  const dataPoints: FiveMinDataPoint[] = [];
  let prevClose = openPrice;

  for (let i = 0; i < elapsedIntervals; i++) {
    const tStr = times[i];
    const cVal = closePrices[i];
    const oVal = prevClose;

    // Calculate realistic high and low for this 5-minute bar
    const rawMax = Math.max(oVal, cVal);
    const rawMin = Math.min(oVal, cVal);
    
    // High is slightly above the max
    const highVal = parseFloat((rawMax + rand() * (openPrice * 0.0015)).toFixed(2));
    // Low is slightly below the min
    const lowVal = parseFloat((rawMin - rand() * (openPrice * 0.0015)).toFixed(2));

    // Calculate volume based on normalized weight
    const rawVol = (rawVolumeWeights[i] / sumWeights) * stock.volume;
    const volVal = Math.max(1, Math.round(rawVol));

    dataPoints.push({
      time: tStr,
      open: oVal,
      high: Math.max(highVal, rawMax),
      low: Math.max(0.01, Math.min(lowVal, rawMin)),
      close: cVal,
      volume: volVal
    });

    prevClose = cVal;
  }

  // Force the last data point's close to match exactly the stock's current price
  if (dataPoints.length > 0) {
    const lastIdx = dataPoints.length - 1;
    dataPoints[lastIdx].close = currentPrice;
    if (dataPoints[lastIdx].open > currentPrice && dataPoints[lastIdx].low > currentPrice) {
      dataPoints[lastIdx].low = currentPrice;
    }
    if (dataPoints[lastIdx].open < currentPrice && dataPoints[lastIdx].high < currentPrice) {
      dataPoints[lastIdx].high = currentPrice;
    }
  }

  return dataPoints;
}
