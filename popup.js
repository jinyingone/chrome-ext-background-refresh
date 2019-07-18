/**
 * 加载后启动
 */
$(function () {
  var reqUrl = localStorage.getItem("reqUrl");
  if (reqUrl != undefined && (reqUrl.startsWith("http://") || reqUrl.startsWith("https://"))) {
    $("#auto_refresh_url").val(localStorage.getItem("reqUrl"))
    goToURL();
    sendMsgToContent();
  }
})

/**
 * 检查并跳转到指定的页面`
 */
function goToURL() {
  chrome.tabs.getAllInWindow(undefined, function (tabs) {
    for (var i = 0, tab; tab = tabs[i]; i++) {
      if (tab.url && isSameDomain(getReqUrl(), tab.url)) {
        chrome.tabs.update(tab.id, { selected: true });
        return;
      }
    }
    chrome.tabs.create({ url: getReqUrl() });
  });
}


$("#startRefresh").click(function () {
  goToURL();
  localStorage.setItem("reqUrl", getReqUrl())
  console.log(localStorage.getItem("reqUrl"))
  sendMsgToContent();
});


// popup直接给contentscript发消息
function sendMsgToContent() {
  var port = chrome.extension.connect({
    name: "Sample Communication"
  });
  port.postMessage({
    "url": getReqUrl(),
    "time": $("#timeInterval").val()
  });
  port.onMessage.addListener(function (msg) {
    console.log("message recieved" + msg);
  });
}

function getReqUrl() {
  return ($("#auto_refresh_url").val())
}

/**
 * 提取url字符串中的域名
 * @param {string} url 
 */
function extractDomain(url) {
  var domain;
  //find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  }
  else {
    domain = url.split('/')[0];
  }

  //find & remove port number
  domain = domain.split(':')[0];

  return domain;
}

/**
 * 两个url是否同一个域名
 * @param {string} url1 
 * @param {string} url2 
 */
function isSameDomain(url1, url2) {
  return extractDomain(url1) == extractDomain(url2);
}