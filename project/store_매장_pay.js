const { remote } = require('webdriverio');
const { options, getFormattedTime, env } = require('../config.js');
const {
    clickElement,
    scroll,
    wait,
    uiSelectorText,
    uiSelectorBtnText,
    enterText,
    waitForTextAndClick,
} = require('../module/utils.js');
const { loginModule, searchModule, payModule } = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';

(async () => {
    let driver;
    try {
        driver = await remote(options);
        await wait(5 * 1000);

        await loginModule.login(driver, env.email, env.password);

        /* 배너 확인 */
        const eventBtn = await driver.$(uiSelectorText('오늘하루 그만보기'));
        if (await eventBtn.isDisplayed()) {
            await waitForTextAndClick(driver, '오늘하루 그만보기');
            await wait(5000);
        }

        /* 검색 */
        await searchModule.search(driver, '몬키지점stg');
        console.log('검색 성공');

        /* 메뉴 */
        await wait(10 * 1000);
        await scroll(driver, 500, 1500, 500, 0);
        await clickElement(driver, uiSelectorText('라면'));
        console.log('메뉴 상세 진입 성공');

        /* 장바구니 담기 */
        await wait(10 * 1000);
        await scroll(driver, 500, 1500, 500, 0);
        await clickElement(driver, uiSelectorText('기본'), { timeout: 30 * 1000 });
        await wait(5 * 1000);
        await clickElement(driver, uiSelectorText('장바구니 담기'));
        await wait(5 * 1000);
        await clickElement(driver, uiSelectorText('장바구니 보기'), { timeout: 30 * 1000 });
        await wait(5 * 1000);
        await clickElement(driver, uiSelectorText('매장식사 주문'));
        console.log('메뉴 장바구니 담기 성공');

        /* 결제 */
        await payModule.order(driver);

        /* 카드 입력 & 주문완료 확인 */
        await payModule.pay(driver, env.cardPassword);

        /* 주문취소 */
        await clickElement(driver, uiSelectorText('주문취소'));
        await wait(5000);
        await clickElement(driver, uiSelectorText('단순 변심'));
        await wait(5000);
        await clickElement(driver, uiSelectorText('취소하기'));
        await waitForTextAndClick(driver, '주문이 취소되었습니다.', 30000);
        console.log('주문취소 완료 텍스트가 나타났습니다.');

        await clickElement(driver, uiSelectorText('확인'));
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
    }
})();
