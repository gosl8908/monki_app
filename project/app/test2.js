const { remote } = require('webdriverio');
const { appoptions, env } = require('../../config.js');
const utils = require('../../module/utils.js'); // utils 모듈을 가져옵니다.
const Module = require('../../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 배열

(async () => {
    let driver;
    try {
        driver = await remote(appoptions);
        await utils.wait(5 * 1000);
        // await Module.bootModule.boot(driver);
        const appPackage = appoptions.capabilities['appium:appPackage'];
        console.log('App Package:', appPackage);
        await driver.removeApp(appPackage);
        console.log('App removed.');
        // await Module.loginModule.login(driver, env.email, env.password);
        // await utils.touchTap(driver, 0.1, 0.05);
        // await utils.click(driver, utils.uiSelector('로그인'));
        // await utils.scroll(driver, 0.5, 0.7, 0.5, 0.0);
        // const selector = utils.uiSelectorText('번개지점(stg)3333');
        // const element = await driver.$(selector);
        // await element.waitForExist({ timeout: 10000 });
        // await element.isDisplayed({ timeout: 10000 });
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        // await utils.finish(driver, appoptions);
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.AppEmailTitle}]`,
            TestRange: '1. 지점 배달 결제',
            Screenshots,
        });
    }
})();
