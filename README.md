# Google Photos Non-Free Detector

This program scans your Google photos, and saves a list of every media that takes space from your account into the `photos.txt` file, where the first line is the number of such media, the second line is the total number of media in your account, each subsequent line is an empty line, followed by a link to such a photo, followed by the size in bytes, and repeat.

Go to Google Photos, open Dev Tools by F12, or however else it is done in your browser. Go to the network tab, and refresh the page. Now, find the request to `/`, scroll down to Request headers, right click on cookie, and hit `Copy Value`. Now, create a new file `cookie.txt`, next to all the code files (`main.js`, `package.json`, etc.), and paste that cookie in there.

Now run the following commands in the same folder:

Install the dependencies:

```sh
npm i
```

Run the program:

```sh
node .
```

Here's an example of the `photos.txt` file:

```
3
374

https://photos.google.com/photo/AF1QipSAF4094j0f43_-wfewv-w-e_c332uwj0j
239048

https://photos.google.com/photo/AF1Qip4gWT65HY5g4-34f34f_34gioj34fj09je
349032

https://photos.google.com/photo/AF1Qipqwcprj9094380vdWDWFfd290d2--_2F3l
120493
```
