const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const path = require("path");
const qs = require("qs");
const axios = require("axios");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const prompt = require("prompt-sync")({ sigint: true });
puppeteer.use(StealthPlugin());
let Ui;
let bl;
let fsid;
let at;
let reqid = Math.floor(Math.random() * 8999) + 1000;

function request(method, url, ...params) {
  return new Promise(async (res, rej) => {
    axios[method](url, ...params)
      .then((resp) => {
        res(resp);
      })
      .catch((err) => {
        rej(err);
      });
  });
}

// pass arrays of info
async function batchexecute(cookie, ...info) {
  let rpcids = info
    .map((item) => {
      return item[0];
    })
    .join();
  let body = qs.stringify({
    "f.req": JSON.stringify([info]),
    at: at, // FIX
  });
  let resp = await request(
    "post",
    `https://photos.google.com/_/PhotosUi/data/batchexecute?rpcids=${rpcids}&f.sid=${fsid}&bl=${bl}&hl=en-GB&rt=c&_reqid=${
      (reqid += 100000) - 100000
    }`,
    body,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
      },
    }
  );
  let temp = {};
  JSON.parse(resp.data.split("\n")[3]).forEach((item) => {
    temp[item[1]] = JSON.parse(item[2]);
  });
  return temp;
}

function authenticate() {
  /* return new Promise(async (res, _) => { */
  /*   const browser = await puppeteer.launch({ */
  /*     headless: false, */
  /*   }); */
  /*   const photos = await browser.newPage(); */
  /*   await photos.goto("https://photos.google.com/login"); */
  /*   photos.on("request", async (req) => { */
  /*     if (req.url() === "https://photos.google.com/") { */
  /*       res(await photos.cookies()); */
  /*       await browser.close(); */
  /*     } */
  /*   }); */
  /* }); */
  let resp = prompt("Paste https://photos.google.com/ cookie here: ");
}

function getPhotoDates(cookie, photosRequest) {
  return new Promise(async (res, _) => {
    let dataCallbacks = photosRequest.data.match(
      /AF_initDataCallback\((.*?)\)/g
    );
    dataCallbacks = dataCallbacks.map((item) => {
      return item.replace(/AF_initDataCallback\((.*?)\)/g, "$1");
    });
    dataCallbacks = dataCallbacks.filter((item) => {
      return item.indexOf("ds:3") != -1;
    })[0];
    eval("var response = " + dataCallbacks);
    let total_photos = response.data[0];
    let numbers = response.data[1].map((item) => {
      return {
        start: item[0],
        end: item[1],
        photos: item[2],
      };
    });
    let continue_key = response.data[2];
    while (continue_key) {
      let tmpResp = await batchexecute(cookie, [
        "rJ0tlb",
        JSON.stringify([continue_key, null, 1]),
      ]);
      numbers = numbers.concat(
        tmpResp["rJ0tlb"][1].map((item) => {
          return {
            start: item[0],
            end: item[1],
            photos: item[2],
          };
        })
      );
      continue_key = tmpResp["rJ0tlb"][2];
    }
    response.data[1] = numbers;
    let totala = 0;
    numbers.forEach((item) => {
      totala += item.photos;
    });
    res({
      total: total_photos,
      total_calculated: totala,
      dates: numbers,
    });
  });
}

function getWIZValues(cookie, photosRequest) {
  Ui = "PhotosUi";
  bl = "boq_photosuiserver_20220823.03_p1";
  fsid = photosRequest.data
    .match(/"FdrFJe":"(.*?)"/g)[0]
    .replace(/"FdrFJe":"(.*?)"/g, "$1");
  at = photosRequest.data
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
})();
