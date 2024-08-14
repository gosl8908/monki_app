const { remote } = require("webdriverio");
const { options } = require("../config.js");
const { loginModule } = require('../module/manager.module.js');
const {
  clickElement,
  scroll,
  wait,
  uiSelectorText,
  uiSelectorBtnText,
  enterText,
} = require("../module/utils.js");

// Appium 서버와 디바이스 설정
const serverUrl = "http://localhost:4723";

// 메인 함수
(async () => {
  const driver = await remote(options);

  await wait(5 * 1000);
  
  const LoginBtnSelector = uiSelectorText("로그인");
  
  try {
    const LoginBtn = await driver.$(LoginBtnSelector);
    const isDisplayed = await LoginBtn.isDisplayed();
    
    if (isDisplayed) {
      // Perform login using the login module
      await loginModule.login('hskang@monki.net', 'gotjd0215!');
    } else {
      await nextStep();
    }
  } catch (error) {
    await nextStep();  // nextStep() 함수는 다음 스텝을 처리하는 함수입니다.
  }
  // 다음 스텝 함수 예시 (구현 필요)
  async function nextStep() {
    // 다음 스텝을 처리하는 코드 작성
    console.log("다음 스텝으로 진행합니다.");
  }
  
  // 검색 및 아이템 선택
  await clickElement(driver, uiSelectorText("검색"), { timeout: 10 * 1000 });

  await wait(5 * 1000);

  const StoreText = uiSelectorText("몬키");
  try {
    const StoreTextBtn = await driver.$(StoreText);
    const isDisplayed = await StoreTextBtn.isDisplayed();
    
    if (!isDisplayed) {
      // await enterText(driver, '//android.widget.EditText[@text="음식이나 음식점 이름을 검색해주세요"]', '몬키');
      await clickElement(driver, uiSelectorText("음식이나 음식점 이름을 검색해주세요"));
    
      // const xpath = '//android.widget.FrameLayout[@resource-id="android:id/content"]/android.widget.FrameLayout/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup/android.view.ViewGroup[1]/android.widget.FrameLayout/android/view.ViewGroup/android/view.ViewGroup/android/view.ViewGroup/android/view.ViewGroup/android/view.ViewGroup/android/view.ViewGroup[1]/android.widget.FrameLayout/android/view.ViewGroup/android/view.ViewGroup/android/view.ViewGroup/android/view.ViewGroup/android/view.ViewGroup/android/view.ViewGroup/android/view.ViewGroup[2]/android/view.ViewGroup';
      // const element = await driver.$(xpath);
      // await element.click();

    } else {
      await clickElement(driver, uiSelectorText("몬키"), { timeout: 10 * 1000 });
      await nextStep();
    }
  } catch (error) {
    await nextStep();  // nextStep() 함수는 다음 스텝을 처리하는 함수입니다.
  }
  // 다음 스텝 함수 예시 (구현 필요)
  async function nextStep() {
    // 다음 스텝을 처리하는 코드 작성
    console.log("다음 스텝으로 진행합니다.");
  }


  await wait(5 * 1000);
  await clickElement(driver, uiSelectorText("몬키지점stg"), { timeout: 10 * 1000 });
  console.log('검색 성공')

  // 대기 10초
  await wait(10 * 1000);

  // 메뉴 선택 및 장바구니 담기
  await scroll(driver, 500, 1500, 500, 0);
  await clickElement(driver, uiSelectorText("라면"));
  console.log('메뉴 상세 진입 성공')

  // 대기 10초
  await wait(10 * 1000);

  // 옵션 선택 및 결제 진행
  await scroll(driver, 500, 1500, 500, 0);
  await clickElement(driver, uiSelectorText("기본"), { timeout: 30 * 1000 });
  await wait(5 * 1000);
  await clickElement(driver, uiSelectorText("4,500원 장바구니 담기"));
  await wait(5 * 1000);
  await clickElement(driver, uiSelectorText("장바구니 보기"), { timeout: 30 * 1000 });
  await wait(5 * 1000);
  await clickElement(driver, uiSelectorText("매장식사 주문"));
  console.log('메뉴 장바구니 담기 성공')

  // 대기 10초
  await wait(10 * 1000);

  // 쿠폰 사용 및 결제 방식 선택
  await scroll(driver, 500, 2500, 500, 0);
  await clickElement(driver, uiSelectorText("모두사용"));
  await wait(5 * 1000);
  await clickElement(driver, uiSelectorText("간편결제"));
  await wait(5 * 1000);

  await clickElement(
    driver,
    uiSelectorText("개인정보 제3자 제공 내용 및 결제에 동의합니다.")
  );
  await wait(5 * 1000);
  await clickElement(driver, uiSelectorText("결제하기"));
  await wait(15 * 1000);
  await scroll(driver, 500, 1300, 500, 100);
  await clickElement(driver, uiSelectorBtnText("결제"));
  await wait(5 * 1000);

  // 결제 비밀번호 입력
  const password = ["9", "4", "0", "5", "1", "3"];
  for (const digit of password) {
    await clickElement(
      driver,
      `android=new UiSelector().className("android.widget.Button").text("${digit}")`
    );
    await wait(1 * 1000);
  }

  // 주문 완료 확인
  const orderCompleteTextSelector = uiSelectorText("주문완료");
  try {
    const orderCompleteText = await driver.$(orderCompleteTextSelector);
    await orderCompleteText.waitForExist({ timeout: 30 * 1000 });
    console.log("결제완료 & 주문완료 텍스트가 나타났습니다.");
  } catch (error) {
    console.log("주문완료 텍스트가 30초 내에 나타나지 않았습니다.");
  }

  // 테스트 종료 후 드라이버 종료
  await driver.deleteSession();
  console.log("Driver session ended.");
})();
