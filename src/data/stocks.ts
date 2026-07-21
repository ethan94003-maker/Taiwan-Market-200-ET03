import { Stock } from "../types";

// Base list of highly recognizable Taiwan Stock Market stocks
export const BASE_STOCKS_DATA = [
  // Semiconductors
  { symbol: "2330", name: "台積電", price: 985.00, category: "半導體", volume: 32450 },
  { symbol: "2454", name: "聯發科", price: 1340.00, category: "半導體", volume: 3520 },
  { symbol: "2303", name: "聯電", price: 51.20, category: "半導體", volume: 45890 },
  { symbol: "3711", name: "日月光投控", price: 155.00, category: "半導體", volume: 8420 },
  { symbol: "2449", name: "京元電子", price: 110.50, category: "半導體", volume: 15400 },
  { symbol: "2344", name: "華邦電", price: 20.80, category: "半導體", volume: 28450 },
  { symbol: "2408", name: "南亞科", price: 52.40, category: "半導體", volume: 11200 },
  { symbol: "2337", name: "旺宏", price: 24.50, category: "半導體", volume: 9800 },
  { symbol: "3532", name: "台勝科", price: 135.00, category: "半導體", volume: 1250 },
  { symbol: "3035", name: "智原", price: 235.00, category: "半導體", volume: 6420 },
  { symbol: "6415", name: "矽力*-KY", price: 425.00, category: "半導體", volume: 1850 },
  { symbol: "5347", name: "世界", price: 81.20, category: "半導體", volume: 8900 },
  { symbol: "3264", name: "欣銓", price: 68.30, category: "半導體", volume: 3400 },
  { symbol: "6271", name: "同欣電", price: 145.50, category: "半導體", volume: 1980 },
  { symbol: "8081", name: "致新", price: 228.00, category: "半導體", volume: 1100 },

  // Computer & Peripheral (including AI server concepts)
  { symbol: "2317", name: "鴻海", price: 192.50, category: "電腦週邊", volume: 68900 },
  { symbol: "2382", name: "廣達", price: 290.00, category: "電腦週邊", volume: 22450 },
  { symbol: "3231", name: "緯創", price: 112.50, category: "電腦週邊", volume: 48900 },
  { symbol: "2376", name: "技嘉", price: 265.00, category: "電腦週邊", volume: 13200 },
  { symbol: "2357", name: "華碩", price: 480.00, category: "電腦週邊", volume: 2950 },
  { symbol: "2324", name: "仁寶", price: 34.55, category: "電腦週邊", volume: 32100 },
  { symbol: "2356", name: "英業達", price: 52.30, category: "電腦週邊", volume: 31800 },
  { symbol: "2353", name: "宏碁", price: 43.10, category: "電腦週邊", volume: 25400 },
  { symbol: "2395", name: "研華", price: 335.50, category: "電腦週邊", volume: 1650 },
  { symbol: "2301", name: "光寶科", price: 101.50, category: "電腦週邊", volume: 14800 },
  { symbol: "3017", name: "奇鋐", price: 590.00, category: "電腦週邊", volume: 7450 },
  { symbol: "3045", name: "台灣大", price: 114.00, category: "通信網路", volume: 5400 },
  { symbol: "6235", name: "華孚", price: 78.40, category: "電腦週邊", volume: 9200 },
  { symbol: "2377", name: "微星", price: 172.50, category: "電腦週邊", volume: 4300 },
  { symbol: "3515", name: "華擎", price: 195.00, category: "電腦週邊", volume: 2100 },
  { symbol: "2362", name: "藍天", price: 55.30, category: "電腦週邊", volume: 8800 },

  // Optoelectronics
  { symbol: "3481", name: "群創", price: 15.80, category: "光電", volume: 95400 },
  { symbol: "2409", name: "友達", price: 17.20, category: "光電", volume: 72100 },
  { symbol: "3008", name: "大立光", price: 2340.00, category: "光電", volume: 920 },
  { symbol: "3406", name: "玉晶光", price: 412.00, category: "光電", volume: 3400 },
  { symbol: "3141", name: "晶宏", price: 85.30, category: "光電", volume: 2800 },
  { symbol: "6116", name: "彩晶", price: 9.85, category: "光電", volume: 18900 },
  { symbol: "3380", name: "明泰", price: 34.20, category: "通信網路", volume: 4200 },

  // Electronic Components
  { symbol: "2308", name: "台達電", price: 385.00, category: "電子零組件", volume: 9400 },
  { symbol: "3037", name: "欣興", price: 158.00, category: "電子零組件", volume: 16800 },
  { symbol: "2327", name: "國巨", price: 560.00, category: "電子零組件", volume: 2150 },
  { symbol: "3044", name: "健鼎", price: 185.00, category: "電子零組件", volume: 4600 },
  { symbol: "2367", name: "燿華", price: 24.85, category: "電子零組件", volume: 25400 },
  { symbol: "2313", name: "華通", price: 74.20, category: "電子零組件", volume: 28900 },
  { symbol: "2368", name: "金像電", price: 215.50, category: "電子零組件", volume: 6800 },
  { symbol: "3189", name: "景碩", price: 96.50, category: "電子零組件", volume: 8200 },
  { symbol: "6269", name: "台郡", price: 82.30, category: "電子零組件", volume: 3500 },
  { symbol: "4958", name: "臻鼎-KY", price: 118.00, category: "電子零組件", volume: 5400 },

  // Shipping / Transportation
  { symbol: "2603", name: "長榮", price: 185.50, category: "航運業", volume: 29400 },
  { symbol: "2609", name: "陽明", price: 68.40, category: "航運業", volume: 54100 },
  { symbol: "2615", name: "萬海", price: 82.10, category: "航運業", volume: 41200 },
  { symbol: "2618", name: "長榮航", price: 35.20, category: "航運業", volume: 82400 },
  { symbol: "2610", name: "華航", price: 23.50, category: "航運業", volume: 69400 },
  { symbol: "2606", name: "東森", price: 19.85, category: "航運業", volume: 3100 },
  { symbol: "2637", name: "慧洋-KY", price: 72.30, category: "航運業", volume: 5800 },
  { symbol: "2605", name: "新興", price: 25.40, category: "航運業", volume: 9400 },
  { symbol: "2612", name: "中航", price: 54.30, category: "航運業", volume: 1500 },

  // Financials
  { symbol: "2881", name: "富邦金", price: 82.30, category: "金融保險", volume: 18500 },
  { symbol: "2882", name: "國泰金", price: 61.20, category: "金融保險", volume: 22100 },
  { symbol: "2891", name: "中信金", price: 35.60, category: "金融保險", volume: 49800 },
  { symbol: "2886", name: "兆豐金", price: 39.80, category: "金融保險", volume: 16400 },
  { symbol: "2884", name: "玉山金", price: 28.10, category: "金融保險", volume: 21500 },
  { symbol: "2892", name: "第一金", price: 27.50, category: "金融保險", volume: 15800 },
  { symbol: "2880", name: "華南金", price: 26.20, category: "金融保險", volume: 14200 },
  { symbol: "2883", name: "凱基金", price: 16.85, category: "金融保險", volume: 55400 },
  { symbol: "2885", name: "元大金", price: 31.40, category: "金融保險", volume: 19500 },
  { symbol: "2887", name: "台新金", price: 18.25, category: "金融保險", volume: 32100 },
  { symbol: "2890", name: "永豐金", price: 24.30, category: "金融保險", volume: 21200 },
  { symbol: "2888", name: "新光金", price: 11.20, category: "金融保險", volume: 189400 },
  { symbol: "5880", name: "合庫金", price: 26.50, category: "金融保險", volume: 13100 },
  { symbol: "2801", name: "彰銀", price: 18.10, category: "金融保險", volume: 8400 },
  { symbol: "2812", name: "台中銀", price: 16.50, category: "金融保險", volume: 12400 },
  { symbol: "2845", name: "遠東銀", price: 13.90, category: "金融保險", volume: 5200 },
  { symbol: "5871", name: "中租-KY", price: 162.00, category: "金融保險", volume: 4800 },
  { symbol: "2834", name: "臺企銀", price: 16.05, category: "金融保險", volume: 24500 },

  // Plastics, Chemicals & Steel
  { symbol: "1101", name: "台泥", price: 33.20, category: "水泥工業", volume: 24500 },
  { symbol: "1102", name: "亞泥", price: 44.50, category: "水泥工業", volume: 8900 },
  { symbol: "1301", name: "台塑", price: 58.50, category: "塑膠工業", volume: 12400 },
  { symbol: "1303", name: "南亞", price: 49.30, category: "塑膠工業", volume: 10500 },
  { symbol: "1326", name: "台化", price: 40.20, category: "塑膠工業", volume: 8400 },
  { symbol: "1304", name: "台聚", price: 14.85, category: "塑膠工業", volume: 3200 },
  { symbol: "1308", name: "亞聚", price: 18.20, category: "塑膠工業", volume: 1500 },
  { symbol: "2002", name: "中鋼", price: 22.85, category: "鋼鐵工業", volume: 38400 },
  { symbol: "2006", name: "東和鋼鐵", price: 71.50, category: "鋼鐵工業", volume: 3100 },
  { symbol: "2014", name: "中鴻", price: 21.30, category: "鋼鐵工業", volume: 9200 },
  { symbol: "2027", name: "大成鋼", price: 34.60, category: "鋼鐵工業", volume: 11400 },

  // Communication & Cable
  { symbol: "2412", name: "中華電", price: 122.00, category: "通信網路", volume: 8900 },
  { symbol: "4904", name: "遠傳", price: 90.50, category: "通信網路", volume: 4100 },
  { symbol: "2345", name: "智邦", price: 535.00, category: "通信網路", volume: 2200 },
  { symbol: "2498", name: "宏達電", price: 45.30, category: "通信網路", volume: 13400 },
  { symbol: "3062", name: "建漢", price: 28.40, category: "通信網路", volume: 11500 },
  { symbol: "5388", name: "中磊", price: 118.00, category: "通信網路", volume: 2500 },
  { symbol: "6285", name: "啟碁", price: 132.50, category: "通信網路", volume: 3800 },
  { symbol: "1605", name: "華新", price: 33.15, category: "電器電纜", volume: 16800 },

  // Bio-tech / Foods / Others
  { symbol: "1216", name: "統一", price: 81.50, category: "食品工業", volume: 11400 },
  { symbol: "1210", name: "大成", price: 52.40, category: "食品工業", volume: 2800 },
  { symbol: "1201", name: "味全", price: 19.85, category: "食品工業", volume: 1800 },
  { symbol: "1701", name: "中化", price: 31.20, category: "生技醫療", volume: 4500 },
  { symbol: "1760", name: "寶齡富錦", price: 78.50, category: "生技醫療", volume: 1200 },
  { symbol: "3702", name: "大聯大", price: 76.40, category: "電子通路", volume: 9500 },
  { symbol: "3036", name: "文曄", price: 115.00, category: "電子通路", volume: 8200 },
  { symbol: "9904", name: "寶成", price: 36.80, category: "其他", volume: 10400 },
  { symbol: "9921", name: "巨大", price: 210.00, category: "其他", volume: 1800 },
  { symbol: "9914", name: "美利達", price: 195.00, category: "其他", volume: 1550 },
  { symbol: "1402", name: "遠東新", price: 32.50, category: "紡織纖維", volume: 7400 },
  { symbol: "2105", name: "正新", price: 51.20, category: "橡膠工業", volume: 6200 },
];

// Helper to generate the remaining stocks to reach 200 items in total
export function generate200Stocks(): Stock[] {
  const stocks: Stock[] = [];

  // 1. Initialise TAIEX index first (Symbol: IX0001)
  const taiexBasePrice = 22530.45;
  const taiexOpen = 22410.00; // Set open price to give an exact positive change of 120.45
  const taiexPrice = taiexBasePrice;
  const taiexChange = 120.45;
  const taiexChangePercent = (taiexChange / taiexOpen) * 100;
  
  // Generate a mock history for sparkline (15 points)
  const taiexHistory: number[] = [];
  let tempPrice = taiexOpen;
  for (let i = 0; i < 15; i++) {
    tempPrice = tempPrice * (1 + (Math.random() * 0.004 - 0.002));
    taiexHistory.push(tempPrice);
  }
  // Make sure the last point is current price
  taiexHistory[taiexHistory.length - 1] = taiexPrice;

  stocks.push({
    symbol: "IX0001",
    name: "台灣加權指數",
    price: parseFloat(taiexPrice.toFixed(2)),
    openPrice: parseFloat(taiexOpen.toFixed(2)),
    change: parseFloat(taiexChange.toFixed(2)),
    changePercent: parseFloat(taiexChangePercent.toFixed(2)),
    volume: Math.floor(250000 + Math.random() * 100000), // in billions or lots equivalent
    history: taiexHistory,
    category: "指數",
    marketCap: 625300,
    peRatio: 22.4,
    dividendYield: 3.05,
    high52Week: 23500.00,
    low52Week: 18500.00,
    majorBuyPercent: 50,
  });

  // 2. Add BASE_STOCKS_DATA (around 100 stocks)
  BASE_STOCKS_DATA.forEach(item => {
    // Determine random daily change from -4% to +4% to start with a lively state
    const changeRange = (Math.random() * 0.08 - 0.04); // -4% to +4%
    let openPrice = item.price;
    let currentPrice = openPrice * (1 + changeRange);
    let change = currentPrice - openPrice;
    let changePercent = (change / openPrice) * 100;

    // Generate history points
    const history: number[] = [];
    let p = openPrice;
    for (let i = 0; i < 15; i++) {
      p = p * (1 + (Math.random() * 0.01 - 0.005));
      history.push(parseFloat(p.toFixed(2)));
    }
    history[history.length - 1] = parseFloat(currentPrice.toFixed(2));

    let marketCap = Math.floor(openPrice * (5 + Math.random() * 8));
    if (item.symbol === "2330") marketCap = 25540; // TSMC
    if (item.symbol === "2317") marketCap = 2668;  // Foxconn
    if (item.symbol === "2454") marketCap = 2144;  // MediaTek
    if (item.symbol === "2308") marketCap = 997;   // Delta Electronics
    if (item.symbol === "2303") marketCap = 642;   // UMC

    let peRatio = parseFloat((12 + Math.random() * 25).toFixed(1));
    if (item.category === "金融保險") peRatio = parseFloat((8 + Math.random() * 6).toFixed(1));
    if (item.category === "生技醫療") peRatio = parseFloat((20 + Math.random() * 30).toFixed(1));

    let dividendYield = parseFloat((1.5 + Math.random() * 6).toFixed(2));
    if (peRatio > 35) dividendYield = parseFloat((0.5 + Math.random() * 1.5).toFixed(2));
    else if (peRatio < 12) dividendYield = parseFloat((4.5 + Math.random() * 4).toFixed(2));

    const cp = parseFloat(currentPrice.toFixed(2));
    let h52 = parseFloat((cp * (1 + 0.05 + Math.random() * 0.25)).toFixed(2));
    let l52 = parseFloat((cp * (1 - 0.05 - Math.random() * 0.30)).toFixed(2));
    if (item.symbol === "2330") {
      h52 = 1100.00;
      l52 = 750.00;
    }

    stocks.push({
      symbol: item.symbol,
      name: item.name,
      price: cp,
      openPrice: parseFloat(openPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: item.volume + Math.floor(Math.random() * 2000),
      history: history,
      category: item.category,
      marketCap,
      peRatio,
      dividendYield,
      high52Week: h52,
      low52Week: l52,
      majorBuyPercent: Math.max(10, Math.min(90, parseFloat((50 + changePercent * 2.5 + (Math.random() * 10 - 5)).toFixed(1)))),
    });
  });

  // 3. Generate additional stocks to reach exactly 200 (including index)
  // Let's create prefixes and suffixes for realistic sounding companies
  const categories = ["半導體", "電腦週邊", "光電", "電子零組件", "航運業", "金融保險", "鋼鐵工業", "化學工業", "建材營造", "生技醫療"];
  
  const prefixes = ["和", "華", "台", "新", "富", "中", "長", "大", "東", "亞", "國", "聯", "立", "全", "佳", "永", "群", "智", "達", "威", "茂", "力", "精", "建", "信", "宏", "通", "瑞", "鼎", "捷", "科", "誠", "嘉", "晟", "泰", "創", "凌", "宇", "安", "宣", "健", "巨", "耀", "致", "星", "展", "虹", "訊", "隆", "豐"];
  const suffixes = ["山", "海", "宇", "邦", "晶", "碩", "電", "光", "通", "航", "金", "鋼", "德", "盛", "瑞", "科", "控", "達", "信", "泰", "華", "生", "林", "基", "豐", "茂", "洋", "源", "利", "新", "威", "發", "進", "隆", "環", "能", "生", "化", "高", "陽", "豪", "勝", "益", "成", "強", "展", "康", "德", "翔", "普"];

  const existingSymbols = new Set(stocks.map(s => s.symbol));
  
  let currentIdIndex = 3000; // Start generating ticker symbols from 3000

  while (stocks.length < 200) {
    const symbolStr = String(currentIdIndex);
    currentIdIndex += Math.floor(Math.random() * 15) + 3; // jump to keep IDs realistic

    if (existingSymbols.has(symbolStr)) {
      continue;
    }

    const pref = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suff = suffixes[Math.floor(Math.random() * suffixes.length)];
    let stockName = pref + suff;
    
    // Check if name is already used, add a modifier if so
    if (stocks.some(s => s.name === stockName)) {
      stockName += ["-KY", "二", "甲", "創"][Math.floor(Math.random() * 4)];
    }

    const cat = categories[Math.floor(Math.random() * categories.length)];
    
    // Choose realistic price based on category
    let basePrice = (10 + Math.random() * 150);
    if (cat === "半導體") basePrice = (50 + Math.random() * 600);
    else if (cat === "金融保險") basePrice = (10 + Math.random() * 40);
    else if (cat === "生技醫療") basePrice = (20 + Math.random() * 250);

    const changeRange = (Math.random() * 0.12 - 0.06); // -6% to +6% initial
    const openPrice = parseFloat(basePrice.toFixed(2));
    const currentPrice = parseFloat((openPrice * (1 + changeRange)).toFixed(2));
    const change = parseFloat((currentPrice - openPrice).toFixed(2));
    const changePercent = parseFloat(((change / openPrice) * 100).toFixed(2));

    const history: number[] = [];
    let p = openPrice;
    for (let i = 0; i < 15; i++) {
      p = p * (1 + (Math.random() * 0.012 - 0.006));
      history.push(parseFloat(p.toFixed(2)));
    }
    history[history.length - 1] = currentPrice;

    let marketCap = Math.floor(openPrice * (2 + Math.random() * 6));
    let peRatio = parseFloat((10 + Math.random() * 25).toFixed(1));
    if (cat === "金融保險") peRatio = parseFloat((8 + Math.random() * 6).toFixed(1));
    if (cat === "生技醫療") peRatio = parseFloat((20 + Math.random() * 30).toFixed(1));

    let dividendYield = parseFloat((1.5 + Math.random() * 6).toFixed(2));
    if (peRatio > 35) dividendYield = parseFloat((0.5 + Math.random() * 1.5).toFixed(2));
    else if (peRatio < 12) dividendYield = parseFloat((4.5 + Math.random() * 4).toFixed(2));

    const h52 = parseFloat((currentPrice * (1 + 0.05 + Math.random() * 0.25)).toFixed(2));
    const l52 = parseFloat((currentPrice * (1 - 0.05 - Math.random() * 0.30)).toFixed(2));

    stocks.push({
      symbol: symbolStr,
      name: stockName,
      price: currentPrice,
      openPrice: openPrice,
      change: change,
      changePercent: changePercent,
      volume: Math.floor(100 + Math.random() * 8000),
      history: history,
      category: cat,
      marketCap,
      peRatio,
      dividendYield,
      high52Week: h52,
      low52Week: l52,
      majorBuyPercent: Math.max(10, Math.min(90, parseFloat((50 + changePercent * 2.5 + (Math.random() * 10 - 5)).toFixed(1)))),
    });
  }

  return stocks;
}

// Function to simulate real-time price fluctuation on stock list
export function simulateTick(stocks: Stock[]): Stock[] {
  // We locate the index of TAIEX so we can update it based on the average movement
  let totalSumPercent = 0;
  let moveCount = 0;
  let totalTickChange = 0;

  const updated = stocks.map((stock) => {
    if (stock.symbol === "IX0001") {
      // TAIEX is simulated later based on overall market movement
      return stock;
    }

    // Determine volatility based on industry or price level
    // High-priced stocks or tech stocks can be more volatile
    let volatility = 0.0015; // default 0.15% per tick
    if (stock.category === "半導體" || stock.category === "電腦週邊") {
      volatility = 0.0025; // 0.25%
    } else if (stock.category === "金融保險") {
      volatility = 0.0008; // 0.08%
    }

    // Mean-reversion target price calculation to prevent random walk drift
    let targetPrice = stock.openPrice;
    if (stock.openPrice && stock.change !== undefined) {
      targetPrice = stock.openPrice + stock.change;
    }

    const deviation = (stock.price - targetPrice) / targetPrice;
    const reversionStrength = 0.45;
    const reversionForce = -reversionStrength * deviation; // Pulls price back towards the baseline target

    // Taiwan Daily Price Limit is 10%
    const changeFactor = (Math.random() * 2 - 1) * volatility + reversionForce;
    let nextPrice = stock.price * (1 + changeFactor);
    
    // Clamp to ±10% of openPrice
    const maxPrice = stock.openPrice * 1.10;
    const minPrice = stock.openPrice * 0.90;
    
    if (nextPrice > maxPrice) nextPrice = maxPrice;
    if (nextPrice < minPrice) nextPrice = minPrice;

    nextPrice = parseFloat(nextPrice.toFixed(2));
    const change = parseFloat((nextPrice - stock.openPrice).toFixed(2));
    const changePercent = parseFloat(((change / stock.openPrice) * 100).toFixed(2));

    // Update volume slightly on each tick
    const extraVolume = Math.floor(Math.random() * 20) + (Math.random() > 0.8 ? Math.floor(Math.random() * 100) : 0);
    const volume = stock.volume + extraVolume;

    // Append to history, discard first item to maintain 15 points
    const history = [...stock.history.slice(1), nextPrice];

    totalSumPercent += changePercent;
    totalTickChange += changeFactor;
    moveCount++;

    const updatedHigh = nextPrice > stock.high52Week ? nextPrice : stock.high52Week;
    const updatedLow = nextPrice < stock.low52Week ? nextPrice : stock.low52Week;
    const targetRatio = 50 + (changePercent * 2.5) + (Math.random() * 6 - 3);
    const updatedMajorBuy = Math.max(10, Math.min(90, parseFloat(targetRatio.toFixed(1))));

    return {
      ...stock,
      price: nextPrice,
      change: change,
      changePercent: changePercent,
      volume,
      history,
      high52Week: updatedHigh,
      low52Week: updatedLow,
      majorBuyPercent: updatedMajorBuy,
    };
  });

  // Update TAIEX based on weighted market performance (using average tick change)
  const taiexIndex = updated.findIndex((s) => s.symbol === "IX0001");
  if (taiexIndex !== -1) {
    const taiex = updated[taiexIndex];
    const avgTickChange = totalTickChange / (moveCount || 1);
    
    // TAIEX moves slightly slower/smoother than individual stocks
    const indexTickMovement = avgTickChange * 0.9 + (Math.random() * 0.0002 - 0.0001);

    // Mean reversion force to stabilize TAIEX around its target close level
    const targetTaiex = taiex.openPrice + (taiex.change || 0);
    const deviation = (taiex.price - targetTaiex) / targetTaiex;
    const reversionForce = -0.45 * deviation; // Keep index stable around its standard target

    const nextPrice = parseFloat((taiex.price * (1 + indexTickMovement + reversionForce)).toFixed(2));
    const change = parseFloat((nextPrice - taiex.openPrice).toFixed(2));
    const changePercent = parseFloat(((change / taiex.openPrice) * 100).toFixed(2));
    
    const extraVolume = Math.floor(Math.random() * 500) + 100;
    const volume = taiex.volume + extraVolume;
    const history = [...taiex.history.slice(1), nextPrice];

    const updatedTaiexHigh = nextPrice > taiex.high52Week ? nextPrice : taiex.high52Week;
    const updatedTaiexLow = nextPrice < taiex.low52Week ? nextPrice : taiex.low52Week;
    const targetTaiexRatio = 50 + (changePercent * 2.5) + (Math.random() * 4 - 2);
    const updatedTaiexMajorBuy = Math.max(10, Math.min(90, parseFloat(targetTaiexRatio.toFixed(1))));

    updated[taiexIndex] = {
      ...taiex,
      price: nextPrice,
      change: change,
      changePercent: changePercent,
      volume,
      history,
      high52Week: updatedTaiexHigh,
      low52Week: updatedTaiexLow,
      majorBuyPercent: updatedTaiexMajorBuy,
    };
  }

  return updated;
}
