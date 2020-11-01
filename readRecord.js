//シートの内容を確認する
const readInfo = (messageListOption) => {

    let replyMessage, flag;
    [replyMessage, flag] = ['', true];

    let command = messageListOption[0];
    let target = messageListOption[1];

    if (command === '食材' && target !== '一覧') {
        [replyMessage, flag] = readFoodInfo(target, "null");

    } else if(command === '食材' && target === '一覧') {
        replyMessage = readFoodInfoAll();

    } else if (command === '記録') {
        replyMessage = readRecordInfo(target);

    } else {
        replyMessage = "フォーマット:\n①食材の成分情報の確認\n確認 食材 <食材名>\n\n②登録された食材の一覧を取得\n確認　食材　一覧\n\n③記録の確認\n確認 記録 <日付>\n\n※空白を連続で挿入すると正しく判定できません。";
    }

    return replyMessage;
};

const readFoodInfo = (foodName, option) => {

    let replyMessage, flag, targetRow;
    [replyMessage, flag, targetRow] = ['', true, 0];

    let lastRow = shokuzaiSheet.getLastRow();
    let foodNum = lastRow - 1;

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

    if (option === 'fetchTargetRow') {
        return [replyMessage, flag, targetRow];
    } else {
        return [replyMessage, flag];
    }
}

const readFoodInfoAll = () => {

    let replyMessage = '';

    let lastRow = shokuzaiSheet.getLastRow();

    let foodNameList = shokuzaiSheet.getRange(2, 1, lastRow - 1, 1).getValues();

    replyMessage = foodNameList.join('\n');

    return replyMessage;
}

const readRecordInfo = (day) => {

    let replyMessage, flag, date;
    [replyMessage, flag, date] = ['', true, ''];

    // return [flag, date, replyMessage];
    [flag, date, replyMessage] = inspectDate(day);

    if (flag) {
        let targetColumn = 4 * date - 3;
        let sheetLastRow = recordSheet.getLastRow();
        let targetRow = findTargetRow(targetColumn, sheetLastRow);

        let sumList = recordSheet.getRange(2, targetColumn, 6, 2).getValues();

        let recordList = recordSheet.getRange(9, targetColumn, targetRow - 7, 4).getValues();

        // データ整形

        // [['合計', ''], ['タンパク質', '100'], ['脂質', '100'], ['炭水化物', '100'], ['糖質', '100'], ['カロリー', '100']];
        let sumStr = sumList[0][0] + '\n' + sumList[1][0] + ':' + sumList[1][1] + '\n' + sumList[2][0] + ':' + sumList[2][1] + '\n' + sumList[3][0] + ':' + sumList[3][1] + '\n' + sumList[4][0] + ':' + sumList[4][1] + '\n' + sumList[5][0] + ':' + sumList[5][1];

        // [['1', '22:11', 'プロテイン', '111'], ['2', '22:38', 'さつまいも', '50'], ['3', '22:40', 'もち', '46']];

        let recordStr, connectStr, dateStr, time, dateList, list;
        [recordStr, connectStr, dateStr, time, dateList, list] = ['', '', '', '', [], []];

        for (let k = 0; k < recordList.length; k++) {

            dateStr = recordList[k][1] + '';
            dateList = dateStr.split(':');
            list = dateList[0].split(' ');

            time = list[list.length - 1] + ':' + dateList[1];

            connectStr = recordList[k][0] + '.' + ' ' + time + ' ' + recordList[k][2] + ' ' + recordList[k][3] + '\n';

            recordStr += connectStr;
        }

        replyMessage = sumStr + '\n\n' + recordStr;
    }

    return replyMessage;
}