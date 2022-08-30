const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const path = require("path");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const prompt = require("prompt-sync")({ sigint: true });
puppeteer.use(StealthPlugin());
let Ui = [];
let bl = [];
let fsid = [];
let at = [];
let reqid = [Math.floor(Math.random() * 8999) + 1000];
const request = require("./modules/request");
const batchexecute = require("./modules/batchexecute")(
  request,
  bl,
  at,
  fsid,
  reqid
);
const getPhotoDates = require("./modules/getPhotoDates")(batchexecute);
const getPhotoIds = require("./modules/getPhotoIds")(batchexecute);

function authenticate() {
  let resp = prompt("Paste https://photos.google.com/ cookie here: ");
}

function getWIZValues(cookie, photosRequest) {
  Ui[0] = "PhotosUi";
  bl[0] = "boq_photosuiserver_20220823.03_p1";
  fsid[0] = photosRequest.data
    .match(/"FdrFJe":"(.*?)"/g)[0]
    .replace(/"FdrFJe":"(.*?)"/g, "$1");
  at[0] = photosRequest.data
    .match(/"SNlM0e":"(.*?)"/g)[0]
    .replace(/"SNlM0e":"(.*?)"/g, "$1");
}

(async () => {
  let cookie;
  let cookieFD = fs.openSync(path.join(__dirname, "./cookie.txt"), "a+");
  let cookieRead = fs.readFileSync(cookieFD, {
    encoding: "utf8",
  });

  if (cookieRead) {
    console.log("Found saved authentication, proceeding...");
    cookie = cookieRead.trim();
  } else {
    console.log("Not yet logged in, please do that first");
    process.exit();
    /* cookie = await authenticate(); */
    /* fs.writeSync(cookieFD, cookie); */
  }
  fs.closeSync(cookieFD);

  let photosRequest = await request("get", "https://photos.google.com/", {
    headers: {
      Cookie: cookie,
    },
  });
  getWIZValues(cookie, photosRequest);
  let photoDates = await getPhotoDates(cookie, photosRequest);
  let photoIds = await getPhotoIds(cookie, photoDates);
  console.log(photoIds);
})();
