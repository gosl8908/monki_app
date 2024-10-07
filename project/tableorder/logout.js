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
        await utils.wait(3000);
        const currentPackage = await driver.getCurrentPackage();
        const currentActivity = await driver.getCurrentActivity();
        console.log('Current app package:', currentPackage);
        console.log('Current app activity:', currentActivity);

        await utils.touchTap(driver, 0.1, 0.05);
        await utils.touchTap(driver, 0.1, 0.05);

        await utils.click(driver, utils.view('1-3'));
        await utils.click(driver, utils.view('1-3'));

        for (let i = 0; i < 6; i++) {
            await utils.click(driver, utils.view('1'));
        }
        await utils.click(driver, utils.btnText('확인'));
        await utils.click(driver, utils.view('관리자 모드'));
        await utils.click(driver, utils.btnText('확인'));

        await utils.click(driver, utils.view('설정\n탭 5개 중 5번째')); // 시스템설정
        await utils.click(driver, utils.btnText('로그아웃'));
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        // await utils.finish(driver, tableorderoptions);
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange: '1. 테이블오더 로그아웃',
            Screenshots,
        });
    }
})();
