const { test, expect } = require('@playwright/test');

test('skyscanner_prices_comparison', async ({ page }) => {
  // 1. Navigate to the Skyscanner website
  await page.goto('https://www.skyscanner.in');
  await page.waitForLoadState('load');
  console.log("1. LOADED THE PAGE.");

  // 2. Enter origin and destination cities
  await page
    .getByRole('combobox', { name: "Enter the city you're flying" })
    .click();
  await page
    .getByRole('combobox', { name: "Enter the city you're flying" })
    .fill('Stockholm');
  await page.getByText('Stockholm (Any)Sweden').click();

  await page
    .getByRole('combobox', { name: '. Enter your destination, or' })
    .click();
  await page
    .getByRole('combobox', { name: '. Enter your destination, or' })
    .fill('Sweden');
  await page.getByText('Sweden (SE)Sweden').click();
  console.log("2. ENTERED ORIGIN AND DESTINATION CITIES.");

  // 3. Enter travel dates and search
  await page.getByTestId('depart-btn').click();
  await page.getByLabel('Sunday, 24 December 2023.').click();
  await page.getByLabel('Saturday, 6 January 2024.').click();
  await page.getByTestId('traveller-button').click();
  await page.getByTestId('desktop-cta').click();
  console.log("3. ENTERED THE START DATE AS 24 DEC 2023 AND END DATE AS 6 JAN 2024 SUCCESSFULLY. PASSENGER IS 1 ADULT AND CLICKED ON SEARCH.");

  // 4. Wait for the page to load
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(5000);
  console.log("4. WAITED FOR 5 SECONDS AND DOM TO LOAD.");

  // 5. Get the initial price
  const elements = await page.$('div[class*="PriceDescription_priceContainer"] div span');
  const initial_price_data = await elements.textContent();
  const [initial_price, currency] = initial_price_data.trim().split(/\s+/);
  console.log(`5. PRICE BEFORE CLICKING THE LINK: ${initial_price}.`);

  // 6. Click on the first result link and get the final price
  await page.locator('.BpkBackgroundImage_bpk-background-image__img__NDhjM').first().click();
  const newpage = await page.waitForEvent('popup');
  await newpage.waitForLoadState('load');
  await newpage.waitForTimeout(3500);
  const final_price_data = await newpage.waitForSelector('button[aria-label="Flight option 1: Total cost"]').innerText();
  const [final_price] = final_price_data.trim().split(/\s+/);
  console.log(`6. PRICE AFTER OPENING THE FIRST RESULT LINK: ${final_price}.`);

  // 7. Compare initial and final prices
  if (initial_price === final_price) {
    console.log("\nCONCLUSION: TEST LOGIC PASSED.");
    console.log(`1. PRICES ARE MATCHING FROM THE RESULTS PAGE AND INSIDE RESULT LINK.`);
    console.log(`2. THE INITIAL PRICE RECORDED IS ${initial_price} AND THE FINAL PRICE RECORDED IS ${final_price}.`);
  } else {
    console.log("\nCONCLUSION: TEST LOGIC FAILED.");
    console.log(`1. PRICES ARE NOT MATCHING FROM THE RESULTS PAGE AND INSIDE RESULT LINK.`);
    console.log(`2. THE INITIAL PRICE RECORDED IS ${initial_price} AND THE FINAL PRICE RECORDED IS ${final_price}.`);
    console.log(`3. THE PRICE DIFFERENCE IS: ${currency} ${Math.abs(parseInt(initial_price.replace(",", "").replace(" ", "")) - parseInt(final_price.replace(",", "").replace(" ", "")))}.`);
  }
});
