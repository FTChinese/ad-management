var ImgPortrait = '[[name=竖屏图片,width=250,type=textfield,allowblank=true]]';
var ImgLandscape = '[[name=横屏图片,width=250,type=textfield,allowblank=true]]';
var Imp = '[[name=第三方监测,type = textfield,allowblank = true,width=250]]';
var AdName = 'Web App Full Screen AD';
var AssID = '[ASSID]';

var ifHideAdSign = '[[name=是否隐藏广告标志(Y/N),type = textfield,allowblank = false,width=250,default=N]]';
var hideAdSign = "";
if(ifHideAdSign == "Y") {
  hideAdSign = "yes";
} else {
  hideAdSign = "";
}