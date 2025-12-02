const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const urls = fs.readFileSync('urls.txt').toString().split("\n").filter(Boolean);

  console.log("Total URLs:", urls.length);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  let count = 0;

  for (const url of urls) {
    const page = await browser.newPage();
    try {
      await page.goto(url.trim(), { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 3000)); // Vent 3 sek så GTM får kjørt
      console.log("Visited:", url);
      count++;
    } catch (e) {
      console.log("FAILED:", url, e.message);
    }
    await page.close();
  }

  await browser.close();
  console.log("DONE! Total pages visited:", count);
})();
