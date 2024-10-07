const { remote } = require('webdriverio');
const { action, env } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');

const serverUrl = 'http://localhost:4725';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수

(async () => {
    let driver;
    try {
        driver = await remote(action);
        await utils.wait(5 * 1000);

        /* 로그인 */
        await Module.loginModule.login(driver, env.email, env.password);
        await utils.wait(5 * 1000);

        const store = await driver.$(utils.uiSelectorText('번개지점(stg)'));
        if (!(await store.isDisplayed())) {
            await utils.click(driver, utils.uiSelectorText('변경'));
            await utils.click(driver, utils.uiSelectorText('번개지점(stg)'));

            await utils.click(driver, utils.uiSelector('선택'));
            await utils.wait(3 * 1000);
            await utils.click(driver, utils.uiSelectorText('무료배달'));
        }
        await utils.click(driver, utils.uiSelectorText('번개지점(stg)'));
        await utils.wait(10 * 1000);
        await utils.scroll(driver, 0.5, 0.6, 0.5, 0.0);
        await utils.click(driver, utils.uiSelectorText('몬키지점stg'));
        console.log('검색 성공');

        // 메뉴
        await utils.wait(10 * 1000);
        await utils.scroll(driver, 0.5, 0.6, 0.5, 0.0);
        await utils.click(driver, utils.uiSelectorText('라면'));
        console.log('메뉴 상세 진입 성공');

        // 장바구니 담기
        await utils.wait(10 * 1000);
        await utils.scroll(driver, 0.5, 0.75, 0.5, 0.0);
        await utils.click(driver, utils.uiSelectorText('기본'));
        await utils.wait(10 * 1000);
        await utils.click(driver, utils.uiSelectorText('장바구니 담기'));
        await utils.wait(10 * 1000);
        await utils.click(driver, utils.uiSelectorText('장바구니 보기'));
        await utils.wait(10 * 1000);
        await utils.click(driver, utils.uiSelectorText('매장식사 주문'));
        console.log('메뉴 장바구니 담기 성공');

        // 결제
        await Module.payModule.order(driver);

        // 카드 입력 & 주문완료 확인
        await Module.payModule.pay(driver, env.cardPassword);

        // 주문취소
        await utils.click(driver, utils.uiSelectorText('주문취소'));
        await utils.wait(5000);
        await utils.click(driver, utils.uiSelectorText('단순 변심'));
        await utils.wait(5000);
        await utils.click(driver, utils.uiSelectorText('취소하기'));
        await utils.contains(driver, utils.uiSelectorText('주문이 취소되었습니다.'));
        console.log('주문취소 완료 텍스트가 나타났습니다.');

        await utils.click(driver, utils.uiSelectorText('확인'));
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        await utils.finish(driver, action);
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.AppEmailTitle}]`,
            TestRange: '1. 지점 매장식사 결제',
            Screenshots,
        });
    }
})();
