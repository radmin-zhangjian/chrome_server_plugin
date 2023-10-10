var flag = false;
var currentTabId;
chrome.browserAction.onClicked.addListener(function(tab) {
  counter = 40;
  console.log('Turning ' + tab.url);
  flag = true;
  currentTabId = tab.id;
  chrome.tabs.getSelected(null, function(tab) {
		sendMsg(tab.id);
	});
});


chrome.webNavigation.onCompleted.addListener(function( tab ){
	console.log('加载完成***' + tab.tabId );
	currentTabId = tab.tabId;
	// if( flag ){
		sendMsg( tab.tabId );
	// }
});

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
	  // datainfo = request.msg.join("#$#")
	  datainfo = request.msg
	  console.log("datainfo：" + datainfo);
    console.log("*******evenPage.js***chrome.extension.onMessage.addListener");
	articleData = request;
	$.ajax({
		url: "http://localhost/site/time",
		cache: false,
		type: "POST",
		// data: {'datainfo': request.msg.join("#$#")},
		data: {'datainfo': datainfo},
		dataType: "json"
	}).done(function(msg) {
		console.log('*******************json*************');
		// chrome.tabs.sendMessage(currentTabId, {"cmd":"end"},
		// 	function(response) {
		// 		console.log(response + "==========");
		// 	});
		
	}).fail(function(jqXHR, textStatus) {
		articleData.firstAccess = textStatus;
	});
	
	cmd = request.cmd;
	if('end' == cmd){
		flag = false;//确保不会自动运行
	}
	  sendResponse("")
 });

 function sendSku2Info(colores){
	 chrome.tabs.query(
			{active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {"cmd":"ok", "sku": colores}, 
				function(response) {    
					console.log(response);  	
				}); });
}
 
function sendMsg( tabid ){
	console.log(tabid + "--sendMsg()----eventPage.js");
	chrome.tabs.sendMessage(tabid, {greeting: "start working"}, function(response) {
	});
}
