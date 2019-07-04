
var reqUrl = "";
chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (msg) {
        console.log("message recieved" + msg.url);
        reqUrl = msg.url;
        sendReq();
        setInterval(function () {
            sendReq();
        }, 60 * 1000 * msg.time);

        port.postMessage(msg);
    });
})

function sendReq() {
    console.log("sendReq before")
    fetch(reqUrl)
        .then(function (response) {
            console.log(response);
        });

    console.log("sendReq success")
}
