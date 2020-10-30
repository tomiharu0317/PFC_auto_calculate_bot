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


