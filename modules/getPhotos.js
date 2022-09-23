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
  i,
  total
) {
  let position = i;
  while (position < queue.length) {
    let newItem = queue[position];
    position += iNumber;
    if (!newItem) break;
    let resp = await batchexecute(cookie, [
      "fDcn4b",
      JSON.stringify([newItem, 2]),
    ]);
    if (!resp) break;
    let item = resp["fDcn4b"][0];
    if (item[30][0] == 1) {
      response[response.length] = [newItem, item[30][1], item[3]];
    }
    total[0]++;
    console.log(`${((total[0] / queue.length) * 100).toFixed(2)}%`);
    console.log("Paid Photos So Far: " + response.length);
  }
  finished[finished.length] = i;
}

function gen_gp(batchexecute) {
  return function getPhotos(cookie, photoIds) {
    return new Promise(async (res, _) => {
      let queue = [];
      photoIds.forEach((item) => {
        queue = queue.concat(item);
      });
      let resp = [];
      let finished = [];
      let iNumber = 100;
      let total = [0];
      console.log("Step 3:");
      for (let i = 0; i < iNumber; i++) {
        worker(queue, resp, batchexecute, cookie, finished, iNumber, i, total);
      }
      while (finished.length < iNumber) {
        await timeout(500);
      }
      res(
        resp.sort((a, b) => {
          return a[2] > b[2] ? -1 : 1;
        })
      );
    });
  };
}

module.exports = gen_gp;
