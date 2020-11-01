const isNumber = (target) => {

    // 文字列の数値 => isNaN => false
    // 文字列 => isNaN => true

    let replyMessage = '';
    let flag = true;

    if (isNaN(target)) {
        replyMessage = "数値を入力してください。";
        flag = false;
    }

    return [replyMessage, flag];
}

const readFoodInfo = (foodName) => {

    let replyMessage = '';

    let lastRow = shokuzaiSheet.getLastRow();
    let foodNum = lastRow - 1;

    let flag = true;

    let targetRow = 0;

    // [['さつまいも'], ['もち'], ['そば'], ['プロテイン']]
    let foodList = shokuzaiSheet.getRange(2, 1, foodNum, 1).getValues();

    for (let j = 0; j < foodNum; j++) {
        if (foodList[j] == foodName) {
            targetRow = j + 2;
            break;
        }

        if (j === foodNum - 1) {
            replyMessage = "入力した食材は存在しません";
            flag = false;
            break;
        }
    }

    if (flag) {
        // [['さつまいも', '1', '2', '3', '4', '5', '6']]
        let foodInfo = shokuzaiSheet.getRange(targetRow, 1, 1, 7).getValues();

        replyMessage = foodInfo[0].join('\n');
    }


    return [replyMessage, flag];
}

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