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
const { loginModule } = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';

(async () => {
    let driver;
    try {
        driver = await remote(options);
        await wait(5 * 1000);
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
    }
})();
