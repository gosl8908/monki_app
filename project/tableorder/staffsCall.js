const { remote } = require('webdriverio');
const { tableorderoptions, env } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');

const serverUrl = 'http://localhost:4724';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수

(async () => {
    // for (let i = 0; i < 10; i++) {
    let driver;
    try {
        driver = await remote(tableorderoptions);
        await utils.wait(10 * 1000);
        const currentPackage = await driver.getCurrentPackage();
        const currentActivity = await driver.getCurrentActivity();
        console.log('Current app package:', currentPackage);
        console.log('Current app activity:', currentActivity);

        const waiting = await driver.$(utils.view('주문하시려면 화면을 터치해 주세요'));
        if (await waiting.isDisplayed()) {
            await utils.click(driver, utils.ImageView('주문하기'));
            await utils.wait(3 * 1000);
            await driver.$(utils.view('교촌치킨(stg)', { timeout: 10 * 1000 }));
        }
        await utils.wait(3 * 1000);
        await utils.click(driver, utils.view('직원호출'));
        await utils.wait(3 * 1000);
        await utils.click(driver, utils.check('물'));
        await utils.wait(3 * 1000);
        await utils.click(driver, utils.btnText('호출하기'));

        await utils.contains(driver, utils.view('직원을 호출하였습니다.\n잠시만 기다려주세요.'));
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        await utils.finish(driver, tableorderoptions);
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange: '1. 테이블오더 직원호출',
            Screenshots,
        });
    }
})();
