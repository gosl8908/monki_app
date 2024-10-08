const { remote } = require('webdriverio');
const { tableorderoptions, env } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');

const serverUrl = 'http://localhost:4724';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수

(async () => {
    let driver;
    try {
        driver = await remote(tableorderoptions);
        await utils.wait(10 * 1000);
        const currentPackage = await driver.getCurrentPackage();
        const currentActivity = await driver.getCurrentActivity();
        console.log('Current app package:', currentPackage);
        console.log('Current app activity:', currentActivity);
        await Module.orderModule.order(driver, '코카콜라', '2,500');

        await Module.orderModule.adminMode(driver, '1-1');

        /* 자리교환 */
        await utils.click(driver, utils.btnText('자리변경'));
        await utils.click(driver, utils.view('1-1'));
        await utils.click(driver, utils.view('1-2'));
        await utils.click(driver, utils.btnText('이동'));

        await utils.contains(driver, utils.containsview('1-2'));
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        await utils.finish(driver, tableorderoptions);
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange: '1. 테이블오더 테이블교환',
            Screenshots,
        });
    }
})();
