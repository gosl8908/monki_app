// module/search.module.js
const { clickElement, wait, uiSelectorText, enterText } = require('../module/utils');

async function search(driver, searchText) {
    try {
        await clickElement(driver, uiSelectorText('검색'));
        await wait(5000);

        const storeTextSelector = uiSelectorText(searchText);
        const storeTextBtn = await driver.$(storeTextSelector);

        if (await storeTextBtn.isDisplayed()) {
            await clickElement(driver, uiSelectorText(searchText));
        } else {
            await enterText(
                driver,
                '//android.widget.EditText[@text="음식이나 음식점 이름을 검색해주세요"]',
                searchText,
            );
            // Press the Enter key (key code 66 for Android)
            await clickElement(driver, uiSelectorText(searchText));
            await driver.pressKeyCode(66); // 66 is the key code for Enter
        }
        console.log('검색 및 선택 완료');
    } catch (error) {
        console.error(`검색 및 선택 중 오류 발생: ${error.message}`);
    }
}

module.exports = {
    search,
};
