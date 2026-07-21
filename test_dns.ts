import fetch from "node-fetch";

async function test() {
  const url = "https://cloudflare-dns.com/dns-query?name=openapi.tpex.org.tw&type=A";
  try {
    const res = await fetch(url, {
      headers: {
        "accept": "application/dns-json"
      }
    });
    const json: any = await res.json();
    console.log("Cloudflare DoH Result:", JSON.stringify(json, null, 2));
  } catch (err: any) {
    console.log("Error Cloudflare DoH:", err.message);
  }

  const urlGoogle = "https://dns.google/resolve?name=openapi.tpex.org.tw&type=A";
  try {
    const res = await fetch(urlGoogle);
    const json: any = await res.json();
    console.log("Google DoH Result:", JSON.stringify(json, null, 2));
  } catch (err: any) {
    console.log("Error Google DoH:", err.message);
  }
}

test();
