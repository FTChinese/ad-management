var detailPage = '[URL]';
var bannerImg = '[[name=图片链接,width=250,type=textfield,allowblank=false]]';
var imgWidth = '[[name=图片宽度,width=250,type=textfield,allowblank=false,default=969]]';
var imgHeight = '[[name=图片高度,width=250,type=textfield,allowblank=false,default=90]]';
var videoPoster = '[[name=视频底图,width=250,type=textfield,allowblank=false]]';
var sourceUrl = '[[name=视频链接,width=250,type=textfield,allowblank=false]]';
var sourceType = "video/mp4";

var complexPagePath = window.parent.location.origin + '/m/marketing/pushdownVideo.html?[ASRANDOM]';
var innerFrameId=parentId + 'Inner';
var Imp = '[[name=第三方监测,type = textfield,allowblank = true,width=250]]';
var AdName = '[[name=广告名称,type = textfield,allowblank = true,width=250]]'; 
var AssID = '[ASCID]';

var adch = AssID.substr(0,4);
var adposition = AssID.substr(-4);

var ifHideAdSign = '[[name=是否隐藏广告标志(Y/N),type = textfield,allowblank = false,width=250,default=N]]';
var hideAdSign = "";
if(ifHideAdSign == "Y") {
  hideAdSign = "yes";
} else {
  hideAdSign = "";
}

if (typeof window.parent.sendImpToThirdParty === 'function') {
    window.parent.sendImpToThirdParty(Imp, AdName, AssID);
} else {
    sendImpToThirdParty(Imp, AdName, AssID);
}