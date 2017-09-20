var vid = '[[name=CC视频vid,type=textfield,allowblank=false,width=250]]';
var v_width = '[[name=视频width,type=textfield,allowblank=false,width=50,default=300]]';
var v_height = '[[name=视频height,type=textfield,allowblank=false,width=50,default=250]]';
var Imp = '[[name=第三方监测,type=textfield,allowblank=true,width=250]]';
var AdName = '[[name=广告命名,width=250,type=textfield,allowblank=true]]';
var AutoPlay = '[[name=自动播放(Y/N),width=250,type=textfield,allowblank=false,default=N]]';
var videoUrl = '[[name=视频URL（选填）,width=250,type=textfield,allowblank=true]]';
var AssID = '[ASSID]';
var Click = '[URL]';

var ifHideAdSign = '[[name=是否隐藏广告标志(Y/N),type = textfield,allowblank = false,width=250,default=N]]';
var hideAdSign = "";
if(ifHideAdSign == "Y") {
  hideAdSign = "yes";
} else {
  hideAdSign = "";
}