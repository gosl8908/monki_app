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
        await clickElement(driver, uiSelectorText('My먼키'));
        await wait(5 * 1000);
        await clickElement(driver, uiSelectorText('주소설정'));
        await wait(5 * 1000);
        await clickElement(driver, uiSelectorText('현재 위치 찾기'));
        await wait(5 * 1000);
        await enterText(driver, '//android.widget.EditText[@text="상세주소를 입력해 주세요"]', '1');
        await wait(5 * 1000);
        await enterText(driver, '//android.widget.EditText[@text="명칭을 입력해 주세요"]', '1');
        await wait(5 * 1000);
        await clickElement(driver, uiSelectorText('주소로 설정하기'));
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
    }
})();
