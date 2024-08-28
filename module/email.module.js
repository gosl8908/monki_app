const { options, sendEmail, env } = require('../config.js');

function email({ TestFails, EmailTitle, TestRange, Screenshots }) {
    const IsTestFailed = TestFails.length > 0;
    const EmailBody = `App 자동화 테스트가 ${IsTestFailed ? '실패' : '성공'}하였습니다.
    테스트 실행 시간 : ${env.DateLabelWeek}\
    테스트 범위 : ${TestRange}
    ${
        IsTestFailed
            ? `
            
    테스트 실패 원인 : ${TestFails.join('\n')}`
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

module.exports = {
    email,
};
