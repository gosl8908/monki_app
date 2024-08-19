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

const serverUrl = 'http://localhost:4723';

(async () => {
    let driver;
    try {
        driver = await remote(options);
        await clickElement(driver, uiSelectorText('My먼키'));
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
    }
})();
