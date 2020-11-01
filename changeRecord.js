//シートの記録を変更
const changeRecord = (messageListOption) => {

    let replyMessage, flag, date;
    [replyMessage, flag, date] = ['', true, ''];

    let foodInfo, foodAmountBase, targetColumn, sheetLastRow, targetRow;
    [foodInfo, foodAmountBase, targetColumn, sheetLastRow, targetRow] = [[], 0, 0, 0, 0];

    let day = messageListOption[0];
    let foodName = messageListOption[1];
    let recordIndex = messageListOption[2];
    let laterFoodAmount = messageListOption[3];


    [flag, date, replyMessage] = inspectDate(day);

    if (flag) {
        [replyMessage, flag] = readFoodInfo(foodName, 'null');

        if (flag) {
            foodInfo = replyMessage.split('\n');
            foodAmountBase = Number(foodInfo[1]);
        }
    }

    if (flag) {
        [replyMessage, flag] = isNumber(recordIndex);
        [replyMessage, flag] = isNumber(laterFoodAmount);

        if (flag) {
            recordIndex = Number(recordIndex);

            targetColumn = 4 * date - 3;
            sheetLastRow = recordSheet.getLastRow();
            targetRow = findTargetRow(targetColumn, sheetLastRow);

            if (recordIndex < 1 || targetRow - 7 < recordIndex ) {
                replyMessage = "入力された番号の記録は存在しません。";
                flag = false;
            } else {
                targetRow = recordIndex + 8;

            }
        }
    }

    if (flag) {
        // 合計からもとのfoodAmountの文を引く
        // 合計にfoodAmountの文を足す
        // 合計に記録
        // targetRowに記録

        // sumValues = [[''], [''], [''], [''], ['']];
        let sumValues = recordSheet.getRange(3, targetColumn + 1, 5, 1).getValues();
        let changedValues = [];

        // formerFoodAmount = [['120']];
        // laterFoodAmount = '100';
        let formerFoodAmount = recordSheet.getRange(targetRow, targetColumn + 3, 1, 1).getValues();
            formerFoodAmount = Number(formerFoodAmount[0][0]);
            laterFoodAmount  = Number(laterFoodAmount);

        let ratio = formerFoodAmount / foodAmountBase;

        let proteinBase = Number(foodInfo[2]);
        let fatBase     = Number(foodInfo[3]);
        let carobBase   = Number(foodInfo[4]);
        let sugarBase   = Number(foodInfo[5]);
        let calorieBase = Number(foodInfo[6]);


        let protein = (Number(sumValues[0]));
        let fat     = (Number(sumValues[1]));
        let carbo   = (Number(sumValues[2]));
        let sugar   = (Number(sumValues[3]));
        let calorie = (Number(sumValues[4]));


        // 元の奴を引く
        protein -=  proteinBase * ratio;
        fat     -=  fatBase     * ratio;
        carbo   -=  carobBase   * ratio;
        sugar   -=  sugarBase   * ratio;
        calorie -=  calorieBase * ratio;

        // 後の奴を足す
        ratio = laterFoodAmount / foodAmountBase;

        protein = (protein + (proteinBase * ratio)).toFixed(2);
        fat     = (fat     + (fatBase     * ratio)).toFixed(2);
        carbo   = (carbo   + (carobBase   * ratio)).toFixed(2);
        sugar   = (sugar   + (sugarBase   * ratio)).toFixed(2);
        calorie = (calorie + (calorieBase * ratio)).toFixed(2);

        sumValues = [[protein], [fat], [carbo], [sugar], [calorie]];
        changedValues = [[foodName, laterFoodAmount]];


        recordSheet.getRange(3, targetColumn + 1, 5, 1).setValues(sumValues);
        recordSheet.getRange(targetRow, targetColumn + 2, 1, 2).setValues(changedValues);

        replyMessage = "記録を変更しました。";
    }

    return replyMessage;
};