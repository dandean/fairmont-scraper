# Fairmont Scraper

This is a crappy little script which scrapes a hotel at Whistler for 60 days of prices.

I wrote this because our schedule is flexible and I just want the cheapest days. Unfortunately they can't tell me this over the phone, and I can deal with clicking through every single date manually.

https://twitter.com/dandean/status/847940963360137216

## Usage

Just execute `index.js` and it will print run through their site, printing 60 days of prices to `stdout`. Modify `index.js` to change the behavior for your needs.

```sh
./index.js
01-Jan-2018 989
02-Jan-2018 1199
03-Jan-2018
04-Jan-2018
05-Jan-2018
06-Jan-2018 959
07-Jan-2018 589
08-Jan-2018 689
09-Jan-2018 589
10-Jan-2018 589
11-Jan-2018 589
12-Jan-2018 789
13-Jan-2018
14-Jan-2018
15-Jan-2018 629
16-Jan-2018
17-Jan-2018
18-Jan-2018 589
19-Jan-2018
20-Jan-2018 789
...
```
