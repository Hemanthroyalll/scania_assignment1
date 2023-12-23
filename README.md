# scania_assignment

### Assignemt Description:
- Open www.skyscanner.net
- Give origin as "Stockholm" and destination as "Sweden" 
- Choose travel dates 24 Dec 2023 and return date 06 Jan 2024 and 1 adult as a passenger.
- Search for flights
- Click on the first entry and see the lowest price shown there is the same as the lowest price shown when clicking on the link.
- For ex: if it shows 500 SEK for Gothenburg as the cheapest as the first link, when clicking on the link it should show the same 500 SEK as the cheapest. If it shows a different price, then the test case should be failed. Otherwise, it should show as passed.

You can choose any open-source testing tool of your choice. For Ex: selenium, playwright, webdriverIO etc..

Tool Selected:
Research on Testing Tools
Before diving into the automation process, a thorough examination of various testing tools was conducted. This exploration encompassed tools requiring coding for testing, such as Selenium, Appium, Playwright. Katalon, StackBrowser, Cypress, TestCafe, UiPath, and those that don't require any coding.

Selection Criteria:
Among the plethora of testing tools, Selenium and Playwright emerged as the top contenders based on the following criteria:

Community Support:
Both Selenium and Playwright boast large and active communities. This ensures a wealth of resources, forums, and documentation for problem-solving and continuous improvement.

Open Source:
Selenium and Playwright are open-source tools, promoting accessibility and flexibility. Open-source tools typically have a broader user base and continuous updates.

Cross-Browser Compatibility:
Selenium and Playwright support multiple browsers, ensuring comprehensive test coverage across different platforms.

Multi-Language Support:
Selenium and Playwright support multiple programming languages, allowing teams to choose the language they are most comfortable with or the one that aligns with the project's tech stack.
# Playwright

<p>Tool used for testing: <b>Playwright Automation Tool</b></p>

Choice of Playwright:
Playwright emerges as the modern web automation leader, surpassing Selenium in several aspects: native API integration, multiple browser support, handling modern web features, enhanced performance, and a user-friendly API. Opt for Playwright for seamless web automation.
## Installation

Playwright has its own test runner for end-to-end tests, we call it Playwright Test.

### Using init command

The easiest way to get started with Playwright Test is to run the init command.

```Shell
# Run from your project's root directory
npm init playwright@latest
# Or create a new project
npm init playwright@latest new-project
```

This will create a configuration file, optionally add examples, a GitHub Action workflow and a first test example.spec.ts. You can now jump directly to writing assertions section.

### Manually

Add dependency and install browsers.

```Shell
npm i -D @playwright/test
# install supported browsers
npx playwright install
```
## Procedure

<p>Step1 : Go to > `<b>tests</b>` folder and create a new test file with <b>.spec.js</b> extension to add test script.</p>
<p>Step 2: Add the following script and save the file</p>

```Javascript
const { test, expect } = require('@playwright/test');
test('skyscanner_prices_comparison', async ({ page }) => {
  await page.goto('https://www.skyscanner.in');
  await page.waitForLoadState('load');
//   await page.pause();
  console.log("1.LOADED THE PAGE.");
  await page
    .getByRole('combobox', { name: "Enter the city you\'re flying" })
    .click();
  await page
    .getByRole('combobox', { name: "Enter the city you\'re flying" })
    .fill('Stockholm');
  await page.getByText('Stockholm (Any)Sweden').click();
  await page
    .getByRole('combobox', { name: '. Enter your destination, or' })
    .click();
  await page
    .getByRole('combobox', { name: '. Enter your destination, or' })
    .fill('Sweden');
  await page.getByText('Sweden (SE)Sweden').click();
  console.log("2.ENTERED ORIGIN AND DESTINATION CITIES.");
  await page.getByTestId('depart-btn').click();
  await page.getByLabel('Sunday, 24 December 2023.').click();
  await page.getByLabel('Saturday, 6 January 2024.').click();
  await page.getByTestId('traveller-button').click();
  await page.getByTestId('desktop-cta').click();
  console.log("3.ENTERED THE START DATE AS 24 DEC 2023 AND END DATE AS 6 JAN 2024 SUCCESSFULLY. PASSENGER IS 1 ADULT AND CLICKED ON SEARCH.");
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);
  console.log("4.WAITED FOR 5 SECONDS AND DOM TO LOAD.");
  const elements = await page.$('div[class*="PriceDescription_priceContainer"] div span');
  const initial_price_data=await elements.textContent();
  const temp1=initial_price_data.split(" ");
  const initial_price=temp1[0].replace(" ","")+' '+temp1[1].replace(" ","");
  const currency=initial_price.split(" ")[0].replace(" ","");
  console.log(`5.PRICE BEFORE CLICKING THE LINK : ${initial_price}.`);
  await page.locator('.BpkBackgroundImage_bpk-background-image__img__NDhjM').first().click();
  const newpage = await page.waitForEvent('popup');
  await newpage.waitForLoadState('load');
  await newpage.waitForTimeout(3500);
  const final_price_data = await newpage
    .getByRole('button', {
      name: 'Flight option 2: Total cost',
    })
    .textContent();
  const myArray = final_price_data.split('.');
  const temp=myArray[0].split(" ");
  const final_price=temp[temp.length - 2].replace(" ","")+" "+temp[temp.length - 1].replace(" ","");
  console.log(`6.PRICE AFTER OPENING THE FIRST RESULT LINK : ${final_price}.`);
  if (initial_price === final_price) {
    console.log();
    console.log(`CONCLUSION: TEST LOGIC PASSED.`);
    console.log(`1.PRICES ARE MATCHING FROM THE RESULTS PAGE AND INSIDE RESULT LINK.`);
    console.log(`2.THE INITIAL PRICE RECORDED IS ${initial_price} AND THE FINAL PRICE RECORDED IS ${final_price}.`);
  } else {
    console.log();
    console.log(`CONCLUSION: TEST LOGIC FAILED.`);
    console.log(`1.PRICES ARE NOT MATCHING FROM THE RESULTS PAGE AND INSIDE RESULT LINK.`);
    console.log(`2.THE INITIAL PRICE RECORDED IS ${initial_price} AND THE FINAL PRICE RECORDED IS ${final_price}.`);
    console.log(`3.THE PRICE DIFFERENCE IS: ${currency} ${Math.abs(parseInt(initial_price.replace(currency,"").replace(",","").replace(" ",""))-parseInt(final_price.replace(currency,"").replace(",","").replace(" ","")))}.`);
  }
});
```

<p>Step 3: Now open the terminal and execute the following command to run the test case .</p>

```Shell
npx playwright test ./tests/skyscanner_test.spec.js --project firefox --headed
```
<p><b>Here is a recored video of execution of the test case</b></p>

<p>Using Firefox</p>

https://github.com/Hemanthroyalll/scania_assignment1/assets/105798597/69238cb6-2320-4a62-b7c9-5b3b38a07825

<h1>Results</h1>
<p>The test case we executed, will test for the intial flight amount before clicking the link with the flight amount after clicking the link.</p>
<p>Here is the logic for comparison:</p>

```JavaScript
if (initial_price === final_price) {
    console.log();
    console.log(`CONCLUSION: TEST LOGIC PASSED.`);
    console.log(`1.PRICES ARE MATCHING FROM THE RESULTS PAGE AND INSIDE RESULT LINK.`);
    console.log(`2.THE INITIAL PRICE RECORDED IS ${initial_price} AND THE FINAL PRICE RECORDED IS ${final_price}.`);
  } else {
    console.log();
    console.log(`CONCLUSION: TEST LOGIC FAILED.`);
    console.log(`1.PRICES ARE NOT MATCHING FROM THE RESULTS PAGE AND INSIDE RESULT LINK.`);
    console.log(`2.THE INITIAL PRICE RECORDED IS ${initial_price} AND THE FINAL PRICE RECORDED IS ${final_price}.`);
    console.log(`3.THE PRICE DIFFERENCE IS: ${currency} ${Math.abs(parseInt(initial_price.replace(currency,"").replace(",","").replace(" ",""))-parseInt(final_price.replace(currency,"").replace(",","").replace(" ","")))}.`);
  }
});
```

<p>Here, 
  <li>If both the prices are the same then we print "TestLogic Passed"</li>
  <li>If they are different, we print "Test Logic Failed along with their price difference"</li>
</p>

<p><b>Here are few screenshots of the results</b></p>

<img width="709" alt="Screenshot 2023-12-20 at 11 53 46 AM" src="https://github.com/Hemanthroyalll/scania_assignment1/assets/105798597/6f6fc8d1-b78d-489d-9e57-17a801c4fc97">
<h1>Challenges faced during Assignment</h1>
<p>Initially, I began automating tasks using the Selenium tool. However, as the test script ran in Selenium, the browser opened a Captcha. I attempted to eradicate it, but it kept popping up. Despite my efforts to humanize the script by introducing reasonable delays between each action to overcome anti-bot measures, my attempt proved unsuccessful. I then tried various methods to circumvent the Captcha, but none of them yielded positive results.
</p>
</p>

https://github.com/Hemanthroyalll/scania_assignment1/assets/105798597/479969cb-abcd-4ebf-bd41-2210641dd46c

<p>Issue faced while executing playwright script in chromium:</p>



https://github.com/Hemanthroyalll/scania_assignment1/assets/105798597/9278b241-e305-4a9a-874c-80d7d780bf06



<p>Issue faced while executing playwright script in webkit:</p>



https://github.com/Hemanthroyalll/scania_assignment1/assets/105798597/bdec562c-55cf-4bbb-8e99-eff4b58e7ade



<h1>Conclusion</h1>

<P>Throughout the execution of the provided test case, I explored various automation testing tools, and among them, Playwright proved to be the most effective for this particular task. My approach involved using different browsers, and I found that Firefox consistently produced successful results.

Despite encountering challenges during the installation and configuration phases with some tools, Playwright demonstrated reliability in handling the specified test case. Notably, I observed a noteworthy detail: the cost displayed before and after clicking on the first entry did not consistently match. This observation raises concerns, as the test case criteria indicate that, if prices do not match then it is a failing test case. Consequently, the test case is prone to failure in most instances.

While I experimented with multiple tools, the specific nuances of this task align best with Playwright, and the insights gained from the discrepancies in pricing before and after the click are crucial for a comprehensive understanding of the testing outcomes.






</P>
