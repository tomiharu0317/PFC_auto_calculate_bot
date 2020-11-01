//食材情報を変更
const changeFoodInfo = (messageListOption) => {

    // messageListOption = ['foodAmountBase', 'pro', 'fat', 'carbo', 'sugar', 'cal'];

    let replyMessage, flag;
    let values = [];
    let copyListOption = [...messageListOption];

    [replyMessage, flag] = ['', true];

    // values = [['foodAmountBase', 'pro', 'fat', 'carbo', 'sugar', 'cal']];
    values.push(copyListOption);

    let foodName = messageListOption.shift();

    // foodNameが既に登録されていたらダメ
    [replyMessage, flag] = readFoodInfo(foodName, 'null');

    if (replyMessage === "入力した食材は存在しません") {
        flag = true;
    } else {
        replyMessage = "入力した食材は既に登録されています。";
        flag = false;
    }

    if (flag) {
        for (let i = 0; i < 6; i++) {

            [replyMessage, flag] = isNumber(messageListOption[i]);

            if (flag === false) {
                break;
            }
        }

    }

    // A2:lastRowまでの間で食材名と一致する行を探す => その行の内容を変更

    // もし食材名も変更できるようにするなら、
    // 変更 食材 <元の食材名> <変更後の食材名> </変更後の食材名><分量(あたり)(g)><タンパク質> <脂質> <炭水化物> <糖質> <カロリー(kcal)></糖質>
    // になる

    let targetRow = 0;

    [replyMessage, flag, targetRow] = readFoodInfo(foodName, 'fetchTargetRow');

    if (flag) {
        shokuzaiSheet.getRange(targetRow, 1, 1, 7).setValues(values);

        replyMessage = "食材 ${foodName} の情報を変更しました。".replace("${foodName}", foodName);
    }

    // }

    return replyMessage;
};