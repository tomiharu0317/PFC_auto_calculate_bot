//シートに記録
const addRecord = (messageListOption, messageLength) => {

    let replyMessage, flag, foodInfo, day;

    [replyMessage, flag, foodInfo, day] = ['', true, [], ''];

    let foodName = messageListOption[0];
    let foodAmount = messageListOption[1];
    let foodAmountBase = '';

    const dateObj = new Date();
    const hour = dateObj.getHours();
    const minite = dateObj.getMinutes().toString().padStart(2, '0');
    const month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();


    // 確認すること:日付が存在するか、食材名が存在するか、分量が数字か
    // messageListOption = ['鶏胸肉', '130', ('9/21')];

    // 日付あったらその日、なかったらその場で当日の文字列をつくって列を取得
    if (messageLength === 3) {
        day = month + '/' + date;

    } else {

        day = messageListOption[2];
        [flag, date, replyMessage] = inspectDate(day);

    }


    // foodName が存在するか + foodInfo の取得
    if (flag) {
        [replyMessage, flag] = readFoodInfo(foodName, 'null');

        if (flag) {
            // [['さつまいも', '1', '2', '3', '4', '5', '6']]
            foodInfo = replyMessage.split('\n');

            foodAmountBase = Number(foodInfo[1]);
        }
    }

    // foodAmount が数値か
    if (flag) {
        [replyMessage, flag] = isNumber(foodAmount);

        if (flag) {
            foodAmount = Number(foodAmount);
        }
    }
// ---------------------------------------------------------------------------------------

    // 最終行にsetValues()
    // 合計を取得
    // 合計に、分量から計算した分を合計する
    if (flag) {

        // 該当する日付の行を取得
        // 1 2 3 4 5
        // 1 5 9 13 17
        // 一般項 = 4n - 3
        let targetColumn = 4 * date - 3;
        let sheetLastRow = recordSheet.getLastRow();
        let targetRow = findTargetRow(targetColumn, sheetLastRow);

        let index = targetRow - 6;
        let time  = hour + ':' + minite;

        let values = [[index, time, foodName, foodAmount]];

        recordSheet.getRange(targetRow + 2, targetColumn, 1, 4).setValues(values);

        // sumValues = [[''], [''], [''], [''], ['']];
        let sumValues = recordSheet.getRange(3, targetColumn + 1, 5, 1).getValues();

        let ratio = foodAmount / foodAmountBase;
        let protein = (Number(sumValues[0]) + Number(foodInfo[2]) * ratio).toFixed(2);
        let fat     = (Number(sumValues[1]) + Number(foodInfo[3]) * ratio).toFixed(2);
        let carbo   = (Number(sumValues[2]) + Number(foodInfo[4]) * ratio).toFixed(2);
        let sugar   = (Number(sumValues[3]) + Number(foodInfo[5]) * ratio).toFixed(2);
        let calorie = (Number(sumValues[4]) + Number(foodInfo[6]) * ratio).toFixed(2);

        sumValues = [[protein], [fat], [carbo], [sugar], [calorie]];

        recordSheet.getRange(3, targetColumn + 1, 5, 1).setValues(sumValues);

        replyMessage = "記録しました。";

    }


    return replyMessage;
};