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
            tableorder(4726, env.GalaxyTabS7FE.deviceName, env.GalaxyTabS7FE.port, env.GalaxyTabS7FE.platformVersion),
        );
        await utils.wait(10 * 1000);
        const currentPackage = await driver.getCurrentPackage();
        const currentActivity = await driver.getCurrentActivity();
        console.log('Current app package:', currentPackage);
        console.log('Current app activity:', currentActivity);

        await Module.loginModule.TOlogin(driver, env.testid3, env.testpwd3);

        /* 주문 */
        await Module.orderModule.order(driver, '음료', '코카콜라', '2,000', '후불', 'Y');

        /* 관리자모드 */
        await Module.orderModule.adminMode(driver, '101');

        /* 자리이동 */
        await utils.click(driver, utils.btnText('자리변경'));
        await utils.click(driver, utils.view('101'));
        await utils.click(driver, utils.view('202'));
        await utils.click(driver, utils.btnText('이동'));

        await utils.contains(driver, utils.containsview('202'));

        /* 테이블모드 전환 */
        await utils.click(driver, utils.view('설정\n탭 5개 중 5번째')); // 시스템설정
        await utils.click(driver, utils.btnText('테이블 모드 전환'));
        await utils.contains(driver, utils.view('안녕하세요 :) 메뉴 확인 후 바로 주문해 주세요'));
        await utils.click(driver, utils.btnText('확인'));

        /* 주문 */
        await Module.orderModule.order(driver, '음료', '코카콜라', '2,000', '후불');

        /* 관리자모드 */
        await Module.orderModule.adminMode(driver, '101');
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        // await utils.finish(driver, tableorder());
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange: '1. 테이블오더 로그인',
            Screenshots,
        });
    }
})();
