# 如何优雅地实现下推扩展广告

我们常常希望在网站广告中实现下推扩展风格，如[下推图片广告](), [下推视频广告]()。但常常会因为各种限制而达不到想要的效果，甚至会因为在广告代码中随意修改主体网站的DOM结构而发生意想不到的错误。

本文分享了一种思路可以比较优雅地实现下推扩展广告，希望能够对您有一些帮助。

## 1. 媒体网站上的广告位实现结构
想要优雅地实现下推扩展，首先要弄清楚媒体网站上广告位的现有实现结构。

### 1.1 外层iframe引入广告控制文件
由于广告代码的多变性，且其与网站主体完全独立，为了避免广告代码对主体网站代码可能造成的干扰，通常会在主体网站中使用iframe引入广告位。例如：

```
<div class="banner-container">
  <div class="banner-inner">
    <div class="banner-content" >
      <iframe src="a.html?adid=100010000201">
      </iframe>
    </div>
  </div>
</div>
```

在该示例代码中，iframe引入了一个控制具体广告的其他文件——a.html，且iframe的外层会有一些div来更精确地控制该广告位的外观。

### 1.2 广告控制文件写入广告投放系统script外链
在控制具体广告的文件中，通常会以script的方式引入广告系统（如传漾等）中的广告模板代码资源。例如上述a.html中的核心代码为：

```
<script>
  ...
  var c = window.location.href.replace(/^.*adid=([0-9A-Za-z\-]+).*$/,"$1");
  document.write ('<script src="http://dualstack.adsame-1421766300.ap-southeast-1.elb.amazonaws.com/s?z=ft&c=' + c + '&_fallback=0></script>');
  ...
</script>
```

其中c为广告位id号，由外层iframe的src指向的文件地址后附带的参数传递过来。上述外层iframe的src为"a.html?adid=100010000201"，其adid的值100010000201即为传递过来的c值。

这样根据c值就会找到广告系统中的对应广告模板。

### 1.3 script外链广告模板代码写入广告组成元素
上述代码的执行结果为：
```
<script>
  ...
  var c = window.location.href.replace(/^.*adid=([0-9A-Za-z\-]+).*$/,"$1");
  document.write ('<script src="http://dualstack.adsame-1421766300.ap-southeast-1.elb.amazonaws.com/s?z=ft&c=' + c  + '&_fallback=0"></script>');
  ...
</script>
<script src="http://dualstack.adsame-1421766300.ap-southeast-1.elb.amazonaws.com/s?z=ft&amp;c=100010000201&fallback=0">
</script>

```
最后一个script引入了位于广告系统的广告模板代码资源。

广告模板代码有两种情况。一种情况为，广告结构简单，且外观以静态为主（如mpu图片广告、静态banner广告），则广告模板代码会直接用document.write()方式写入组成广告结构的元素，例如：

```
  document.write('<div style="width:' + ImgWidth + 'px;height:' + ImgHeight + 'px;"><a href="' + Click + '"><img src="' + ImgSrc + '" style="width:' + ImgWidth + 'px;height:' + ImgHeight + 'px;" /></a></div>');
```

另一种广告结构复杂，且外观以动态为主（如h5动画广告），则广告模板需要用document.write写入另外一个iframe来引入实现具体广告逻辑的html文件，例如：
```
  document.write('<iframe  width="' + imgWidth + '" height="' + imgHeight + '" src="' + complexPagePath + '"></iframe>');
```
这时广告位的实现一共就出现了两层iframe。

### 1.4 双层iframe结构下的广告位
通过上述分析，不难得出，结构复杂、外观动态的广告应以双层iframe结构来呈现。综合上述代码片段可知，双层iframe广告位的最终结构如下：
```
<!--网站主体 DOM -->
<div class="banner-container">
  <div class="banner-inner">
    <div class="banner-content">
      <iframe src="a.html?adid=100010000201">

          <!-- 广告位外层iframe DOM -->
          <html>
          ...
            <body>
              ...

              <script>
                ...
                var c = window.location.href.replace(/^.*adid=([0-9A-Za-z\-]+).*$/,"$1");
                document.write ('<script src="http://dualstack.adsame-1421766300.ap-southeast-1.elb.amazonaws.com/s?z=ft&c=' + c  + '&_fallback=0"></script>');//写入广告投放系统script外链
                ...
              </script>

              <!-- 被写入的广告投放系统script外链 -->
              <script src="http://dualstack.adsame-1421766300.ap-southeast-1.elb.amazonaws.com/s?z=ft&amp;c=100010000201&fallback=0">
              </script>

              <!-- 被上述script外链写入的iframe -->
              <iframe src="pushdownPic.html ">

                  <!-- 广告位内层iframe DOM -->
                  <html>
                     <head>
                     ...
                     </head>
                     <body>
                     ...
                     </body>
                  </html>
              </iframe>
              ...
            </body>
          </html>
      </iframe>
    </div>
  </div>
</div>

```
该结构是优雅地实现下推扩展广告的基础结构。内层iframe的DOM中，是具体实现下推扩展逻辑的地方。

## 2. 双iframe结构实现下拉扩展广告的具体考虑
由1.可知，下推扩展广告应该采用双iframe结构。如何在内层iframe中实现具体的下推扩展逻辑是下一步应当考虑的问题。我们假设内层iframe引入的是一个叫做pushdownPic.html的文件。

### 2.1 两个状态 
下推扩展广告涉及两个状态：下推前的banner状态、下推后的大图状态。

那么html基础结构必然是具有一个banner区域和一个大图区域。例如：

banner区域：
```
<div id="bannerImgSection">
  <div class = "banner-img">
     <img id="bannerImg" src = "xxx" alt = "banner img">
  </div>
</div>
```

大图区域：
```
<div id="bigPicSection">
  <div class="big-pic">
    <img id="bigPic" src ="xxxx" alt = "big img">
  </div>

</div>
```

（两种区域可能会涉及一些a链接、下推\收缩按钮等其他元素，这里为了表述清晰简单而省略了）

### 2.2 两个动作
该广告涉及两个动作：下推、收缩。

这两个动作可对应两个css类。Eg:

下推动画类:
```
.pushdown-open {
   -webkit-animation:pushdownToOpen 1s linear;
}
@-webkit-keyframes pushdownToOpen {
  from {
    width:969px;
    height:90px;
  }
  to {
    width:969px;
    height:400px;
  }
}
```

收缩动画类：
```
.pullup-close {
  -webkit-animation:shrinkToClose 1s linear;
}

@-webkit-keyframes shrinkToClose {
  from {
    width:969px;
    height:400px;
  }
  to {
    width:969px;
    height:90px;
  }
}
```
(注意animation和keyframes要写全不同的浏览器内核对应的属性名称，这里为了表述清晰简单而省略了)

这样，实现两种状态的切换，只需在恰当的时候给相关元素分别添加和移除相应的css类。另外，在动画执行的开始和结束时间点，应注意两种状态对应元素的显示和隐藏。以banner到大图的下推切换为例： 在切换前，大图处于隐藏状态，banner处于显示状态；在切换开始时，隐藏banner，并以banner的尺寸显示大图区域的顶部，然后为大图添加.pushdown-open类；当动画执行完毕后，移除.pushdown-open类，此时大图显示全貌，banner仍然处于隐藏状态。

当pushdownPic.html作为独立的页面时，这样的动作切换逻辑显然是没有问题的。然而，pushdownPic.html是作为双层iframe结构中内层iframe的DOM引入到媒体网站的，由于受到两层iframe及外层iframe的祖先元素的尺寸影响，下推和收缩动画显然还不能达到我们期望的效果。

### 2.3 向两层parent DOM注入动画css
由2.2知，目前我们的动画css类只存在于内层iframe DOM中，那么就只有内层iframe DOM(即pushdownPic.html)中的元素可以使用这些动画。为了使得上层DOM中的元素都可以使用，需要向两层parent的DOM中注入css。

所以，pushdownPic.html的js还应包含向parent注入css的方法。Eg:

```
 injectCssToParents() {
   // 确保具有两层parent
    if(!(window.parent && window.parent.parent)){
      return;
    }

   // 获取两层parent的DOM中的head元素
    const innerIframeWindowHead = window.parent.document.getElementsByTagName("head")[0];
    const outerIframeWindowHead = window.parent.parent.document.getElementsByTagName("head")[0];
     
    // 创建包含所需动画css的style元素
    const switchStyle = document.createElement("style");
    switchStyle.innerHTML = ".pushdown-open{-webkit-animation:pushdownToOpen 1s linear;}@-webkit-keyframes pushdownToOpen{from{width:969px;height:90px}to{width:969px;height:400px}}...";
    const switchStyleCopy = switchStyle.cloneNode(true);

    // 向两层parent DOM 的head中添加该style元素，实现css注入
    innerIframeWindowHead.appendChild(switchStyle);
    outerIframeWindowHead.appendChild(switchStyleCopy);
  }

```

### 2.4 切换动作中对两层iframe的操作
对两层parent注入所需动画css之后，就可以在切换时添加对两层iframe的操作。

由于iframe元素的特殊性，其必须设置明确的width和height才能具有理想的尺寸，故切换时对其尺寸的操作和对banner及大图区域的操作一样具体。

例如在下推开始时需要执行以下代码：

```
   if(innerIframe && outerIframe) {
      innerIframe.style.height ="90px";
      outerIframe.style.height ="90px";
      innerIframe.classList.remove("pullup-close");
      innerIframe.classList.add("pushdown-open");
      outerIframe.classList.remove("pullup-close");
      outerIframe.classList.add("pushdown-open");
    }
```
在下推结束后需要执行：
```
    if(innerIframe && outerIframe) {
      innerIframe.style.height ="400px";
      outerIframe.style.height ="400px";
      innerIframe.classList.remove("pushdown-open");
      outerIframe.classList.remove("pushdown-open");
    }
```
（以上代码片中的innerIframe和outerIframe指内外两个iframe元素）

### 2.5 切换动作中对外层iframe的祖先元素的操作
仅仅处理了两层iframe是不够的，因为外层iframe还可能有若干层祖先元素，这些祖先元素的尺寸也会妨碍动画得到我们想要的效果。

幸运的是这些祖先元素（一般是若干层div)不需要像iframe那样设置明确尺寸。如果它们的高度为auto，那么就自动和其后代元素的高度一样了。

比较麻烦的是，我们常常无法得知媒体到底在外层iframe外面包围了多少层div。所以无论有多少层div，都得处理。Eg:

```
  //将外层iframe的所有层级祖先元素高度都设置为"auto"
    const contentDiv = this.outerIframe.parentNode;//外层iframe的父元素
    let ancestorDiv = contentDiv;
    const ancestorBody = window.parent.parent.document.body;
    while(ancestorDiv!=ancestorBody) {
      ancestorDiv.style.height = "auto";
      if(ancestorDiv.parentNode) {
         ancestorDiv = ancestorDiv.parentNode;
      }
    }
```
现在，再也没有元素可以限制下推\收缩动画了。我们想要的动画效果终于实现了！

### 2.6* 相关资源的自定义实现
到2.5为止，已经可以实现一个完整的下推扩展广告的效果。但如果每次都需要在pushdownPic.html中手动修改banner、大图以及其中的a链接地址等资源会非常繁琐。如果想要每次只修改1.3中script外链广告模板代码，那么这些资源可以在第一层iframe中以变量的形式设置。

外层iframe的script外链广告模板代码：
```
var bannerImg = 'xxx';//barnner图资源地址
var bigImg = 'xxx';//大图资源地址
document.write('<iframe src="' + pushdownPic.html + '"></iframe>');
```

在内层iframe引入的pushdownPic.html中执行以下js：
```
 dynamicGetHTMLData() {
    const pWin = window.parent;
    if(pWin && pWin.bannerImg && pWin.bigImg) {
      bigImgElem.href = pWin.bigImg;
      bannerImgElem.src = pWin.bannerImg;
    }
  }
```

## 3. 总结及完整参考代码
上面这种方式可以在不修改主站DOM结构的前提下实现下推扩展动画。其对于主站DOM的影响仅仅是样式层面的——注入了一些css, 以及修改了一些和广告位密切相关的div的高度。其他工作都在内层iframe中完成。

完整参考代码地址：

<https://github.com/FTChinese/ad-pushdownPic>

与之类似思想的还有banner下推拓展为视频的广告形式。完整参考代码地址：

<https://github.com/FTChinese/ad-pushdownVideo>

