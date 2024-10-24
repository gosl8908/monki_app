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

    beforeEach(async function () {
        driver = await remote(
            tableorder(
                4724,
                env.GalaxyTabA8.deviceName,
                env.GalaxyTabA8.port + ':42067',
                env.GalaxyTabA8.platformVersion,
            ),
        );

        await utils.wait(10 * 1000);
        const currentPackage = await driver.getCurrentPackage();
        const currentActivity = await driver.getCurrentActivity();
        console.log('Current app package:', currentPackage);
        console.log('Current app activity:', currentActivity);

        await Module.loginModule.TOlogin(driver, env.testid2, env.testpwd2);
    });
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
    it(
        '테이블 테이블이동',
        run(async function () {
            await Module.orderModule.order(driver, '코카콜라', '2,500');

            await Module.orderModule.adminMode(driver, '1-1');

            /* 자리이동 */
            await utils.click(driver, utils.btnText('자리변경'));
            await utils.click(driver, utils.view('1-2'));
            await utils.click(driver, utils.view('1-1'));
            await utils.click(driver, utils.btnText('교환'));

            await utils.contains(driver, utils.containsview('1-1'));
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
                '테이블오더 테이블이동' +
                `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
        });
    });
});
