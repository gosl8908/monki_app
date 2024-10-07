const { remote } = require('webdriverio');
const { appoptions, env } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수

(async () => {
    let driver;
    try {
        driver = await remote(appoptions);

        await utils.wait(5 * 1000);

        await utils.click(driver, utils.uiSelectorText('My먼키'));

        await utils.click(driver, utils.uiSelectorText('주소설정'));

        await utils.click(driver, utils.uiSelectorText('현재 위치 찾기'));

        await utils.enterText(driver, utils.uiedit('상세주소를 입력해 주세요'), '1');

        await utils.enterText(driver, utils.uiedit('명칭을 입력해 주세요'), '1');

        await utils.click(driver, utils.uiSelectorText('주소로 설정하기'));

        await utils.contains(driver, utils.uiSelectorText('주소가 등록되었습니다.'));

        await utils.click(driver, utils.uiSelectorText('확인'));
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        await utils.finish(driver, appoptions);
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.AppEmailTitle}]`,
            TestRange: '1. 테스트',
            Screenshots,
        });
    }
})();
