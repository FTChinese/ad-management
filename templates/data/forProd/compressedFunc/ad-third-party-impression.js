function sendImpToThirdParty(t,e,n){if("string"==typeof t){"object"!=typeof window.parent.gTrackThirdParyImpression&&(window.parent.gTrackThirdParyImpression={});var r=0,a=t,i=!1,o=function(){var t=arguments[0]||"",e=arguments[1]||"",r=arguments[2]||"",a="G"+Math.round(1e12*Math.random());try{window.parent.ga("send","event",t,e,r,{nonInteraction:1})}catch(i){(new Image).src="http://www.ftchinese.com/index.php/ft/hit/"+n+"/2?ec="+t+"&ea="+e+"&el="+encodeURIComponent(r)+"&r="+a}},c=function(){var d,s="IMG"+Math.round(1e12*Math.random()),p=(new Date).getTime(),h=t;try{d=arguments[0]||""}catch(t){d=""}h.indexOf("?")<0&&(h+="?"),h=h.replace("ord=[timestamp]","ord="+p)+"&"+s+"&ftctime="+p,r>0&&(h=0===a.indexOf("https")?(h=h.replace("https://ad.doubleclick.net","http://ad.doubleclick.net")).replace("https://v.admaster.com.cn","http://v.admaster.com.cn"):(h=h.replace("http://ad.doubleclick.net","https://ad.doubleclick.net")).replace("http://v.admaster.com.cn","https://v.admaster.com.cn")),a=h,window.parent.gTrackThirdParyImpression[s]=new Image,window.parent.gTrackThirdParyImpression[s].src=h,window.parent.gTrackThirdParyImpression[s].title=e+" ("+n+")",window.parent.gTrackThirdParyImpression[s].alt=t,window.parent.gTrackThirdParyImpression[s].onload=function(){var t="";t=0===r?"Success":""!==d?"Success on Retry"+d:"Success on Retry"+r,o(this.title,t,this.alt),delete window.parent.gTrackThirdParyImpression[s],i=!0},window.parent.gTrackThirdParyImpression[s].onerror=function(){var t="";if(t=0===r?"Fail":""!==d?"Fail on Retry"+d:"Fail on Retry"+r,o(this.title,t,this.alt),o("Fail UA String",n,window.parent.adReachability()),"string"==typeof window.uaString)try{window.parent._hmt.push(["_trackEvent",this.title,"Fail",window.uaString])}catch(t){}++r<=3&&setTimeout(c,100*r*r*r)}};c(),setTimeout(function(){if(!1===i&&0===r){r=2;c(" from Pending"),o(e+" ("+n+")","Request from Pending",t)}},1e4),o(e+" ("+n+")","Request",t)}}