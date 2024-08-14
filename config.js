const capabilities = {
  platformName: "Android",
  "appium:automationName": "uiautomator2",
  "appium:deviceName": "Galaxy Note 20 5G",
  "appium:udid": "R3CN80AK2MV", 
  "appium:platformVersion": "12.0",
  "appium:appPackage": "com.svcorps.mkitchen",
  "appium:appWaitActivity": "com.svcorps.mkitchen.*", // 앱 대기 액티비티 설정
  "appium:appActivity": "com.svcorps.mkitchen.MainActivity",
  "appium:noReset": true, // 앱 상태를 초기화하지 않고 유지
  "appium:fullReset": false, // 앱을 삭제하지 않고 유지
  "appium:autoGrantPermissions": true, // 권한 자동 부여
  "appium:ignoreHiddenApiPolicyError": true, // 숨겨진 API 오류 무시
  "appium:skipServerInstallation": true, // 서버 설치 스킵
  "appium:disableWindowAnimation": true,  // UI 애니메이션 비활성화
  "appium:enablePerformanceLogging": true,  // 성능 로그 활성화
"appium:ignoreUnimportantViews": true,    // UIAutomator가 중요하지 않은 뷰를 무시하도록 설정
};

const options = {
  hostname: "localhost",
  port: 4723,
  path: "/",
  capabilities: capabilities,
};

module.exports = { options };
