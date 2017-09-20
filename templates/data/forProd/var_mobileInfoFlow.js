var headline = '[[name=标题,width=250,type=textfield,allowblank=true]]';
var lead = '[[name=导语,width=250,type=textfield,allowblank=true]]';
var image = '[[name=配图,width=250,type=textfield,allowblank=true]]';
var bgColor = '[[name=底色（0~4）,width=250,type=textfield,allowblank=true,default=4]]';
var Click = '[URL]';
var Imp = '[[name=第三方监测,type = textfield,allowblank = true,width=250]]';
var AdName = 'Paid Post';
var AssID = '[ASSID]';

var ifHideAdSign = '[[name=是否隐藏广告标志(Y/N),type = textfield,allowblank = false,width=250,default=N]]';
var hideAdSign = "";
if(ifHideAdSign == "Y") {
  hideAdSign = "yes";
} else {
  hideAdSign = "";
}