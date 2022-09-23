function gen_gpd(batchexecute) {
  return function getPhotoDates(cookie, photosRequest) {
    return new Promise(async (res, _) => {
      console.log("Step 1:");
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
  };
}

module.exports = gen_gpd;
