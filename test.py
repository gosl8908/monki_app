from appium import webdriver
from appium.options.android import UiAutomator2Options
from time import sleep

애피움_서버_주소 = 'http://localhost:4723'

유튜브_앱_패키지 = 'com.google.android.youtube'
유튜브_앱_액티비티 = 'com.google.android.apps.youtube.app.WatchWhileActivity'

캐퍼빌리티 = {
    'platformName': 'Android',
    'automationName': 'uiautomator2',
    'deviceName': 'Android',
    'appPackage': 유튜브_앱_패키지,
    'appActivity': 유튜브_앱_액티비티,
}

옵션 = UiAutomator2Options().load_capabilities(캐퍼빌리티)

드라이버 = webdriver.Remote(애피움_서버_주소, options=옵션)