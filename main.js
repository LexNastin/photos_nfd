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
const getPhotos = require("./modules/getPhotos")(batchexecute);

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
  let photos = await getPhotos(cookie, photoIds);
  let photoFD = fs.openSync(path.join(__dirname, "./photos.txt"), "w+");
  let jsonOut = {};
  let photoJFD = fs.openSync(path.join(__dirname, "./photos.json"), "w+");
  fs.writeSync(photoFD, `${photos.length}\n`);
  fs.writeSync(photoFD, `${photoIds.length}\n`);
  jsonOut["paid_photos"] = photos.length;
  jsonOut["total_photos"] = photoIds.length;
  jsonOut["photos"] = [];
  photos.forEach((photo) => {
    fs.writeSync(photoFD, `\nhttps://photos.google.com/photo/${photo[0]}\n`);
    fs.writeSync(photoFD, `${photo[1]}\n`);
    fs.writeSync(photoFD, `${photo[2]}\n`);
    jsonOut["photos"] = jsonOut["photos"].concat({
      uri: `https://photos.google.com/photo/${photo[0]}`,
      size: photo[1],
      timestamp: photo[2],
    });
  });
  fs.writeSync(photoJFD, JSON.stringify(jsonOut));
  fs.closeSync(photoFD);
  fs.closeSync(photoJFD);
})();
