import fetch from "node-fetch";

async function test() {
  const url = "https://tpex.org.tw/openapi/v1/exchangeReport/STOCK_DAY_ALL";
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
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
