if(!parentId) {
  var parentId = "banner0";
}
var detailPage = "https://www.hennessy.com/zh-cn/hennessyparadisimperial/";
var bannerImg = "http://i.ftimg.net/picture/2/000071402_piclink.jpg";
var bigPic = "https://du3rcmbgk4e8q.cloudfront.net/ads/beijing/201709/Mobile-information_960x540_50k.jpg";
var imgWidth = '969';
var imgHeight = '90';
var complexPagePath = "complex_pages/pushdownPic.html";
var innerFrameId=parentId + 'Inner';

// MARK:forShow模式不需调用sendImpToThirdParty(Imp, AdName, AssID)，故不用定义Imp, AdName

var AssID = '000000';
var adch = AssID.substr(0,4);
var adposition = AssID.substr(-4);