const { remote } = require('webdriverio');
const { options, getFormattedTime } = require('../config.js');
const fs = require('fs'); // fs 모듈 추가
const path = require('path'); // path 모듈 추가
const {
    clickElement,
    scroll,
    wait,
    uiSelectorText,
    uiSelectorBtnText,
    inputText,
    enterText,
} = require('../module/utils.js');

const serverUrl = 'http://localhost:4723';

(async () => {
    let driver;
    try {
        driver = await remote(options);

        // 스크린샷 캡처
        await driver.takeScreenshot().then(screenshot => {
            const screenshotPath = path.join(
                __dirname,
                '../screenshot',
                `screenshot_${getFormattedTime().DateLabel}.jpg`,
            );
            fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
            fs.writeFileSync(screenshotPath, screenshot, 'base64');
        });
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
    }
})();
