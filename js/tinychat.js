// 自分の緯度経度情報
var lat = 0; // 緯度
var lon = 0; // 経度
var dateFormat = new DateFormat('yyyy/MM/dd HH:mm:ss');
var ws;

// ページロード完了後のready関数（初期化関数）
$(function() {
    // ステータス表示領域を初期にセット
    $('#status').html('not connected');
    
    // WebSocketのセットアップ
    setupWebSocket();
    
    // ブラウザを閉じた時の処理
    $(window).unload(function() {
        ws.onclose();
    })
    
    // 送信ボタン押下時のイベントを設定
    $('#send').submit(function(e) {
        sendMessage();
        return false; //submitボタン押下後のページ更新回避
    });
});

// WebSocketのセットアップメソッド
function setupWebSocket() {
    // WebSocket作成
    ws = new WebSocket('ws://133.30.159.8/***');

    // WebSocket open時の処理
    ws.onopen = function() {
        $('#status').html('connection success');
    }

    // WebSocket message受信時の処理
    ws.onmessage = function(message) {
        var json = $.parseJSON(message.data);

        // テーブルのフォーマットでlogフィールドに書き出す
        $('#log > tbody').prepend('<tr>' +
            '<td>' + json.uid + '</td>' +
            '<td>' + json.msg + '</td>' +
            '<td>' + json.date + '</td>' + 
            '<td>' + json.lat + '</td>' +
            '<td>' + json.lon + '</td>'+ '</tr>');
    }

    // WebSocket error時の処理
    ws.onerror = function() {
        $('#status').html('connection error!');
    }

    // WebSocket close時の処理
    ws.onclose = function() {
        $('#status').html('connection closed...');
    }
}

// WebSocketへのメッセージ送信メソッド
function sendMessage() {
    var uid = $('#uid').val();
    var msg = $('#msg').val();
    var date = dateFormat.format(new Date());
    
    // JSON形式のメッセージを生成
    var message = {uid:uid, msg:msg, date:date, lat:lat, lon:lon};
    
    // Stringに変換してサーバに送信
    ws.send(JSON.stringify(message));
}