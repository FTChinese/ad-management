var fullScreenImage = {
    'imageUrl': '[[name=图片链接,width=250,type=textfield,allowblank=true]]',
    'link': '[URL]',
    'widthByHeight': '[[name=宽高比例,width=250,type=textfield,allowblank=false,default=4]]'
};
var Imp = '[[name=曝光监测,type=textfield,allowblank=true,width=250]]';
var AdName = 'Full Width Top Banner';
var AssID = '[ASSID]';
var HouseAd = '[[name=打底广告(Y/N),width=250,type=textfield,allowblank=false,default=N]]';

var ifHideAdSign = '[[name=是否隐藏广告标志(Y/N),type = textfield,allowblank = false,width=250,default=N]]';
var hideAdSign = "";
if(ifHideAdSign == "Y") {
  hideAdSign = "yes";
} else {
  hideAdSign = "";
}