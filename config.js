// config.js
const { defineConfig } = require('webdriverio'); // 필요한 경우 추가
const nodemailer = require('nodemailer');

/* Email Account */
const gmailEamilId = 'gosl8908@gmail.com';
const gmailEamilPwd = 'boft yzek iitd uuxa';
/* Email Account */
const doorayEamilId = 'hskang@monki.net';
const doorayEamilPwd = 'gotjd0215!';

const devices = {
    GalaxyNote20: {
        deviceName: 'Galaxy Note 20 5G',
        udid: 'R3CN80AK2MV',
        platformVersion: '12.0',
    },
    GalaxyA24: {
        deviceName: 'Galaxy A24',
        udid: 'R59W800DBFD',
        platformVersion: '13.0',
    },
    GalaxyS10: {
        deviceName: 'Galaxy S10',
        udid: 'R39M10EAHFH',
        platformVersion: '12.0',
    },
    GalaxyZFlip: {
        deviceName: 'Galaxy Z Flip',
        udid: 'R39N301S8SV',
        platformVersion: '13',
    },
};

const capabilities = {
    'appium:platformName': 'Android',
    'appium:automationName': 'Uiautomator2',
    'appium:appPackage': 'com.svcorps.mkitchen',
    'appium:appWaitActivity': 'com.svcorps.mkitchen.*', // 앱 대기 액티비티 설정
    'appium:appActivity': 'com.svcorps.mkitchen.MainActivity',
    'appium:noReset': true, // 앱 상태를 초기화하지 않고 유지
    'appium:fullReset': false, // 앱을 삭제하지 않고 유지
    'appium:autoGrantPermissions': true, // 권한 자동 부여
    'appium:ignoreHiddenApiPolicyError': true, // 숨겨진 API 오류 무시
    'appium:disableWindowAnimation': true, // UI 애니메이션 비활성화
    'appium:enablePerformanceLogging': true, // 성능 로그 활성화
    'appium:ignoreUnimportantViews': true, // UIAutomator가 중요하지 않은 뷰를 무시하도록 설정
    'appium:skipServerInstallation': false,
};
const actioncapabilities = {
    'appium:platformName': 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:automationName': 'Uiautomator2',
    'appium:app': './apk/monki-431_20240731_staging.apk',
    'appium:appPackage': 'com.svcorps.mkitchen',
    'appium:appWaitActivity': 'com.svcorps.mkitchen.*', // 앱 대기 액티비티 설정
    'appium:appActivity': 'com.svcorps.mkitchen.MainActivity',
    'appium:noReset': true, // 앱 상태를 초기화하지 않고 유지
    'appium:fullReset': false, // 앱을 삭제하지 않고 유지
    'appium:autoGrantPermissions': true, // 권한 자동 부여
    'appium:ignoreHiddenApiPolicyError': true, // 숨겨진 API 오류 무시
    'appium:disableWindowAnimation': true, // UI 애니메이션 비활성화
    'appium:enablePerformanceLogging': true, // 성능 로그 활성화
    'appium:ignoreUnimportantViews': true, // UIAutomator가 중요하지 않은 뷰를 무시하도록 설정
    'appium:skipServerInstallation': false,
    'appium:uiautomator2ServerLaunchTimeout': 60000,
    'appium:androidInstallTimeout': 120000,
};

const options = {
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: capabilities,
};
const action = {
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: actioncapabilities,
};

function getFormattedTime() {
    const now = new Date(); // Move this line to the top
    const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayOfWeek = daysOfWeek[now.getDay()]; // 요일을 얻어옵니다.

    // 한국 표준시(Asia/Seoul)로 시간대를 설정합니다.
    const options = { timeZone: 'Asia/Seoul' };

    // 지정된 시간대로 날짜와 시간을 형식화합니다.
    const formattedDate = now.toLocaleString('ko-KR', options);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return {
        Date: `${year}-${month}-${day}`,
        Time: `${hours}:${minutes}:${seconds}`,
        DateLabel: `${year}${month}${day}_${hours}${minutes}${seconds}`,
        DateLabelWeek: `${year}-${month}-${day} ${dayOfWeek} ${hours}:${minutes}:${seconds}`,
        EmailTitle: `${year}-${month}-${day} ${dayOfWeek} App 자동화 테스트 결과`,
    };
}
function sendEmail({ recipient, subject, body, screenshotFileNames }) {
    const attachments = [];
    if (screenshotFileNames && screenshotFileNames.length > 0) {
        screenshotFileNames.forEach(screenshotFileName => {
            const path = `./screenshot/${screenshotFileName}`;
            attachments.push({
                filename: screenshotFileName,
                encoding: 'base64',
                path: path,
            });
        });
    }

    const gmailtransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: gmailEamilId,
            pass: gmailEamilPwd,
        },
    });

    // 두레이 메일용 transporter
    const dooraytransporter = nodemailer.createTransport({
        host: 'smtp.dooray.com',
        port: 465,
        secure: true, // STARTTLS
        auth: {
            user: doorayEamilId,
            pass: doorayEamilPwd,
        },
    });

    // const gmailmailOptions = {
    //     from: gmailEamilId,
    //     to: gmailEamilId,
    //     subject: subject,
    //     text: body,
    //     attachments: attachments,
    // };
    const dooraymailOptions = {
        from: doorayEamilId,
        to: doorayEamilId,
        subject: subject,
        text: body,
        attachments: attachments,
    };

    // return gmailtransporter
    //     .sendMail(gmailmailOptions)
    //     .then(info => {
    //         console.log('이메일 성공적으로 전송됨: ' + info.response);
    //         return true;
    //     })
    //     .catch(error => {
    //         console.error('이메일 전송 실패: ' + error);
    //         return false;
    //     });
    return dooraytransporter
        .sendMail(dooraymailOptions)
        .then(info => {
            console.log('이메일 성공적으로 전송됨: ' + info.response);
            return true;
        })
        .catch(error => {
            console.error('이메일 전송 실패: ' + error);
            return false;
        });
}

module.exports = {
    action,
    options,
    getFormattedTime,
    sendEmail,
    env: {
        email: 'hskang@monki.net',
        testemail: 'monki@monki.net',
        password: 'test123!',
        cardPassword: ['9', '4', '0', '5', '1', '3'],
        /* content */
        EmailBody: `App 자동화 테스트가 성공적으로 완료되었습니다`,
        Date: getFormattedTime().Date,
        Time: getFormattedTime().Time,
        DateLabel: getFormattedTime().DateLabel,
        DateLabelWeek: getFormattedTime().DateLabelWeek,
        EmailTitle: getFormattedTime().EmailTitle,
    },
};
