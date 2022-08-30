function timeout(time) {
  return new Promise(async (res, rej) => {
    setTimeout(() => {
      res();
    }, time);
  });
}

async function worker(
  queue,
  response,
  batchexecute,
  cookie,
  finished,
  iNumber,
  i
) {
  let position = i;
  while (position < queue.length) {
    let newItem = queue[position];
    console.log(newItem);
    position += iNumber;
    if (!newItem) break;
    let resp = await batchexecute(cookie, [
      "lcxiM",
      JSON.stringify([null, newItem[1], null, null, true, 1, newItem[0]]),
    ]);
    if (!resp) break;
    resp["lcxiM"][0].forEach((item) => {
      response[response.length] = [item[0], item[2]];
    });
  }
  finished[finished.length] = i;
}

function gen_gpi(batchexecute) {
  return function getPhotoIds(cookie, photoDates) {
    return new Promise(async (res, _) => {
      let queue = [];
      photoDates.dates.forEach((item) => {
        queue = queue.concat([[item.start, item.end]]);
      });
      let resp = [];
      let finished = [];
      let iNumber = 50;
      for (let i = 0; i < iNumber; i++) {
        worker(queue, resp, batchexecute, cookie, finished, iNumber, i);
      }
      while (finished.length < iNumber) {
        await timeout(500);
      }
      res(
        resp
          .sort((a, b) => {
            return a[1] < b[1] ? -1 : 1;
          })
          .map((item) => {
            return item[0];
          })
      );
    });
  };
}

module.exports = gen_gpi;
