const { remote } = require('webdriverio');
const { options, getFormattedTime, env } = require('../config.js');
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
    pressVolumeButton,
} = require('../module/utils.js');
const { loginModule } = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';

(async () => {
    let driver;
    try {
        driver = await remote(options);
        await wait(5 * 1000);

        await loginModule.login(driver, env.email, env.password);
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
    }
})();
