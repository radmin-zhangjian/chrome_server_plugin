var totalPage;
var page = 0;
//注册前台页面监听事件
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
		// totalPage = $("input[name=totalPage]").val();
		// console.log("totalPage----------" + totalPage);
		//console.log("msg----------contentscript.js" + request.greeting);
		console.log("onMessage-----addListener-----" + request.greeting);
		getOrderInfo( sendResponse );
	  sendResponse("")
});

//获取信息
function getOrderInfo( sendResponse ){
	var flag = false;
	dataMap =  new Object();

	//基础信息
	resumeBasicArr = [];
	$("div span[class=resume-basic__chip]").each(function(index){
		spantxt = '';
		spantxt = $(this).text();
		resumeBasicArr.push(spantxt);
	});

	// 基础信息 拼装json
	dataMap.resumeBasic = new Object();
	dataMap.resumeBasic.xingbie = resumeBasicArr[0]
	dataMap.resumeBasic.nianling = resumeBasicArr[1]
	dataMap.resumeBasic.gongling = resumeBasicArr[2]
	dataMap.resumeBasic.xuli = resumeBasicArr[3]
	dataMap.resumeBasic.dizhi = resumeBasicArr[4]
	if(resumeBasicArr.length > 6){
		if(resumeBasicArr[5].indexOf('户籍') > -1){
			dataMap.resumeBasic.huji = resumeBasicArr[5]
		} else {
			dataMap.resumeBasic.zhengzhimiaomao = resumeBasicArr[5]
		}
		if(resumeBasicArr.length > 7){
			dataMap.resumeBasic.zhengzhimiaomao = resumeBasicArr[6]
			dataMap.resumeBasic.zhuangtai = resumeBasicArr[7]
		} else {
			dataMap.resumeBasic.zhuangtai = resumeBasicArr[6]
		}
	} else {
		dataMap.resumeBasic.zhuangtai = resumeBasicArr[5]
	}
	jsonString = JSON.stringify(dataMap.resumeBasic)
	console.log("------dataMap.resumeBasic------基础信息：" + jsonString);

	//求职意向
	dataMap.resumeJobIntention = [];
	$("div[class=resume-content__section] div[class=resume-content__body] div[class=is-mb-12]").each(function(index){
		dataMap.resumeJobIntention[index] = new Object()
		tmpArr = $(this).find("div[class=resume-content__main]").text().trim().split(/\s+/)
		dataMap.resumeJobIntention[index].yuyan = tmpArr[0]
		dataMap.resumeJobIntention[index].xinzhi = tmpArr[1]
		wtmp2 = $(this).find("div[class=is-mt-4] span[class=resume-content__chip]").text().trim()
		dataMap.resumeJobIntention[index].dizhi = wtmp2
		wtmp3 = $(this).find("span[class='resume-content__chip is-ml-8']").text().trim()
		dataMap.resumeJobIntention[index].zhiye = wtmp3
	});
	jsonString = JSON.stringify(dataMap.resumeJobIntention)
	console.log("------dataMap.resumeJobIntention------求职意向：" + jsonString);

	//教育经历
	dataMap.resumeEducation = [];
	$("div[class='resume-content__section educationExperiences'] div[class=resume-content__body] div[class=km-timeline__item]").each(function(index){
		dataMap.resumeEducation[index] = new Object()
		tmpArr = $(this).find("div[class=resume-content__main]").text().trim().split(/\s+/)
		dataMap.resumeEducation[index].xuexiao = tmpArr[0]
		dataMap.resumeEducation[index].zhuanye = tmpArr[1]
		wtmp2 = $(this).find("span[class=resume-content__chip]").text().trim()
		dataMap.resumeEducation[index].datetime = wtmp2
		wtmpArr = $(this).find("span[class='resume-content__chip is-ml-8']").text().trim().split(/\s+/)
		dataMap.resumeEducation[index].xueli = wtmpArr[0]
		dataMap.resumeEducation[index].xuelixingzhi= wtmpArr[1]
	});
	jsonString = JSON.stringify(dataMap.resumeEducation)
	console.log("------dataMap.resumeEducation------教育经历：" + jsonString);

	//工作经历
	dataMap.resumeWork = [];
	$("div[class=resume-content__section] div[class='km-timeline km-timeline--thin km-timeline--tailed'] div[class=km-timeline__item]").each(function(index){
		dataMap.resumeWork[index] = new Object()
		tmpArr = $(this).find("div[class=resume-content__main]").text().trim().split(/\s+/)
		dataMap.resumeWork[index].mingcheng = tmpArr[0]
		dataMap.resumeWork[index].zhiwei = tmpArr[1]
		if (tmpArr.length > 2) {
			dataMap.resumeWork[index].zhiwei += " " + tmpArr[2]
		}
		hangye = $(this).find("div[class=is-mt-4] span[class=is-mr-16]").text().trim()
		dataMap.resumeWork[index].hangye = hangye
		xinzhi = $(this).find("div[class=is-mt-4] span[class='resume-content__chip is-mr-16']").text().trim()
		dataMap.resumeWork[index].xinzhi = xinzhi
		datetime = $(this).find("div[class=is-mt-4] span[class=resume-content__chip]").text().trim()
		dataMap.resumeWork[index].datetime = datetime
		miaoshu = $(this).find("div[class=is-mt-12]").text().trim()
		dataMap.resumeWork[index].miaoshu = miaoshu
	});
	jsonString = JSON.stringify(dataMap.resumeWork)
	console.log("------dataMap.resumeWork------工作经历：" + jsonString);

	//姓名
	$("div[class=resume-basic__name-wrap] span[class=resume-basic__name]").each(function(index){
		name = '';
		name = $(this).text().trim();
		dataMap.resumeBasic.xingming = name
	});

	// 发送信息
	// console.log("------$.isEmptyObjec------：" + dataMap.resumeBasic.xingbie);
	// jsonString = JSON.stringify(dataMap)
	// if (JSON.stringify(dataMap.resumeBasic) != "{}") {
	if (dataMap.resumeBasic.xingbie != undefined) {
		jsonString = JSON.stringify(dataMap)
		sendMsg(jsonString, "end" );
	}


	// resumeBasic = [];//基础信息
	// $("div[class=talent-basic-info__basic]").each(function(index){
	// 	spantxt = '';
	// 	spantxt = $(this).text();
	// 	basicInfo = spantxt.trim().split(/\s+/).join("!%!")
	// 	resumeBasic.push(basicInfo);
	// 	console.log(index + "------resumeBasic------基础信息：" + resumeBasic);
	//
	// });
	//
	// resumeExtra = [];//扩展信息
	// $("div[class=talent-basic-info__extra]").each(function(index){
	// 	spantxt = '';
	// 	spantxt = $(this).text();
	// 	extraInfo = spantxt.trim().split(/\s+/).join("!%!")
	// 	resumeExtra.push(extraInfo);
	// 	console.log(index + "------resumeExtra------扩展信息：" + resumeExtra);
	//
	// });

	// resumeName = [];//姓名
	// $("div[class=talent-basic-info__name--inner]").each(function(index){
	// 	h1title = '';
	// 	h1title = $(this).text().trim();
	// 	resumeName.push(h1title);
	// 	console.log(index + "------resumeName------姓名：" + h1title);
	//
	// 	resumeDesc = resumeName[index] + splitstr + resumeBasic[index];
	// 	console.log("------resumeDesc------：" + resumeDesc);
	// 	dataInfo.push(resumeDesc);
	// 	sendMsg( dataInfo, "end" );
	// });


	// ************************************************************************

	//chrome.extension.sendMessage({"orderInfo": orderInfo}, function(response) {});
	// page = parseInt($("a[class=current]").text());
	// totalPage = parseInt($("input[name=totalPage]").val());
	// console.log(page + "--page-----------totalPage---" + totalPage);
	// if(page < totalPage && page < 100){
	// 	console.log("---------next-------");
	// 	sendMsg( orderInfo, "next" );
	// 	$('a.next')[1].click();
	// }else{
	// 	console.log("---------end-------");
	// 	sendMsg( orderInfo, "end" );
	// }
	//

}

//将获取内容传递给后台文件进行处理
function sendMsg( msg, cmd){
	console.log("---------end-------");
	console.log("msg:" + msg);
	chrome.extension.sendMessage({"msg": msg, "cmd": cmd}, function(response) {});
}

