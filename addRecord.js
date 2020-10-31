//シートに記録
const addRecord = (messageListOption, messageLength) => {

    let replyMessage = '';
    let foodName = messageListOption[0];
    let foodAmount = messageListOption[1];

    const dateObj = new Date();
    const hour = dateObj.getHours();
    const minite = dateObj.getMinutes().toString().padStart(2, '0');
    const month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();

    let day = '';

    let flag = true;

    // 確認すること:日付が存在するか、食材名が存在するか、分量が数字か
    // 記録　鶏胸肉　130　9/21

// ------------------------------------------------------------------------------------
    // 日付あったらその日、なかったらその場で当日の文字列をつくって列を取得

    if (messageLength === 3) {
        day = month + '/' + date;

    } else {
        // dayの検査
        day = messageListOption[2];
        [flag, date, replyMessage] = inspectDate(day);

    }
// ------------------------------------------------------------------------------------


// 食材名が存在するか+食材情報の取得-------------------------------------------------------------------
    // foodInfo = "入力した食材は存在しません" || 食材情報の文字列('さつまいも,1,2,3,4,5,6')
    if (flag) {
        let foodInfo = readFoodInfo(foodName);

        if (foodInfo === "入力した食材は存在しません") {
            replyMessage = foodInfo;
            flag = false;
        } else {
            foodInfo = foodInfo.split(',');
            // ["さつまいも", "1", "2", "3", "4", "5", "6"]
        }
    }

// -------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------
    if (flag) {
        if (isNaN(messageListOption[1])) {
            replyMessage = "数値を入力してください。";
            flag = false;
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


        let index = targetRow;
        let time  = hour + ':' + minite;


        let values = [[index, time, foodName, foodAmount]];

        recordSheet.getRange(targetRow + 1, targetColumn, 1, 4).setValues(values);

        replyMessage = "記録しました。";

    }


    return replyMessage;
};

const findTargetRow = (targetColumn, sheetLastRow) => {

    let values = recordSheet.getRange(1, targetColumn, sheetLastRow, 1).getValues();

    let targetRow = values.filter(String).length;

    return targetRow;
}

const inspectDate = (day) => {

    let flag = true;
    let date = '';
    let replyMessage = '';

    // '/'がある && monthDate.length === 2 && isNaN(month) === false && isNaN(date) = false
    // && month === date.getMonth(); && 0 < date < 32

    // isNaN(str) === false => 数値

    if (day.includes('/')) {

        let dateObj = new Date();
        const MONTH = dateObj.getMonth() + 1;

        let monthDateArray = day.split('/');
        let month = monthDateArray[0];
            date = Number(monthDateArray[1]);

        if (monthDateArray.length === 2 && isNaN(month) === false && isNaN(date) === false && month === String(MONTH) && 0 < date && date < 32) {

            // pass;
        } else {
            replyMessage = "日付のフォーマット: mm/dd\n\n例\n1/23, 3/11, 12/23";
            flag = false;
        }
    } else {
        replyMessage = "日付のフォーマット: mm/dd\n\n例\n1/23, 3/11, 12/23";
        flag = false;
    }

    return [flag, date, replyMessage];
}