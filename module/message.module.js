const adb = require('adbkit');
const client = adb.createClient();
const utils = require('../module/utils.js');

async function message(phoneNumber) {
    // Android 디바이스의 SMS inbox에서 메시지를 읽기 위해 ADB를 사용
    const devices = await client.listDevices();
    if (devices.length === 0) {
        throw new Error('연결된 디바이스가 없습니다.');
    }
    const device = devices[0];

    // SMS inbox에서 데이터 쿼리
    const smsList = await client.shell(device.id, 'content query --uri content://sms/inbox --projection body,address');
    const smsData = await adb.util.readAll(smsList);
    const smsMessages = smsData.toString().split('\n');

    // console.log('SMS Messages: ', smsMessages); // 전체 메시지 출력
    // 1899-5678 번호에서 온 메시지 필터링
    for (let message of smsMessages) {
        // console.log('Current Message: ', message); // 각 메시지 출력
        await utils.wait(5 * 1000);
        if (message.includes(phoneNumber)) {
            // 메시지에서 4자리 인증번호 추출 (정규식 사용)
            const codeMatch = message.match(/\b\d{4}\b/);
            if (codeMatch) {
                console.log('Verification Code Found: ', codeMatch[0]); // 인증번호 출력
                return codeMatch[0];
            } else {
                console.log('No code match in this message.');
            }
        }
    }
    return null;
}

module.exports = {
    message,
};