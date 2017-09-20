var ImgWidth = '[[name=图片宽度,width=250,type=textfield,allowblank=false]]';
var ImgHeight = '[[name=图片高度,width=250,type=textfield,allowblank=false]]';
var ImgSrc = '[[name=图片链接,width=250,type=textfield,allowblank=false]]';
var Click = '[URL]';
var Imp = '[[name=第三方监测,width=250,type=textfield,allowblank=true]]';
var AdName = '[[name=广告命名,width=250,type=textfield,allowblank=true]]';
var AssID = '[ASSID]';
var HouseAd = '[[name=打底广告(Y/N),width=250,type=textfield,allowblank=false,default=N]]';

var ifHideAdSign = '[[name=是否隐藏广告标志(Y/N),type = textfield,allowblank = false,width=250,default=N]]';
var hideAdSign = "";
if(ifHideAdSign == "Y") {
  hideAdSign = "yes";
} else {
  hideAdSign = "";
}