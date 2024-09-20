const { remote } = require('webdriverio');
const { tableorderoptions, env } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');

const serverUrl = 'http://localhost:4725';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수

(async () => {
    // for (let i = 0; i < 10; i++) {
    let driver;
    try {
        driver = await remote(tableorderoptions);
        // const currentPackage = await driver.getCurrentPackage();
        // const currentActivity = await driver.getCurrentActivity();
        // console.log('Current app package:', currentPackage);
        // console.log('Current app activity:', currentActivity);
        await utils.wait(3000);

        const ID = await driver.$(`android=new UiSelector().className("android.widget.EditText")`);
        await ID.click();
        await ID.setValue('monkitest2');

        const Password = await driver.$$(`android=new UiSelector().className("android.widget.EditText")`);
        await Password[1].click();
        await Password[1].setValue('test123!');
        await driver.pressKeyCode(66);

        await utils.click(driver, utils.btnText('로그인'));

        // await utils.touchTap(driver, 0.4, 0.6);
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        await utils.finish(driver, tableorderoptions);
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange: '1. 테스트',
            Screenshots,
        });
    }
})();
