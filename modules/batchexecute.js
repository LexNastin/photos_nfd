const qs = require("qs");

function gen_be(request, bl, at, fsid, reqid) {
  return async function batchexecute(cookie, ...info) {
    let rpcids = info
      .map((item) => {
        return item[0];
      })
      .join();
    let body = qs.stringify({
      "f.req": JSON.stringify([info]),
      at: at[0],
    });
    let resp = await request(
      "post",
      `https://photos.google.com/_/PhotosUi/data/batchexecute?rpcids=${rpcids}&f.sid=${
        fsid[0]
      }&bl=${bl[0]}&hl=en-GB&rt=c&_reqid=${(reqid[0] += 100000) - 100000}`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Cookie: cookie,
        },
      }
    );
    let temp = {};
    let respDeco = JSON.parse(resp.data.split("\n")[3]);
    respDeco.forEach((item) => {
      try {
        if (!temp[item[1]]) {
          temp[item[1]] = JSON.parse(item[2]);
        } else {
          if (temp[item[1]][0] != "multiple") {
            let tmp = temp[item[1]];
            temp[item[1]] = ["multiple", tmp];
          }
          let length = temp[item[1]].length;
          temp[item[1][length]] = JSON.parse(item[2]);
        }
      } catch (err) {
        return undefined;
      }
    });
    return temp;
  };
}

module.exports = gen_be;
