// const { remote } = require('webdriverio');
// const { tableorder, env, error } = require('../../config.js');
// const utils = require('../../module/utils.js');
// const Module = require('../../module/manager.module.js');
// const { allure } = require('allure-mocha/runtime');

// describe('Appium Test Suite', function () {
//     this.timeout(360 * 1000);
//     let driver;
//     let Screenshots = []; // 스크린샷을 저장할 배열
//     let TestFails = []; // 실패 원인을 저장할 변수
//     let FailureObj = { Failure: false };
//     const run = testFunc =>
//         async function () {
//             try {
//                 await testFunc();
//                 console.log(`Test Passed: ${this.test.title}`);
//             } catch (err) {
//                 error(TestFails, FailureObj, err, this.test.title);
//             }
//         };
//     before(
//         'remote',
//         run(async () => {
//             driver = await remote(
//                 tableorder(
//                     4727,
//                     env.GalaxyTabS7FE.deviceName,
//                     env.GalaxyTabS7FE.port + '46729',
//                     env.GalaxyTabS7FE.platformVersion,
//                 ),
//             );
//             await utils.wait(10 * 1000);

//             const currentPackage = await driver.getCurrentPackage();
//             const currentActivity = await driver.getCurrentActivity();
//             console.log('Current app package:', currentPackage);
//             console.log('Current app activity:', currentActivity);
//         }),
//     );
//     it(
//         '후불매장 테이블 주문',
//         run(async () => {
//             await Module.loginModule.TOlogin(driver, env.testid3, env.testpwd2);
//             await Module.orderModule.order(driver, '음료', '코카콜라', '2,000', 'N');
//         }),
//     );
//     it(
//         '주문취소',
//         run(async () => {
//             await Module.orderModule.adminMode(driver, '203');
//             await Module.orderModule.orderCancel(driver, '203');
//         }),
//     );
//     afterEach('Status Check', async function () {
//         await Module.emailModule.screenshot2(driver, FailureObj, Screenshots, this.currentTest);
//     });

//     after('Send Email', async function () {
//         await utils.finish(driver, tableorder());
//         await Module.emailModule.email2({
//             TestFails,
//             describeTitle: this.test.parent.title,
//             EmailTitle: `[${env.TableorderEmailTitle}]`,
//             TestRange: `후불_테이블오더 주문\n${this.test.parent.tests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
//             Screenshots,
//         });
//     });
// });
const { remote } = require('webdriverio');
const { tableorder, env, error } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');
const { allure } = require('allure-mocha/runtime');
const { execSync } = require('child_process'); // 추가된 부분

describe('Appium Test Suite', function () {
    this.timeout(360 * 1000);
    let driver;
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
            const adbPort = env.GalaxyTabS7FE.port + '46729';

            // ADB 연결 여부 확인 및 연결 시도
            try {
                console.log(`Checking ADB connection on port: ${adbPort}`);
                const devicesOutput = execSync('adb devices').toString();
                if (!devicesOutput.includes(adbPort)) {
                    console.log(`ADB port ${adbPort} not connected. Attempting to connect...`);
                    execSync(`adb connect ${adbPort}`);
                    console.log(`ADB connected on port: ${adbPort}`);
                } else {
                    console.log(`ADB port ${adbPort} is already connected.`);
                }
            } catch (error) {
                console.error(`Failed to connect ADB on port ${adbPort}:`, error.message);
                throw new Error('ADB connection failed. Please check your device and retry.');
            }

            // WebDriverIO remote 설정
            driver = await remote(
                tableorder(4727, env.GalaxyTabS7FE.deviceName, adbPort, env.GalaxyTabS7FE.platformVersion),
            );
            await utils.wait(10 * 1000);

            const currentPackage = await driver.getCurrentPackage();
            const currentActivity = await driver.getCurrentActivity();
            console.log('Current app package:', currentPackage);
            console.log('Current app activity:', currentActivity);
        }),
    );

    it(
        '후불매장 테이블 주문',
        run(async () => {
            await Module.loginModule.TOlogin(driver, env.testid3, env.testpwd2);
            await Module.orderModule.order(driver, '음료', '코카콜라', '2,000', 'N');
        }),
    );

    it(
        '주문취소',
        run(async () => {
            await Module.orderModule.adminMode(driver, '106');
            await Module.orderModule.orderCancel(driver, '106');
        }),
    );

    afterEach('Status Check', async function () {
        await Module.emailModule.screenshot2(driver, FailureObj, Screenshots, this.currentTest);
    });

    after('Send Email', async function () {
        await utils.finish(driver, tableorder());
        await Module.emailModule.email2({
            TestFails,
            describeTitle: this.test.parent.title,
            EmailTitle: `[${env.TableorderEmailTitle}]`,
            TestRange: `후불_테이블오더 주문\n${this.test.parent.tests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
        });
    });
});
