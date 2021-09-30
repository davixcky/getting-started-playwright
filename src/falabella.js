const { chromium } = require('playwright');

class Falabella {
    constructor({ baseUrl = 'https://www.falabella.com.co/falabella-co' } = {}) {
        this.baseUrl = baseUrl;
    }

    async initialize() {
        this.browser = await chromium.launch({ headless: false });
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();

        await this.page.goto(this.baseUrl);
    }

    async search({ productName }) {
        if (!productName) throw new Error('productName cannot be empty');

        const page = this.page;
        await page.reload();
        await page.fill('#testId-SearchBar-Input', productName);
        await page.click('.SearchBar-module_searchBtnIcon__6KVum');

        await page.waitForNavigation()
        const productsSections = await page.$('#testId-searchResults-products');

        await page.waitForLoadState();
        const products = await productsSections.$$('div.grid-pod');

        console.log(products.length)

        for (const product of products) {

            const title = await product.$('b[id^=testId-pod-displaySubTitle]');
            const price = await product.$('div[id^=testId-pod-prices]')


            const info = {
                title: title && await title.textContent(),
                price: price && this._cleanPrice(await price.textContent()),
            }

            await product.screenshot({path: this._createPath(productName, info.title)});


            console.log(info);
        }
    }

    _cleanPrice(pricestring) {
        return pricestring.split(' ')[2].trim();
    }

    _createPath(productSearch, productTitle) {
        const clean = (text) => {
            return text.replace(new RegExp('/', 'g'), ' ').split(' ').join('-')
        }
    
        return `resources/products/${clean(productSearch)}/${clean(productTitle)}.png`;
    }
}

(async () => {
    const falabella = new Falabella();
    await falabella.initialize();

    await falabella.search({ productName: 'iphone 6' });
    await falabella.search({ productName: 'iphone 8' });
    await falabella.search({ productName: 'lenovo' });
    await falabella.search({ productName: 'hp portatil' });
})();