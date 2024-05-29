const capabilities = {
  platformName: "Android",
  "appium:automationName": "uiautomator2",
  "appium:deviceName": "Android",
  "appium:appPackage": "com.svcorps.mkitchen",
  "appium:appActivity": "com.svcorps.mkitchen.MainActivity",
  "appium:noReset": true,
  "appium:fullReset": false,
};

const options = {
  hostname: "localhost",
  port: 4723,
  path: "/",
  capabilities: capabilities,
};

module.exports = { options };
