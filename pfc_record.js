const ACCESS_TOKEN = 'J6vOd6E/I18qzMmXeSH4J2Lb72tsZBTKOTjqFHSh72f8bQjNHT6Rceqyr/ncJI9CgHSiLiuqjSygna6MYX2Ev0/Vi+REzDF90WS6QUXl4OWXfx7I1uelqB94kyt27jua65K+cd500nVdgagK0a9PkQdB04t89/1O/w1cDnyilFU=';
const REPLY_URL = 'https://api.line.me/v2/bot/message/reply';

const SHEET_ID = "1TY6ppgtHWGisrL8zsrThcKSyOalC-7Ao53P5OVoQGcE";

const sheet = SpreadsheetApp.openById(SHEET_ID);
const shokuzaiSheet = sheet.getSheetByName('shokuzai');
const recordSheet = sheet.getSheetByName("octo2020");


const commands = ['ヘルプ', '追加', '記録', '変更', '確認'];

function doPost(e) {

　　// 投稿されたメッセージを取得
  let userMessage = JSON.parse(e.postData.contents).events[0].message.text;

　// 全角スペース => 半角スペース
　userMessage = userMessage.replace(/　/g, ' ');

  let messageList = userMessage.split(' ');
  let messageLength = messageList.length;

　// コマンドがリストになかったら、ヘルプにして、ヘルプ概要のリプライをする
  let command = commands.includes(messageList[0]) ? messageList[0] : 'ヘルプ';

  let replyToken = JSON.parse(e.postData.contents).events[0].replyToken;

  let messageOption = messageList[1];

  if (command === 'ヘルプ'){
      if (messageLength > 2){
          replyMessage = "フォーマット: ヘルプ <option>\n\n※空白を連続で挿入すると正しく判定できません。";
      } else {
          replyMessage = help(messageList[1]);
      }

  } else if (command === '追加'){
      if (messageLength > 8 || messageLength < 8){
          replyMessage = "フォーマット: 追加 <食材名> <分量(あたり)(g)><タンパク質> <脂質> <炭水化物> <糖質> <カロリー(kcal)>\n\n※空白を連続で挿入すると正しく判定できません。";
      } else {
          replyMessage = addFood(messageList.slice(1));
      }
  } else if (command === '記録'){
      if (messageLength > 4 || messageLength < 3){
          replyMessage = "フォーマット: 記録 <食材名> <分量(g)> (<日付>)\n\n※空白を連続で挿入すると正しく判定できません。";
      } else {
          replyMessage = addRecord(messageList.slice(1), messageLength);
      }
  } else if (command === '確認'){
      if (messageLength > 3 || messageLength < 3){
          replyMessage = "フォーマット:\n①食材の成分情報の確認\n確認 食材 <食材名>\n\n②登録された食材の一覧を取得\n確認 食材 一覧\n\n③記録の確認\n確認 記録 <日付>\n\n※空白を連続で挿入すると正しく判定できません。";
      } else {
          replyMessage = readInfo(messageList.slice(1));
      }
  } else if (command === '変更' && messageOption === '食材'){
      if (messageLength > 9 || messageLength < 9){
          replyMessage = "フォーマット: 変更 食材 <食材名> <分量(あたり)(g)><タンパク質> <脂質> <炭水化物> <糖質> <カロリー(kcal)>";
      } else {
          replyMessage = changeFoodInfo(messageList.slice(2));
      }
  } else if (command === '変更' && messageOption === '記録'){
      if (messageLength > 6 || messageLength < 6){
          replyMessage = "フォーマット: 変更 記録 <日付> <食材名> <番号> <分量>";
      } else {
          replyMessage = changeRecord(messageList.slice(2));
      }
  }


  // 返信================================================
  UrlFetchApp.fetch(REPLY_URL, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': replyMessage,
      }],
    }),
  });
  // =======================================

  return ContentService.createTextOutput(JSON.stringify({ content: 'post ok' })).setMimeType(ContentService.MimeType.JSON);  
}



//使い方説明
const help = (option) => {

    let replyMessage = '';

    if (option === '概要') {
        replyMessage = "【使い方】\n使用できるコマンドを、指定されたフォーマットに沿って入力していただきます。空白は半角・全角を区別しません。改行による入力には対応しておりません。\n\n【使用できるコマンド】\n追加、記録、変更、確認、ヘルプ\n\n【ヘルプコマンド】\n\nヘルプ　概要：この説明文が表示されます。\n\nヘルプ　追加：追加コマンドの説明、フォーマット\n\nヘルプ　記録：記録コマンドの説明、フォーマット\n\nヘルプ　変更：変更コマンドの説明、フォーマット\n\nヘルプ　確認：確認コマンドの説明、フォーマット\n";

    } else if (option === '追加'){
        replyMessage = "【コマンドの説明】\n追加：食材の栄養情報を登録します。\n\n・フォーマット\n追加 <食材名> <分量(あたり)(g)><タンパク質> <脂質> <炭水化物> <糖質> <カロリー(kcal)>\n\n※不明の場合、該当箇所を不明としてください。その場合、計算時は0として計算されます。\n\n・例\n追加 さつまいも 100 1.2 0.2 32 31 131\n\n追加 さつまいも 100 1.2 不明 32 不明 131";
    } else if (option === '記録'){
        replyMessage = "【コマンドの説明】\n記録：その日に食べた食材の分量を記録します。食材は事前に追加コマンドから登録しておく必要があり、その情報を基に計算されます。\n\n・フォーマット\n記録 <食材名> <分量(g)> (<日付>)\n\n・例\n記録　鶏胸肉　130　9/21\n\n※日付を省略した場合、記録した日を日付として記録します。";
    } else if (option === '変更'){
        replyMessage = "【コマンドの説明】\n変更：食材の成分情報、または記録を変更します。\n\n①食材の成分情報の変更\n\n・フォーマット\n変更 食材 <食材名> <分量(あたり)(g)><タンパク質> <脂質> <炭水化物> <糖質> <カロリー(kcal)>\n\n②記録の変更\n\n・フォーマット\n変更 記録 <日付> <食材名> <番号> <分量>\n\n※番号は確認コマンドで確認することが出来ます。";
    } else if (option === '確認'){
        replyMessage = "【コマンドの説明】\n確認：食材の情報、または記録内容を表示します。\n\n②登録された食材の一覧を取得\n確認 食材 一覧\n\n③食材の成分情報の確認\n\n・フォーマット\n確認 食材 <食材名>\n\n②記録の確認\n\n・フォーマット\n確認 記録 <日付>\n\n・例\n確認　9/21";
    } else {
        replyMessage = "【使い方】\n使用できるコマンドを、指定されたフォーマットに沿って入力していただきます。空白は半角・全角を区別しません。\n\n【使用できるコマンド】\n追加、記録、変更、確認、ヘルプ\n\n【ヘルプコマンド】\n\nヘルプ　概要：この説明文が表示されます。\n\nヘルプ　追加：追加コマンドの説明、フォーマット\n\nヘルプ　記録：記録コマンドの説明、フォーマット\n\nヘルプ　変更：変更コマンドの説明、フォーマット\n\nヘルプ　確認：確認コマンドの説明、フォーマット\n";
    }

    return replyMessage;
};

//食材をshokuzaiシートに追加
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

//シートに記録
const addRecord = (messageListOption, messageLength) => {

    let replyMessage = '';
    let foodInfo = [];
    let foodName = messageListOption[0];
    let foodAmount = messageListOption[1];
    let foodAmountBase = '';

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
        foodInfo = readFoodInfo(foodName);

        if (foodInfo === "入力した食材は存在しません") {
            replyMessage = foodInfo;
            flag = false;
        } else {
            foodInfo = foodInfo.split(',');

            foodAmountBase = Number(foodInfo[1]);
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
    } else {
        foodAmount = Number(foodAmount);
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
        // let sumValues = recordSheet.getRange(3, targetColumn + 1, 5, 1).getA1Notation();


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

//シートの記録を変更
const changeRecord = (messageListOption) => {

    let replyMessage = 'a';

    return replyMessage;
};

//シートの内容を確認する
const readInfo = (messageListOption) => {

    let replyMessage = '';

    let command = messageListOption[0];
    let target = messageListOption[1];

    if (command === '食材' && target !== '一覧') {
        replyMessage = readFoodInfo(target);

    } else if(command === '食材' && target === '一覧') {
        replyMessage = readFoodInfoAll();

    } else if (command === '記録') {
        replyMessage = readRecordInfo(target);

    } else {
        replyMessage = "フォーマット:\n①食材の成分情報の確認\n確認 食材 <食材名>\n\n②登録された食材の一覧を取得\n確認　食材　一覧\n\n③記録の確認\n確認 記録 <日付>\n\n※空白を連続で挿入すると正しく判定できません。";
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
        // [['さつまいも', '1', '2', '3', '4', '5', '6']]
        let foodInfo = shokuzaiSheet.getRange(targetRow, 1, 1, 7).getValues();

        replyMessage = foodInfo[0].join('\n');
    }


    return replyMessage;
}

const readFoodInfoAll = () => {

    let replyMessage = '';

    let lastRow = shokuzaiSheet.getLastRow();

    let foodNameList = shokuzaiSheet.getRange(2, 1, lastRow - 1, 1).getValues();

    replyMessage = foodNameList.join('\n');

    return replyMessage;
}

const readRecordInfo = (day) => {

    let flag = true;
    let date = '';
    let replyMessage = '';

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
        let recordStr = '';
        let connectStr = '';
        let dateStr = '';
        let time = '';
        let dateList = [];
        let list = [];

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