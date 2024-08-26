const { remote } = require('webdriverio');
const { options, env } = require('../config.js');
const fs = require('fs');
const path = require('path');
const utils = require('../module/utils.js');
const { loginModule, searchModule, payModule, emailModule, messageModule } = require('../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수
let Failure = false;

(async () => {
    let driver;
    try {
        driver = await remote(options);

        await utils.wait(5 * 1000);

        await utils.click(driver, utils.uiSelectorText('간편회원가입'));

        await utils.click(driver, utils.uiSelectorText('약관에 모두 동의합니다.'));

        await utils.click(driver, utils.uiSelectorText('확인'));

        await utils.enterText(driver, '//android.widget.EditText[@text="휴대폰 번호를 입력해 주세요"]', '01052012705');

        await utils.click(driver, utils.uiSelectorText('인증번호 받기'));
        // await utils.click(driver, utils.uiSelectorText('재전송'));

        // 인증번호를 읽어오는 함수
        const verificationCode = await messageModule.message('18995678');

        if (verificationCode) {
            // 인증번호 입력란에 입력
            const verificationInput = await driver.$('//android.widget.EditText[@text="인증번호를 입력해 주세요"]');
            await verificationInput.setValue(verificationCode);
            console.log(`인증번호 입력 완료: ${verificationCode}`);
        } else {
            console.log('인증번호를 찾을 수 없습니다.');
        }

        await utils.click(driver, utils.uiSelectorText('인증하기'));

        const NotNumber = await driver.$(utils.uiSelectorText('휴대폰 인증코드가 일치하지 않습니다'));

        if (await NotNumber.isDisplayed()) {
            const verificationInput = await driver.$(`//android.widget.EditText[@text='${verificationCode}']`);
            await verificationInput.clearValue();

            // 인증번호를 읽어오는 함수
            const verificationNewCode = await messageModule.message('18995678');
            await verificationInput.setValue(verificationNewCode);
            await utils.click(driver, utils.uiSelectorText('인증하기'));
        }

        await utils.enterText(driver, '//android.widget.EditText[@text="이메일 주소를 입력해 주세요"]', env.testemail);
        const buttons = await driver.$$(`android=new UiSelector().textContains("중복확인")`);
        await buttons[0].click();

        await utils.enterText(driver, '//android.widget.EditText[@text="닉네임을 입력해 주세요"]', '몬키');
        await buttons[1].click();

        await utils.click(driver, utils.uiSelectorText('중복확인'));

        await utils.enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', env.password);

        await utils.enterText(
            driver,
            '//android.widget.EditText[@text="비밀번호 한번 더 입력해 주세요"]',
            env.password,
        );

        await utils.click(driver, utils.uiSelectorText('가입완료'));

        await utils.contains(driver, '회원가입이 완료되었습니다.');

        await utils.click(driver, utils.uiSelectorText('확인'));

        await utils.click(driver, utils.uiSelectorText('먼키홈으로 가기'));

        const eventBtn = await driver.$(utils.uiSelectorText('오늘하루 그만보기'));
        if (await eventBtn.isDisplayed()) {
            await utils.waitForTextAndClick(driver, '오늘하루 그만보기');
        }

        await loginModule.signout(driver);
    } catch (error) {
        console.error(error);
        Failure = true;
        TestFails.push(error.message);
    } finally {
        if (Failure) {
            if (driver) {
                try {
                    const ScreenshotFileName = `App Test ${env.DateLabel}`;
                    const screenshotPath = path.join(__dirname, '../screenshot', `${ScreenshotFileName}.png`);
                    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
                    fs.writeFileSync(screenshotPath, await driver.takeScreenshot(), 'base64');
                    Screenshots.push(ScreenshotFileName);
                } catch (screenshotError) {
                    console.error('Error taking screenshot:', screenshotError);
                }
                try {
                    await driver.deleteSession();
                    console.log('Driver session ended.');
                } catch (deleteSessionError) {
                    console.error('Error ending driver session:', deleteSessionError);
                }
            }
        }
        const TestRange = '1. 테스트';
        await emailModule.email({
            TestFails: TestFails,
            EmailTitle: `[${env.EmailTitle}]`,
            TestRange: TestRange,
            Screenshots: Screenshots,
        });
    }
})();
