// config.js
const { defineConfig } = require('webdriverio'); // 필요한 경우 추가
const nodemailer = require('nodemailer');
const { application } = require('express');
const { execSync } = require('child_process');
require('dotenv').config();

const gmailEmailId = process.env.GMAIL_EMAIL_ID;
const gmailEmailPwd = process.env.GMAIL_EMAIL_PWD;
const doorayEmailId = process.env.DOORAY_EMAIL_ID;
const doorayEmailId2 = process.env.DOORAY_EMAIL_ID2;
const doorayEmailPwd = process.env.DOORAY_EMAIL_PWD;
const Phone = process.env.PHONE;
const adbPath = 'C:/Users/monthlykitchen/Documents/platform-tools/adb'; // full path to adb

const Appcapabilities = (deviceName, udid, platformVersion) => ({
    'appium:platformName': 'Android',
    'appium:automationName': 'Uiautomator2',
    'appium:deviceName': deviceName, // 장치 이름
    'appium:udid': udid, // 장치 고유 ID
    'appium:platformVersion': platformVersion, // 플랫폼 버전
    'appium:appPackage': 'com.svcorps.mkitchen',
    'appium:appWaitActivity': 'com.svcorps.mkitchen.MainActivity, com.svcorps.mkitchen.*',
    'appium:appActivity': 'com.svcorps.mkitchen.MainActivity',
    'appium:app': './apk/app/monki-431_20240731_staging.apk', // 앱 파일 경로
    'appium:noReset': true, // 앱 상태를 초기화하지 않고 유지
    'appium:fullReset': false, // 앱을 삭제하지 않고 유지
    'appium:autoGrantPermissions': true, // 권한 자동 부여
    'appium:ignoreHiddenApiPolicyError': true, // 숨겨진 API 오류 무시
    'appium:disableWindowAnimation': true, // UI 애니메이션 비활성화
    'appium:enablePerformanceLogging': true, // 성능 로그 활성화
    'appium:ignoreUnimportantViews': true, // UIAutomator가 중요하지 않은 뷰를 무시하도록 설정
    'appium:skipServerInstallation': false,
});
const Tableordercapabilities = (deviceName, udid, platformVersion) => ({
    'appium:platformName': 'Android',
    'appium:automationName': 'Uiautomator2',
    'appium:deviceName': deviceName, // 장치 이름
    'appium:udid': udid, // 장치 고유 ID
    'appium:platformVersion': platformVersion, // 플랫폼 버전
    'appium:appPackage': 'net.monki.tableorder.staging',
    'appium:appActivity': 'net.monki.tableorder.MainActivity',
    'appium:appWaitActivity': 'net.monki.tableorder.MainActivity, net.monki.tableorder.*',
    'appium:app': './apk/tableorder/app-staging-release-1.0.85+231.apk', // 앱 파일 경로
    'appium:noReset': true, // 앱 상태를 초기화하지 않고 유지
    'appium:fullReset': false, // 앱을 삭제하지 않고 유지
    'appium:autoGrantPermissions': true, // 권한 자동 부여
    'appium:ignoreHiddenApiPolicyError': true, // 숨겨진 API 오류 무시
    'appium:disableWindowAnimation': true, // UI 애니메이션 비활성화
    'appium:enablePerformanceLogging': true, // 성능 로그 활성화
    'appium:ignoreUnimportantViews': true, // UIAutomator가 중요하지 않은 뷰를 무시하도록 설정
    'appium:skipServerInstallation': false,
});

function ensureAdbConnection(deviceId, udid) {
    try {
        const devicesOutput = execSync(`${adbPath} devices`).toString();
        const connected = devicesOutput.includes(`${deviceId}:${udid}`);

        if (!connected) {
            console.log(`Device ${deviceId}:${udid} is not connected. Attempting to reconnect...`);
            // Correct the adb connect command to only use the IP and port
            execSync(`${adbPath} connect ${udid}`);
            console.log(`Device ${deviceId}:${udid} successfully connected.`);
        } else {
            console.log(`Device ${deviceId}:${udid} is already connected.`);
        }
    } catch (err) {
        console.error('Error ensuring ADB connection:', err.message);
        throw new Error('Failed to connect to the device via ADB.');
    }
}

const app = (port, deviceName, udid, platformVersion) => {
    ensureAdbConnection(deviceName, udid);

    return {
        hostname: '127.0.0.1',
        port: port,
        path: '/',
        capabilities: Appcapabilities(deviceName, udid, platformVersion),
    };
};
const tableorder = (port, deviceName, udid, platformVersion) => {
    ensureAdbConnection(deviceName, udid);

    return {
        hostname: '127.0.0.1',
        port: port,
        path: '/',
        capabilities: Tableordercapabilities(deviceName, udid, platformVersion),
    };
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
        AppEmailTitle: `${year}-${month}-${day} ${dayOfWeek} App 자동화 테스트 결과`,
        TableorderEmailTitle: `${year}-${month}-${day} ${dayOfWeek} Tableorder 자동화 테스트 결과`,
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

    // 두레이 메일용 transporter
    const dooraytransporter = nodemailer.createTransport({
        host: 'smtp.dooray.com',
        port: 465,
        secure: true, // STARTTLS
        auth: {
            user: doorayEmailId,
            pass: doorayEmailPwd,
        },
    });
    const dooraymailOptions = {
        from: doorayEmailId,
        to: `${doorayEmailId}, ${doorayEmailId2}`,
        subject: subject,
        text: body,
        attachments: attachments,
    };
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
    // const gmailtransporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: gmailEmailId,
    //         pass: gmailEmailPwd,
    //     },
    // });

    // const gmailmailOptions = {
    //     from: gmailEmailId,
    //     to: gmailEmailId,
    //     subject: subject,
    //     text: body,
    //     attachments: attachments,
    // };

    // return gmailtransporter
    //     .sendMail(gmailmailOptions)
    //     .then(info => {
    //         console.log('이메일 성공적으로 전송됨: ' + info.response);
    //         return true;
    //     })
    //     .catch(error => {
    //         console.error('이메일 전송 실패: ' + error);
    //         return false;
    //     }); dnvmfpeh
}
module.exports = {
    app,
    application,
    tableorder,
    getFormattedTime,
    sendEmail,
    ensureAdbConnection,
    env: {
        email: doorayEmailId,
        testemail: 'monki@monki.net',
        monkifav: Array.from({ length: 5 }, (_, i) => `monkifav${i + 1}`),
        monkitest: Array.from({ length: 10 }, (_, i) => `monkitest${i + 1}`),
        testpwd: 'test123!',
        testpwd2: 'test1234',
        testpwd3: '0000',
        testphone: '01052012705',
        phone: Phone,
        cardPassword: ['9', '4', '0', '5', '1', '3'],
        /* content */
        EmailBody: `App 자동화 테스트가 성공적으로 완료되었습니다`,
        Date: getFormattedTime().Date,
        Time: getFormattedTime().Time,
        DateLabel: getFormattedTime().DateLabel,
        DateLabelWeek: getFormattedTime().DateLabelWeek,
        AppEmailTitle: getFormattedTime().AppEmailTitle,
        TableorderEmailTitle: getFormattedTime().TableorderEmailTitle,
        GalaxyNote20: {
            deviceName: 'Galaxy Note 20 5G',
            udid: 'R3CN80AK2MV',
            port: '10.10.239.',
            platformVersion: '12.0',
        },
        GalaxyNote10plus5G: {
            deviceName: 'Galaxy Note 10+ 5G',
            udid: 'R3CM80LQS6V',
            port: '10.10.239.101:5555',
            platformVersion: '12.0',
        },
        GalaxyA24: {
            deviceName: 'Galaxy A24',
            udid: 'R59W800DBFD',
            port: '10.10.239.9:',
            platformVersion: '13.0',
        },
        GalaxyS10: {
            deviceName: 'Galaxy S10',
            udid: 'R39M10EAHFH',
            port: '10.10.239.',
            platformVersion: '12.0',
        },
        GalaxyZFlip: {
            deviceName: 'Galaxy Z Flip',
            udid: 'R39N301S8SV',
            port: '10.10.239.',
            platformVersion: '13',
        },
        GalaxyTabA8: {
            deviceName: 'Galaxy Tab A8',
            udid: 'R9YTB03PNMP',
            port: '10.10.239.105',
            platformVersion: '14',
        },
        GalaxyTabS7FE: {
            deviceName: 'Galaxy Tab S7 FE',
            udid: 'R54W201LPYZ',
            port: '10.10.239.13:',
            platformVersion: '14',
        },
    },

    error: function (TestFails, FailureObj, err, testTitle) {
        const errorMessage = err.message || '에러 메시지 없음'; // 에러 메시지가 없으면 기본값 설정

        // TestFails에 실패 정보 추가
        TestFails.push({
            title: testTitle || '제목 없음', // testTitle이 없으면 기본값 설정
            error: errorMessage,
        });

        // 실패 여부 기록
        FailureObj.Failure = true;

        // 에러 객체를 확장하여 title과 error 메시지를 포함한 커스텀 에러를 던짐
        const customError = new Error(errorMessage);
        customError.title = testTitle || '제목 없음';
        customError.message = `${testTitle || '제목 없음'}: ${errorMessage}`; // testTitle과 errorMessage를 함께 메시지로 설정
        throw customError;
    },
};
