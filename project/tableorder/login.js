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
        await utils.wait(3000);
        const currentPackage = await driver.getCurrentPackage();
        const currentActivity = await driver.getCurrentActivity();
        console.log('Current app package:', currentPackage);
        console.log('Current app activity:', currentActivity);

        const ID = await driver.$(`android=new UiSelector().className("android.widget.EditText")`);
        await ID.click();
        await ID.setValue('monkitest2');

        const Password = await driver.$$(`android=new UiSelector().className("android.widget.EditText")`);
        await Password[1].click();
        await Password[1].setValue('test1234');
        await driver.pressKeyCode(66);

        await utils.click(driver, utils.btnText('로그인'));

        await driver.$(utils.view('교촌치킨(stg)', { timeout: 10 * 1000 }));

        const waiting = await driver.$(utils.view('주문하시려면 화면을 터치해 주세요'));
        if (await waiting.isDisplayed()) {
            await utils.click(driver, utils.ImageView('주문하기'));
            await utils.wait(3 * 1000);
            await driver.$(utils.view('교촌치킨(stg)', { timeout: 10 * 1000 }));
        }
        await utils.wait(3 * 1000);
        await utils.click(driver, utils.view('음료'));
        await utils.wait(3 * 1000);
        await utils.click(driver, utils.ImageView('코카콜라\n2,500원'));
        await utils.wait(3 * 1000);
        await utils.click(driver, utils.btnText('2,500원 담기'));
        await utils.wait(3 * 1000);
        await utils.click(driver, utils.ImageView('장바구니\n1'));
        await utils.wait(3 * 1000);
        await utils.click(driver, utils.btnText('한번에 결제하기'));
        await utils.wait(3 * 1000);
        await utils.click(driver, utils.btnText('확인'));
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
