//食材をshokuzaiシートに追加
const addFood = (messageListOption) => {

    // messageListOption = ['foodAmountBase', 'pro', 'fat', 'carbo', 'sugar', 'cal'];

    let replyMessage, flag;
    let values = [];
    let copyListOption = [...messageListOption];

    [replyMessage, flag] = ['', true];

    // values = [['foodAmountBase', 'pro', 'fat', 'carbo', 'sugar', 'cal']];
    values.push(copyListOption);

    let foodName = messageListOption.shift();

    // 関数化できる----------------------------------------------------------------

    // foodNameが既に登録されていたらダメ
    [replyMessage, flag] = readFoodInfo(foodName, 'null');

    if (replyMessage === "入力した食材は存在しません") {
        flag = true;
    } else {
        replyMessage = "入力した食材は既に登録されています。";
        flag = false;
    }

    // messageListOption の情報が全て数値
    if (flag) {
        for (let i = 0; i < 6; i++) {

            [replyMessage, flag] = isNumber(messageListOption[i]);

            if (flag === false) {
                break;
            }
        }

    }

    //------------------------------------------------------------------

    // 値を登録
    if (flag) {

        let lastRow = shokuzaiSheet.getLastRow();

        shokuzaiSheet.getRange(lastRow + 1, 1, 1, 7).setValues(values);

        replyMessage = "食材 ${foodName} を追加しました。".replace("${foodName}", foodName);

    }

    return replyMessage;
};