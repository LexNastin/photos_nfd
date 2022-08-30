// awesome work (Queue) stolen from https://www.javascripttutorial.net/javascript-queue/ :)
class Queue {
  constructor() {
    this.elements = {};
    this.head = 0;
    this.tail = 0;
  }
  enqueue(element) {
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue() {
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }
  peek() {
    return this.elements[this.head];
  }
  get length() {
    return this.tail - this.head;
  }
  get isEmpty() {
    return this.length === 0;
  }
}

function timeout(time) {
  return new Promise(async (res, rej) => {
    setTimeout(() => {
      res();
    }, time);
  });
}

async function worker(queue, response, batchexecute, cookie, finished, i) {
  while (!queue.isEmpty) {
    let newItem = queue.dequeue();
    if (!newItem[0]) break;
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
      let queue = new Queue();
      photoDates.dates.forEach((item) => {
        queue.enqueue([item.start, item.end]);
      });
      let resp = [];
      let workers = [];
      let finished = [];
      for (let i = 0; i < 50; i++) {
        workers.concat(worker(queue, resp, batchexecute, cookie, finished, i));
      }
      while (finished.length < 50) {
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
