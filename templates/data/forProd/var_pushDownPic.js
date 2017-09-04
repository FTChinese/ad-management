var detailPage = '[URL]';
var bannerImg = '[[name=banner图片链接,width=250,type=textfield,allowblank=false]]';
var bigPic = '[[name=扩展大图链接,width=250,type=textfield,allowblank=false]]';
var imgWidth = '[[name=图片宽度,width=250,type=textfield,allowblank=false,default=969]]';
var imgHeight = '[[name=图片高度,width=250,type=textfield,allowblank=false,default=90]]';
var complexPagePath = window.parent.location.origin + '/m/marketing/complex_pages/pushdownPic.html?[ASRANDOM]';
var innerFrameId=parentId + 'Inner';

var Imp = '[[name=第三方监测,type = textfield,allowblank = true,width=250]]';
var AdName = 'BMW Pushdown'; 
var AssID = '[ASCID]';
var adch = ascid.substr(0,4);
var adposition = ascid.substr(-4);

if (typeof window.parent.sendImpToThirdParty === 'function') {
    window.parent.sendImpToThirdParty(Imp, AdName, AssID);
} else {
    sendImpToThirdParty(Imp, AdName, AssID);
}