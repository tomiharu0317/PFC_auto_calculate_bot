//シートの内容を確認する
const readRecord = (messageListOption) => {

    let replyMessage = '';

    let command = messageListOption[0];
    let target = messageListOption[1];

    if (command === '食材') {
        replyMessage = readFoodInfo(target);

    } else if (command === '記録') {

    } else {
        replyMessage = "フォーマット:\n①食材の成分情報の確認\n確認 食材 <食材名>\n\n②記録の確認\n確認 記録 <日付>\n\n※空白を連続で挿入すると正しく判定できません。";
        break;
    }

    // A2:lastRowまでの間で食材名と一致する行を探す => その行のAN:GNまでを取得して渡す

    return replyMessage;
};

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
        let foodInfo = shokuzaiSheet.getRange(targetRow, 1, 1, 7).getValues();

        replyMessage = foodInfo.join(' ');
    }


    return replyMessage;
}