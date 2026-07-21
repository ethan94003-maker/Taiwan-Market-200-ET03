import fetch from "node-fetch";

async function test() {
  const url = "https://www.tpex.org.tw/openapi/v1/exchangeReport/STOCK_DAY_ALL";
  try {
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("Status:", res.status, res.statusText);
    const text = await res.text();
    console.log("Length:", text.length);
    console.log("Preview:", text.slice(0, 200));
  } catch (err: any) {
    console.log("Error:", err.message);
  }
}

test();
