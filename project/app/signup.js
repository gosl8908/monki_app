const { remote } = require('webdriverio');
const { appoptions, env } = require('../../config.js');
const utils = require('../../module/utils.js');
const Module = require('../../module/manager.module.js');

const serverUrl = 'http://localhost:4723';
let Screenshots = []; // 스크린샷을 저장할 배열
let TestFails = []; // 실패 원인을 저장할 변수

(async () => {
    let driver;
    try {
        driver = await remote(appoptions);

        await utils.wait(5 * 1000);

        await utils.click(driver, utils.uiSelectorText('간편회원가입'));

        await utils.click(driver, utils.uiSelectorText('약관에 모두 동의합니다.'));

        await utils.click(driver, utils.uiSelectorText('확인'));

        await utils.enterText(driver, '//android.widget.EditText[@text="휴대폰 번호를 입력해 주세요"]', env.testphone);

        await utils.click(driver, utils.uiSelectorText('인증번호 받기'));
        // await utils.click(driver, utils.uiSelectorText('재전송'));

        // 인증번호를 읽어오는 함수
        const verificationCode = await Module.messageModule.message('18995678');

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
            const verificationNewCode = await Module.messageModule.message('18995678');
            await verificationInput.setValue(verificationNewCode);
            await utils.click(driver, utils.uiSelectorText('인증하기'));
        }

        await utils.enterText(driver, '//android.widget.EditText[@text="이메일 주소를 입력해 주세요"]', env.testemail);
        const buttons = await driver.$$(`android=new UiSelector().textContains("중복확인")`);
        await buttons[0].click();
        await utils.wait(3 * 1000);
        const email = await driver.$(utils.uiSelectorText('email이 존재합니다'));
        if (await email.isDisplayed()) {
            await utils.enterText(driver, `//android.widget.EditText[@text="${env.testemail}"]`, '1' + env.testemail);
            await buttons[0].click();
        }

        await utils.enterText(driver, '//android.widget.EditText[@text="닉네임을 입력해 주세요"]', '몬키');
        await buttons[1].click();
        await utils.wait(3 * 1000);
        const nickname = await driver.$(utils.uiSelectorText('닉네임이 존재합니다'));
        if (await nickname.isDisplayed()) {
            await utils.enterText(driver, '//android.widget.EditText[@text="몬키"]', env.testid);
            await buttons[1].click();
        }

        await utils.enterText(driver, '//android.widget.EditText[@text="비밀번호를 입력해 주세요"]', env.password);

        await utils.enterText(
            driver,
            '//android.widget.EditText[@text="비밀번호 한번 더 입력해 주세요"]',
            env.password,
        );
        await utils.click(driver, utils.uiSelectorText('가입완료'));
        await utils.contains(driver, utils.uiSelectorText('회원가입이 완료되었습니다.'));
        await utils.click(driver, utils.uiSelectorText('확인'));
        await utils.click(driver, utils.uiSelectorText('먼키홈으로 가기'));

        const eventBtn = await driver.$(utils.uiSelectorText('오늘하루 그만보기'));
        if (await eventBtn.isDisplayed()) {
            await utils.click(driver, '오늘하루 그만보기');
        }

        await Module.loginModule.signout(driver);
    } catch (error) {
        console.error(error);
        TestFails.push(error.message);
        if (driver) await utils.screenshot(driver, Screenshots);
    } finally {
        await utils.finish(driver, appoptions);
        await Module.emailModule.email({
            TestFails,
            EmailTitle: `[${env.AppEmailTitle}]`,
            TestRange: '1. 회원가입, 2. 회원탈퇴',
            Screenshots,
        });
    }
})();
