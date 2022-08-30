function timeout(time) {
  return new Promise((res, _) => {
    setTimeout(() => {
      res();
    }, time);
  });
}

function test1(obj) {
  return new Promise(async (res, rej) => {
    await timeout(3000);
    obj[0] = true;
  });
}

function test() {
  return new Promise(async (res, rej) => {
    let obj = [false];

    test1(obj);
    while (obj[0] == false) {
      await timeout(5000);
      console.table(obj);
    }
    res();
  });
}

async function main() {
  await test();
  console.log("timeout");
}

main();
