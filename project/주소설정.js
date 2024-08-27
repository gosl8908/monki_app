const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const utils = require('../module/utils');
const Module = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수
let Failure = false;

(async () => {
    let driver;
    try {
        driver = await remote(options);

        await utils.wait(5 * 1000);

        await utils.click(driver, utils.uiSelectorText('My먼키'));

        await utils.click(driver, utils.uiSelectorText('주소설정'));

        await utils.click(driver, utils.uiSelectorText('현재 위치 찾기'));

        await utils.enterText(driver, '//android.widget.EditText[@text="상세주소를 입력해 주세요"]', '1');

        await utils.enterText(driver, '//android.widget.EditText[@text="명칭을 입력해 주세요"]', '1');

        await utils.click(driver, utils.uiSelectorText('주소로 설정하기'));

        await utils.contains(driver, '주소가 등록되었습니다.');

        await utils.click(driver, utils.uiSelectorText('확인'));
    } catch (error) {
        console.error(error);
        Failure = true;
        TestFails.push(error.message);
    } finally {
        if (Failure) {
            if (driver) {
                await utils.screenshot(driver, Screenshots);
                try {
                    await driver.deleteSession();
                    console.log('Driver session ended.');
                } catch (deleteSessionError) {
                    console.error('Error ending driver session:', deleteSessionError);
                }
            }
        }
        const TestRange = '1. 테스트';
        await Module.emailModule.email({
            TestFails: TestFails,
            EmailTitle: `[${env.EmailTitle}]`,
            TestRange: TestRange,
            Screenshots: Screenshots,
        });
    }
})();
