const axios = require("axios");

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

module.exports = request;
