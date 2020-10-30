const addFood = (messageListOption) => {


    let flag = true;

    let replyMessage = '';

    let values = [];

    const copyListOption = [...messageListOption];

    values.push(copyListOption);

    let foodName = messageListOption.shift();

    // 文字列の数値 => isNaN => false
    // 文字列 => isNaN => true

    for (let i = 0; i < 6; i++) {
        if (isNaN(messageListOption[i])) {
            replyMessage = "数値を入力してください。";
            flag = false;
            break;
        }
    }

    // 値を登録
    if (flag) {

        let lastRow = shokuzaiSheet.getLastRow();
        shokuzaiSheet.getRange(lastRow+1, 1, 1, 7).setValues(values);
        // replyMessage = shokuzaiSheet.getRange(lastRow+1, 1, 1, 7).getA1Notation();

        replyMessage = "食材 ${foodName} を追加しました。".replace("${foodName}", foodName);

    }

    return replyMessage;
};