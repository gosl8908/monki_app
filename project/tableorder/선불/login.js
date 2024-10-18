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
            tableorder(
                4724,
                env.GalaxyTabA8.deviceName,
                env.GalaxyTabA8.port + ':42067',
                env.GalaxyTabA8.platformVersion,
            ),
        );
        await utils.wait(5 * 1000);
        const currentPackage = await driver.getCurrentPackage();
        const currentActivity = await driver.getCurrentActivity();
        console.log('Current app package:', currentPackage);
        console.log('Current app activity:', currentActivity);

        await Module.loginModule.TOlogin(driver, env.testid2, env.testpwd2);
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        await utils.finish(driver, tableorder());
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange: '1. 테이블오더 로그인',
            Screenshots,
        });
    }
})();
