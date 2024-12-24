const { remote } = require('webdriverio');
const { tableorder, env, error } = require('../../../config.js');
const utils = require('../../../module/utils.js');
const Module = require('../../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');
const { adminMode } = require('../../../module/order.module.js');

describe('Appium Test Suite', function () {
    this.timeout(360 * 1000);
    let driver;
    let accessToken;
    let formattedPrice;
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    const run = testFunc =>
        async function () {
            try {
                await testFunc();
                console.log(`Test Passed: ${this.test.title}`);
            } catch (err) {
                error(TestFails, FailureObj, err, this.test.title);
            }
        };
    before(
        'remote',
        run(async () => {
            driver = await remote(
                tableorder(
                    4723,
                    env.GalaxyTabA8.deviceName,
                    `${env.GalaxyTabA8.port}${'35763'}`,
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
        '테스트',
        run(async () => {
            await Module.orderModule.adminMode(driver);
            await Module.orderModule.orderCashPay(driver, '1-3', formattedPrice, formattedPrice);
        }),
    );
    afterEach('Status Check', async function () {
        await Module.emailModule.screenshot2(driver, FailureObj, Screenshots, this.currentTest);
    });

    after('send Email', async function () {
        // await utils.finish(driver, tableorder());
        const { title: describeTitle, tests: allTests } = this.test.parent;
        await Module.emailModule.email2({
            TestFails,
            describeTitle,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange:
                '테스트스크립트 - 테이블오더' +
                `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
        });
    });
});
