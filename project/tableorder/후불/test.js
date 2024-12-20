const { remote } = require('webdriverio');
const { tableorder, env, error } = require('../../../config.js');
const utils = require('../../../module/utils.js');
const Module = require('../../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');

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
                    env.GalaxyTabS7FE.deviceName,
                    `${env.GalaxyTabS7FE.port}${'46729'}`,
                    env.GalaxyTabS7FE.platformVersion,
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
            await Module.loginModule.TOlogin(driver, env.monkitest[3], env.testpwd2);
            accessToken = await Module.apiModule.token(env.monkitest[3], env.testpwd2); // 엑세스 토큰을 변수에 저장
        }),
    );
    it(
        '테스트',
        run(async () => {
            // 추가 작업: 주문 취소 프로세스
            const Check = await driver.$(utils.android('완료'));

            if (!(await Check.isDisplayed())) {
                await utils.touchTap(driver, 0.33, 0.18); // 이전 좌표
                try {
                    // View를 먼저 시도
                    await utils.click(driver, utils.android('1\n1,000원'));
                } catch (error) {
                    // View가 없으면 ImageView로 시도
                    await utils.click(driver, utils.android('1\n1,000원'));
                }
            } else {
                await utils.click(driver, utils.android('완료'));
            }
        }),
    );

    afterEach('Status Check', async function () {
        await Module.emailModule.screenshot2(driver, FailureObj, Screenshots, this.currentTest);
    });

    after('Send Email', async function () {
        // await utils.finish(driver, tableorder());
        await Module.emailModule.email2({
            TestFails,
            describeTitle: this.test.parent.title,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange: `테스트\n${this.test.parent.tests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
        });
    });
});
