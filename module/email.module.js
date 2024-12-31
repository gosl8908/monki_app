const { sendEmail, sendMessage, env } = require('../config.js');
const fs = require('fs');
const path = require('path');

function email2({ TestFails, describeTitle, EmailTitle, TestRange, Screenshots }) {
    const IsTestFailed = TestFails.length > 0;
    const EmailBody = `${describeTitle} App 자동화 테스트가 ${IsTestFailed ? '실패' : '성공'}하였습니다.
        테스트 실행 시간 : ${env.DateLabelWeek}\n
        테스트 범위 : ${TestRange}\n
        ${
            IsTestFailed
                ? `
        테스트 실패 원인 :\n${TestFails.map(fail => `- ${fail.title}: ${fail.error}`).join('\n')}\n`
                : ''
        }`;
    console.log('테스트가 성공적으로 완료되었습니다.');

    const EmailInfo = {
        subject: `${EmailTitle}`,
        body: EmailBody,
        screenshotFileNames: Screenshots.map(name => name + '.png'), // 스크린샷 파일 이름들을 추가
    };

    sendEmail(EmailInfo).then(success => {
        if (success) {
            console.log('이메일 전송 성공.');
        } else {
            console.log('이메일 전송 실패.');
        }
    });
}
function screenshot2(driver, FailureObj, Screenshots, currentTest) {
    const f = {
        getFileName: filePath => {
            return filePath.split('/').pop(); // 파일 경로에서 파일명만 추출
        },
    };

    if (FailureObj.Failure) {
        // Test 제목에서 파일 이름에 사용할 수 없는 문자를 '_'로 대체
        const sanitizedTitle = currentTest.title.replace(/[^a-z0-9]/gi, '_');
        const ScreenshotFileName = `${sanitizedTitle}_${env.DateLabel}`;
        const screenshotPath = path.join(__dirname, '../screenshot', `${ScreenshotFileName}.png`);

        fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });

        // Appium 드라이버를 사용해 스크린샷 찍기
        return driver
            .takeScreenshot()
            .then(screenshot => {
                // 스크린샷을 파일로 저장
                fs.writeFileSync(screenshotPath, screenshot, 'base64');
                // 스크린샷 파일 이름 배열에 추가
                Screenshots.push(ScreenshotFileName);
                // Failure 상태 업데이트
                FailureObj.Failure = false;
                return Screenshots; // 스크린샷 배열 반환
            })
            .catch(screenshotError => {
                console.error('Error taking screenshot:', screenshotError);
                throw screenshotError; // 에러를 throw하여 호출자에게 전달
            });
    }

    return Promise.resolve(Screenshots); // Failure가 false인 경우 기존 스크린샷 배열 반환
}

function message({ TestFails, describeTitle, TestRange, Screenshots }) {
    const IsTestFailed = TestFails.length > 0;
    const message = `${describeTitle} 자동화 테스트가 ${IsTestFailed ? '실패' : '성공'}하였습니다.\n
테스트 실행 시간 : ${env.DateLabelWeek}\n
테스트 범위 : ${TestRange}\n
        ${
            IsTestFailed
                ? `
테스트 실패 원인 :\n${TestFails.map(fail => `- ${fail.title}: ${fail.error}`).join('\n')}\n`
                : ''
        }`;
    console.log('테스트가 성공적으로 완료되었습니다.');

    const payload = {
        text: message,
        screenshotFileNames: Screenshots.map(name => name + '.png'), // 스크린샷 파일 이름들을 추가
    };

    sendMessage(payload.text, payload.screenshotFileNames).then(success => {
        if (success) {
            console.log('메세지 전송 성공.');
        } else {
            console.log('메세지 전송 실패.');
        }
    });
}

module.exports = {
    email2,
    message,
    screenshot2,
};
