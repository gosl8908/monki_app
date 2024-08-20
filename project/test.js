const { remote } = require('webdriverio');
const { options, getFormattedTime, env } = require('../config.js');
const {
    clickElement,
    scroll,
    wait,
    uiSelectorText,
    uiSelectorBtnText,
    enterText,
    pressVolumeButton,
} = require('../module/utils.js');
const { loginModule, searchModule, payModule } = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';

(async () => {
    let driver;
    try {
        driver = await remote(options);
        await wait(5 * 1000);
        // await searchModule.search(driver, '몬키');
        /* 카드 입력 & 주문완료 확인 */
        await payModule.pay(driver, env.cardPassword);
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
    }
})();
