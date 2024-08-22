// module/search.module.js
const { click, wait, uiSelectorText, enterText, clearText } = require('../module/utils');
async function search(driver, searchText) {
    try {
        await click(driver, uiSelectorText('검색'));
        await wait(5000);

        const storeTextSelector = uiSelectorText(searchText);
        const storeTextBtn = await driver.$(storeTextSelector);

        if (await storeTextBtn.isDisplayed()) {
            await click(driver, uiSelectorText(searchText));
        } else {
            await enterText(
                driver,
                '//android.widget.EditText[@text="음식이나 음식점 이름을 검색해주세요"]',
                searchText,
            );
            // Press the Enter key (key code 66 for Android)
            await click(driver, uiSelectorText(searchText));
            await driver.pressKeyCode(66); // 66 is the key code for Enter
        }

        await clearText(driver, `//android.widget.EditText[@text='${searchText}']`);
        await wait(5 * 1000);
        await click(driver, uiSelectorText(searchText));
        await wait(5 * 1000);

        console.log('검색 및 선택 완료');
    } catch (error) {
        console.error(`검색 및 선택 중 오류 발생: ${error.message}`);
        throw error;
    }
}

module.exports = {
    search,
};
