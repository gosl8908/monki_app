const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const utils = require('../module/utils');
const Module = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4725';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수

(async () => {
    let driver;
    try {
        driver = await remote(options);
        await utils.wait(3000);
        await Module.loginModule.login(driver, env.email, env.password);
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        if (driver) {
            try {
                await driver.deleteSession();
                console.log('Driver session ended.');
            } catch (deleteSessionError) {
                console.error('Error ending driver session:', deleteSessionError);
            }
        }
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.EmailTitle}]`,
            TestRange: '1. 테스트',
            Screenshots,
        });
    }
})();


