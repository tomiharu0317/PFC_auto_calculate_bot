//食材情報を変更
const changeFoodInfo = (messageListOption) => {

    let flag = true;

    let replyMessage = '';

    let values = [];

    const copyListOption = [...messageListOption];

    values.push(copyListOption);

    let foodName = messageListOption.shift();

    for (let i = 0; i < 6; i++) {
        if (isNaN(messageListOption[i])) {
            replyMessage = "数値を入力してください。";
            flag = false;
            break;
        }
    }

    // A2:lastRowまでの間で食材名と一致する行を探す => その行の内容を変更

    // もし食材名も変更できるようにするなら、
    // 変更 食材 <元の食材名> <変更後の食材名> </変更後の食材名><分量(あたり)(g)><タンパク質> <脂質> <炭水化物> <糖質> <カロリー(kcal)></糖質>
    // になる

    if (flag) {
        let lastRow = shokuzaiSheet.getLastRow();
        let foodNum = lastRow - 1;

        let changeRow = 0;

        // [['さつまいも'], ['もち'], ['そば'], ['プロテイン']]
        let foodList = shokuzaiSheet.getRange(2, 1, foodNum, 1).getValues();

        // replyMessage = shokuzaiSheet.getRange(2, 1, foodNum, 1).getA1Notation();


        for (let j = 0; j < foodNum; j++) {
            if (foodList[j] == foodName) {
                changeRow = j + 2;
                break;
            }

            if (j === foodNum - 1) {
                replyMessage = "入力した食材は存在しません";
                flag = false;
                break;
            }
        }

        if (flag) {
            shokuzaiSheet.getRange(changeRow, 1, 1, 7).setValues(values);
            // replyMessage = shokuzaiSheet.getRange(lastRow+1, 1, 1, 7).getA1Notation();

            replyMessage = "食材 ${foodName} の情報を変更しました。".replace("${foodName}", foodName);
        }



    }

    return replyMessage;
};