const { remote } = require('webdriverio');
const { tableorder, env, error } = require('../../../config.js');
const utils = require('../../../module/utils.js');
const Module = require('../../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');

describe('Appium Test Suite', function () {
    this.timeout(360 * 1000);
    let driver;
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    function run(testFunc) {
        return async function () {
            try {
                await testFunc();
                console.log(`Test Passed: ${this.test.title}`);
            } catch (err) {
                error(TestFails, FailureObj, err, this.test.title);
            }
        };
    }
    before(
        'remote',
        run(async () => {
            driver = await remote(
                tableorder(
                    4724,
                    env.GalaxyTabA8.deviceName,
                    `${env.GalaxyTabA8.port}${'34705'}`,
                    env.GalaxyTabA8.platformVersion,
                ),
            );
            await utils.wait(10 * 1000);
            const currentPackage = await driver.getCurrentPackage();
            const currentActivity = await driver.getCurrentActivity();
            console.log('Current app package:', currentPackage);
            console.log('Current app activity:', currentActivity);
        }),
    );
    it(
        '로그인',
        run(async () => {
            await Module.loginModule.TOlogin(driver, env.monkitest[1], env.testpwd2);
            accessToken = await Module.apiModule.token(env.monkitest[1], env.testpwd2); // 엑세스 토큰을 변수에 저장
        }),
    );
    it(
        '후불매장 테이블 주문',
        run(async () => {
            const products = await Module.apiModule.products(accessToken, env.storeNo2); // 첫 번째 상품명 반환
            if (products && products.length > 0) {
                const { categoryNm, menuNm, formattedPrice: price, formattedOptionPrice } = products[0];
                formattedPrice = price;
                await Module.orderModule.order(driver, categoryNm, menuNm, formattedPrice, formattedOptionPrice); // 저장된 엑세스 토큰을 사용하여 주문 API 호출
                await Module.apiModule.order(accessToken, env.storeNo2);
            } else {
                console.log('상품이 존재하지 않습니다.');
            }
        }),
    );
    it(
        '직원 호출',
        run(async () => {
            const firstItemName = await Module.apiModule.staff(accessToken, env.storeNo2);
            await Module.orderModule.staffCall(driver, firstItemName);
        }),
    );
    it(
        '주문취소',
        run(async () => {
            await Module.orderModule.adminMode(driver);
            await Module.orderModule.orderCancel(driver, '1-3', formattedPrice, formattedPrice);
        }),
    );
    afterEach('Status Check', async function () {
        await Module.emailModule.screenshot2(driver, FailureObj, Screenshots, this.currentTest);
    });

    after('send Email', async function () {
        await utils.finish(driver, tableorder());
        const { title: describeTitle, tests: allTests } = this.test.parent;
        // 실패한 테스트만 필터링
        await Module.emailModule.email2({
            TestFails,
            describeTitle,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange:
                '테이블오더 주문' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
        });
    });
});
