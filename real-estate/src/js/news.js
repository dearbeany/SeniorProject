function thousand_comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}
function UpbitData() {
    $.ajax({
        url: "https://api.upbit.com/v1/market/all",
        dataType: "json"
    }).done(function (markets) {
        let arr_krw_markets = "";
        let arr_korean_name = [];
        for (var i = 0; i < markets.length - 205; i++) {
            if (markets[i].market.indexOf("KRW") > -1) {
                arr_krw_markets += markets[i].market + (","); // KRW_ETH에서 KRW뗀 이름 모음
                arr_korean_name.push(markets[i].korean_name.replace("코인", "")); // 한글이름 (이더리움코인)에서 코인 뺀 이름모음
            }
        }
        arr_krw_markets = arr_krw_markets.substring(0, arr_krw_markets.length - 1);
        $.ajax({
            url: "https://api.upbit.com/v1/ticker?markets=" + arr_krw_markets,
            dataType: "json"
        }).done(function (info) {
            $("#table_ticker > tbody > tr").remove();
            for (let i = 0; i < info.length; i++) {
                let rows = "<tr><td>" + arr_korean_name[i] + "(" + info[i].market.replace("KRW-", "") + ")" + "</td>" // 이더리움(ETH)
                if ((info[i].signed_change_rate * 100).toFixed(2) > 0) {
                    rows += "<td><font color='red'>" + "▲ " + thousand_comma(info[i].trade_price) + "</td>" //현재시가
                }
                else if ((info[i].signed_change_rate * 100).toFixed(2) < 0) {
                    rows += "<td><font color='blue'>" + "▼ " + thousand_comma(info[i].trade_price) + "</td>" //현재시가
                }
                else {
                    rows += "<td>" + thousand_comma(info[i].trade_price) + "</td>" //현재시가
                }
                rows += "<td><font color='red'>" + thousand_comma(info[i].high_price) + "</font></td>" //최고시가
                rows += "<td><font color='blue'>" + thousand_comma(info[i].low_price) + "</font></td>" //최저시가
                if ((info[i].signed_change_rate * 100).toFixed(2) > 0) {
                    rows += "<td><font color='red'>" + "+ " + thousand_comma((info[i].signed_change_rate * 100).toFixed(2)) + " %" + "</font></td>" //등락률
                }
                else if ((info[i].signed_change_rate * 100).toFixed(2) < 0) {
                    rows += "<td><font color='blue'>" + "- " + thousand_comma(Math.abs((info[i].signed_change_rate * 100).toFixed(2))) + " %" + "</font></td>" //등락률
                }
                else {
                    rows += "<td>" + thousand_comma((info[i].signed_change_rate * 100).toFixed(2)) + " %" + "</td>" //등락률
                }
                rows += "<td>" + thousand_comma((info[i].acc_trade_volume_24h).toFixed(0) + " " + "<font size='2'>" + info[i].market.replace("KRW-", "")) + "</td>" // 24시간 내 거래량
                rows += "<td>" + thousand_comma((info[i].acc_trade_price_24h > 1000000 ? (info[i].acc_trade_price_24h / 1000000) : ((info[i].acc_trade_price_24h).toFixed(0) + info[i].acc_trade_price_24h > 1000000 ? "백만" : "")).toFixed(0)) + " <font size='2'>백만</font>" + "</td>" //24시간내 거래대금
                rows += "</tr>";
                $("#table_ticker").append(rows); // 표에 붙임
            } // end for…
        })  //done(function(tickers){
    }) // end done(function(markets){
        .fail(function () {
            $.text("API 접근 중 오류가 발생하였습니다");
        })
}
setInterval(UpbitData, 3000);
$(function () {
    var color = localStorage.getItem("test_upbit_color");
    UpbitData();
});
function setColor(color) {
    localStorage.setItem("test_upbit_color", color);
}
UpbitData();