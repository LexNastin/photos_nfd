const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const path = require("path");
const axios = require("axios");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

function request(method, url, ...params) {}

function authenticate() {
  return new Promise(async (res, _) => {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const photos = await browser.newPage();
    await photos.goto("https://photos.google.com/login");
    photos.on("request", async (req) => {
      if (req.url() === "https://photos.google.com/") {
        res(await photos.cookies());
        await browser.close();
      }
    });
  });
}

function getPhotoDates() {
  return new Promise(async (res, _) => {
    //
  });
}

(async () => {
  let cookie;
  let cookieFD = fs.openSync(path.join(__dirname, "./cookie.txt"), "a+");
  let cookieRead = fs.readFileSync(cookieFD, {
    encoding: "utf8",
  });

  if (cookieRead) {
    console.log("Found saved authentication, proceeding...");
    cookie = JSON.parse(cookieRead);
  } else {
    console.log("Not yet logged in, please do that first");
    cookie = await authenticate();
    fs.writeSync(cookieFD, JSON.stringify(cookie));
  }
  fs.closeSync(cookieFD);
})();
