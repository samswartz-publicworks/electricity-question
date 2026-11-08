# Regression sweep

`node test/sweep.js` (needs `npm i playwright`; set `executablePath` to a Chromium build) loads the page in a phone-sized browser, runs six boundary scenarios, and prints every generated sentence for each: the headline, the risk line, the gut comparison, the four people figures, the summary bullets, the questions raised, and the certainty equivalent. It also reports script errors.

Scenarios: Acemoglu with every input "very sure"; a doomer (30% catastrophe, 20% extinction, 10% of gains reaching most people, 80% displacement, full discount); a near-zero economy with no risk; an optimist (100% reach, no displacement, gut 9.5); mid-range with full risk linkage, 10% catastrophe and maximum risk aversion; mid-range with 0% reach and no discount.

Run it after any change to the model or copy and read the output for sentences that claim more than the arithmetic supports.
