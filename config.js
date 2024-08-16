const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'uiautomator2',
    'appium:deviceName': 'Galaxy Note 20 5G',
    'appium:udid': 'R3CN80AK2MV',
    'appium:platformVersion': '12.0',
    'appium:appPackage': 'com.svcorps.mkitchen',
    'appium:appWaitActivity': 'com.svcorps.mkitchen.*', // 앱 대기 액티비티 설정
    'appium:appActivity': 'com.svcorps.mkitchen.MainActivity',
    'appium:noReset': true, // 앱 상태를 초기화하지 않고 유지
    'appium:fullReset': false, // 앱을 삭제하지 않고 유지
    'appium:autoGrantPermissions': true, // 권한 자동 부여
    'appium:ignoreHiddenApiPolicyError': true, // 숨겨진 API 오류 무시
    'appium:skipServerInstallation': true, // 서버 설치 스킵
    'appium:disableWindowAnimation': true, // UI 애니메이션 비활성화
    'appium:enablePerformanceLogging': true, // 성능 로그 활성화
    'appium:ignoreUnimportantViews': true, // UIAutomator가 중요하지 않은 뷰를 무시하도록 설정
};

const options = {
    hostname: 'localhost',
    port: 4723,
    path: '/',
    capabilities: capabilities,
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
        EmailTitle: `${year}-${month}-${day} ${dayOfWeek} 자동화 테스트 결과`,
    };
}

module.exports = { options, getFormattedTime };
