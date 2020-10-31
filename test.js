// 投稿されたメッセージを取得
追加

let userMessage = "1 2 3 4 5 6";
let userMessage = "不明　不明 3 4 5 6";


変更

// 全角スペース => 半角スペース
userMessage = userMessage.replace(/　/g, ' ');
let messageList = userMessage.split(' ');
let messageLength = messageList.length;


let flag = true;
let replyMessage = '';
const copyListOption = [...messageListOption];
let foodName = messageListOption.shift();
// 不明 => 0に変更
// 全てnumber型でなければvalidate
// 問題ある処理
// 文字列の数値 => isNaN => false
// 文字列 => isNaN => true

for (let i = 0; i < 6; i++) {
        if (isNaN(messageList[i])) {
            console.log(messageList[i])
            // console.log(i)

            // break;
        }
        console.log(i)
}

    // 値を登録
if (flag) {
        let lastRow = shokuzaiSheet.getLastRow();
        shokuzaiSheet.getRange(lastRow+1, 1, 1, 7).setValues(copyListOption);

        replyMessage = "食材 ${foodName} を追加しました。";

}


let day = '';

day = '/';
day = '/11';
day = '12/11';
day = '12/11/22';
day = '21/11';
day = '12/34';
day = 'もじ/34';
day = '12/もじ';

let monthDate = day.split('/');
monthDate = day.split('/');

let monthDateLength = monthDate.length;

let month = parseInt(monthDate[0]);
month = parseInt(monthDate[0]);
let date = parseInt(monthDate[1]);
date = parseInt(monthDate[1]);

isNaN(month);
isNaN(date);

const Date = new Date();
const Month = Date.getMonth() + 1;

if (date < 1 || date > 31) {
    console.log('ダメ');
} else {
    console.log('良し');
}

if (month !== Month) {
    console.log('ダメ');
}