const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const utils = require('../module/utils');
const Module = require('../module/manager.module.js');
const { constants } = require('buffer');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수
let Failure = false;

(async () => {
    let driver;
    try {
        driver = await remote(options);

        await utils.wait(5 * 1000);
        await Module.loginModule.login(driver, env.email, env.password);

        // await utils.click(driver, utils.uiSelectorText('asdasdasd'));

        // const text = await driver.$(utils.uiSelectorText('자주가는 먼키지점을 설정할 수 있어요'));
        // if (await text.isDisplayed()) {

        // await utils.scroll(driver, 0.5, 0.8, 0.5, 0.0);
        // await utils.touchTap(driver, 0.0491, 0.0615);
        // }

        // await searchModule.search(driver, '몬키지점stg');
        // await payModule.pay(driver, env.cardPassword);
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
