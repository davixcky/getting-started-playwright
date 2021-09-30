const { chromium, firefox, webkit } = require('playwright');

const example1 = async () => {
    // Launch browser
    const browser = await chromium.launch({ headless: false });

    // Create context (isolated box)
    const context = await browser.newContext();

    // Create page
    const page1 = await context.newPage();
    await page1.goto('https://yuxiglobal.com/');

    await page1.pause();
    await browser.close();
}

const example2 = async ({ browserName = 'firefox' } = {}) => {
    const browser = await {chromium, firefox, webkit}[browserName].launch({headless: false});
    const context = await browser.newContext();
    const page1 = await context.newPage();
    await page1.goto('https://yuxiglobal.com/');

    await page1.screenshot({ path: 'resources/screenshoot_example2_a.png', fullPage: true });

    if (browserName == 'chromium') await page1.pdf({path: 'resources/page.pdf'});

    await page1.waitForLoadState();
    await page1.screenshot({ path: 'resources/screenshoot_example2_b.png', fullPage: false });

    console.log(await page1.title())


    await page1.pause();
    await browser.close();
}

const example3 = async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    await context.tracing.start({ screenshots: true, snapshots: true });
    const page = await context.newPage();
    await page.goto('https://playwright.dev');
    await context.tracing.stop({ path: 'trace.zip' });

    //await context.tracing.startChunk();
    // interactions
    // await context.tracing.stopChunk({ path: 'trace2.zip' });
}

// example1();
// example2({ browserName: 'webkit' });
example3();