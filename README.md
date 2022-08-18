# Google Photos Non-Free Detector

This program scans your Google photos, and saves a list of every media that takes space from your account into the `photos.txt` file, where the first line is the number of such media, the second line is the total number of media in your account, each subsequent line is an empty line, followed by a link to such a photo, followed by the size in bytes, and repeat.

Here's an example of that file:

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
