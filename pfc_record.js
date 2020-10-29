const ACCESS_TOKEN = 'Z6tzun1cRIC1u1WHlgBMafxno2IOy/oVnMDIxq1L1p+OmZ//L2Djy4thpXX9odd7gHSiLiuqjSygna6MYX2Ev0/Vi+REzDF90WS6QUXl4OUOBLzTYgaBnncceOt9ai6wBG4/MsBHrUZexK93pZ8Z/QdB04t89/1O/w1cDnyilFU=';
const REPLY_URL = 'https://api.line.me/v2/bot/message/reply';

const SHEET_ID = "1TY6ppgtHWGisrL8zsrThcKSyOalC-7Ao53P5OVoQGcE";

const sheet = SpreadsheetApp.openById("SHEET_ID");
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
          replyMessage = "フォーマット: 記録 <食材名> <分量> (<日付>)\n\n※空白を連続で挿入すると正しく判定できません。";
      } else {
          replyMessage = addRecord(messageList.slice(1));
      }
  } else if (command === '確認'){
      if (messageLength > 2 || messageLength < 2){
          replyMessage = "フォーマット:\n①食材の成分情報の確認\n確認 <食材名>\n\n②記録の確認\n確認 <日付>\n\n※空白を連続で挿入すると正しく判定できません。";
      } else {
          replyMessage = readRecord(messageList.slice(1));
      }
  } else {
      replyMessage = changeRecord(messageList.slice(1));
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
        replyMessage = "【コマンドの説明】\n記録：その日に食べた食材の分量を記録します。食材は事前に追加コマンドから登録しておく必要があり、その情報を基に計算されます。\n\n・フォーマット\n記録 <食材名> <分量> (<日付>)\n\n・例\n記録　鶏胸肉　130　9/21\n\n※日付を省略した場合、記録した日を日付として記録します。";
    } else if (option === '変更'){
        replyMessage = "【コマンドの説明】\n変更：食材の成分情報、または記録を変更します。\n\n①食材の成分情報の変更\n\n・フォーマット\n変更 食材 <食材名> (以下同じ)\n\n②記録の変更\n\n・フォーマット\n変更 記録 <日付> <食材名> <番号> <分量>\n\n※番号は確認コマンドで確認することが出来ます。";
    } else if (option === '確認'){
        replyMessage = "【コマンドの説明】\n確認：食材の情報、または記録内容を表示します。\n\n①食材の成分情報の確認\n\n・フォーマット\n確認 <食材名>\n\n②記録の確認\n\n・フォーマット\n確認 <日付>\n\n・例\n確認　9/21";
    } else {
        replyMessage = "【使い方】\n使用できるコマンドを、指定されたフォーマットに沿って入力していただきます。空白は半角・全角を区別しません。\n\n【使用できるコマンド】\n追加、記録、変更、確認、ヘルプ\n\n【ヘルプコマンド】\n\nヘルプ　概要：この説明文が表示されます。\n\nヘルプ　追加：追加コマンドの説明、フォーマット\n\nヘルプ　記録：記録コマンドの説明、フォーマット\n\nヘルプ　変更：変更コマンドの説明、フォーマット\n\nヘルプ　確認：確認コマンドの説明、フォーマット\n";
    }

    return replyMessage;
};

//食材をshokuzaiシートに追加
const addFood = (messageListOption) => {


    let flag = true;

    let replyMessage = '';

    const copyListOption = [...messageListOption];

    let foodName = messageListOption.shift();

    // 不明 => 0に変更
    // 全てnumber型でなければvalidate

    for (let i = 0; i < 6; i++) {
        if (typeof(messageListOption[i]) !== 'number') {
            replyMessage = "数値を入力してください。";
            flag = false;
            break;
        }
    }

    // 値を登録
    let lastRow = shokuzaiSheet.getLastRow();

    shokuzaiSheet.getRange(lastRow+1, 1, 1, 7).setValues(copyListOption);

    if (flag){
        replyMessage = "食材 ${foodName} を追加しました。";
    }

    return replyMessage;
};

//シートに記録
const addRecord = (messageListOption) => {

    let replyMessage = 'a';

    return replyMessage;
};

//シートの記録を変更
const changeRecord = (messageListOption) => {

    let replyMessage = 'a';

    return replyMessage;
};

//シートの内容を確認する
const readRecord = (messageListOption) => {

    let replyMessage = 'a';

    return replyMessage;
};