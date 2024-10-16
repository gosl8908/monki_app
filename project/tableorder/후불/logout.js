const { remote } = require('webdriverio');
const { tableorder, env } = require('../../../config.js');
const utils = require('../../../module/utils.js');
const Module = require('../../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');

const serverUrl = 'http://localhost:4724';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수

(async () => {
    let driver;
    try {
        driver = await remote(
            tableorder(4724, env.GalaxyTabS7FE.deviceName, env.GalaxyTabS7FE.udid, env.GalaxyTabS7FE.platformVersion),
        );
        await utils.wait(10 * 1000);
        const currentPackage = await driver.getCurrentPackage();
        const currentActivity = await driver.getCurrentActivity();
        console.log('Current app package:', currentPackage);
        console.log('Current app activity:', currentActivity);

        await Module.loginModule.TOlogin(driver, env.testid3, env.testpwd3);

        await Module.orderModule.adminMode(driver, '101');

        await utils.click(driver, utils.view('설정\n탭 5개 중 5번째')); // 시스템설정
        await utils.click(driver, utils.btnText('로그아웃'));
        await utils.contains(driver, utils.view('로그인'));
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        await utils.finish(driver, tableorder());
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange: '1. 테이블오더 로그아웃',
            Screenshots,
        });
    }
})();
