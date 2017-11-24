class AddPopWin {
  constructor(rootElem,popWinElem){
    /**
    * @param rootElem:TYPE Document | HTMLElement |String——ID of an elem, Here is the Document
    * @param popWinElem: Type HTMLElement | String——ID of an elem, the popWin Element or it's id. Here is the div whose id is "popWin"
    */
    if(rootElem instanceof HTMLElement || rootElem instanceof Document) {
      this.rootElem = rootElem;
    } else {
      this.rootElem = document.getElementById(rootElem);
    }

    if(!(popWinElem instanceof HTMLElement)) {
      this.popWinElem = document.getElementById(popWinElem);
    } else {
      this.popWinElem = popWinElem;
    }

    this.popWinMark = this.popWinElem.querySelector(".mark");//MARK:装载ad号的p元素
    this.iframePart = this.popWinElem.querySelector(".iframePart")
    this.updateRelatedTds.bind(this);
    this.popWin.bind(this);
    
    this.rootElem.addEventListener("click", (event) => { //MARK:将td上的click事件委托给rootElem(即document)来监听
      this.updateRelatedTds(event);
      this.popWin();
    },false);

    this.rootElem.addEventListener("keydown",(event) => { //MAKR:将td上的keydown事件委托给rootElem(即document)类监听
      this.updateRelatedTds(event);
      this.popWin();
    }, false);
  }

  updateRelatedTds(e) {
    //console.log(`rootElem:${this.rootElem}`);
    this.didSelectTd = this.rootElem.querySelector(".selected");//可能为null
    if(this.didSelectTd) {
      console.log(`didSelectTd:${this.didSelectTd.innerHTML}`);
      this.didSelectTd.classList.remove("selected");

    }

    
    
    if (e.type === "click") {
      //MARK:处理click事件

      if(e.target.tagName !== "TD") {  //MAKR: this.willSelectTd只可能是td元素或者null    
        this.willSelectTd = null;
        return;
      }
      this.willSelectTd = e.target;


    } else if(e.type === "keydown" && this.didSelectTd) {
      //MARK:处理keydown事件
      const didSelectIndexCell = this.didSelectTd.cellIndex;//横向tr中的第几个单元格，从0开始
      const didSelectTr = this.didSelectTd.parentNode;//纵向第几个tr，从0开始 //NOTE:此处parentElement、parentNode都可以
      const didSelectIndexRow = didSelectTr.rowIndex;
      console.log(didSelectIndexCell);
      console.log(didSelectIndexRow);
      console.log(e.keyCode);
      if(e.keyCode === 39) {//MARK:如果是右箭头
        //if(this.didSelectTd) {
          console.log(this.didSelectTd);
          const nextElem = this.didSelectTd.nextElementSibling;
          console.log(nextElem);
          if(nextElem && nextElem.tagName === "TD") {
            console.log("here");
            this.willSelectTd = nextElem;

            const widthOfDidSelectTd = this.didSelectTd.offsetWidth;
            console.log(`widthOfDidSelectTd:${widthOfDidSelectTd}`);
            console.log(`typeOfWidthOfDidSelectTd:${typeof widthOfDidSelectTd}`);
            window.scrollBy(widthOfDidSelectTd,0);// TODO: Find Why this is not working
          }
       // }
      } else if(e.keyCode === 37) {

        //if(this.didSelectTd) {
          console.log(this.didSelectTd);
         
          const prevElem = this.didSelectTd.previousElementSibling;
          console.log(prevElem);
          if(prevElem && prevElem.tagName === "TD") {
            this.willSelectTd = prevElem;
             const widthOfDidSelectTd = this.didSelectTd.offsetWidth;
             window.scrollBy(-widthOfDidSelectTd,0);
          }
        //}
      } else if(e.keyCode === 40) {//向下箭头
        const nextParentElem = didSelectTr.nextElementSibling;
        console.log(nextParentElem);
        if(nextParentElem && nextParentElem.tagName === "TR") {
          const nextElem = nextParentElem.children[didSelectIndexCell];
          console.log(nextElem);
          if(nextElem && nextElem.tagName === "TD") {
            this.willSelectTd = nextElem;
          }
        }
      } else if(e.keyCode === 38) {//上箭头
        const prevParentElem = didSelectTr.previousElementSibling;
        if(prevParentElem && prevParentElem.tagName === "TR") {
          const prevElem = prevParentElem.children[didSelectIndexCell];
          if(prevElem && prevElem.tagName === "TD") {
            this.willSelectTd = prevElem;
          }
        }
      }
    }
    
    console.log(`willSelectTd:${this.willSelectTd.innerHTML}`);
    if(this.willSelectTd) {
      this.willSelectTd.classList.add("selected");
    }
  }


  popWin() {
    //MAKR：如果id为"popIframe"的iframe元素已经存在，则移除它，并将整个popWin Element隐藏。
    /*
    const iframeElemHere = this.popWinElem.querySelector("iframe");
    if(iframeElemHere instanceof HTMLElement) { 
      this.popWinElem.removeChild(iframeElemHere);
    }
    */
    this.iframePart.innerHTML = "";
    this.popWinElem.style.display = "none";

    //MARK:如果此时没有即将被选中的td(即this.willSelectTd为null),则直接return 
    if(!this.willSelectTd) {
      return;
    }

    //MARK: 获取ad的12位adid号，即为即将选中的td的innerHTML,并将其做为popWin的p class="mark"元素的内容
    const adid = this.willSelectTd.innerHTML;
    if(adid.length !== 12) {
      return;
    } 
    this.popWinMark.innerHTML = adid;


    const iframeSrc = 'm/marketing/a.html?v=20161009143608' + '#adid='+ adid + '&pid=' + adid;
    const iframeWidth = this.willSelectTd.getAttribute("data-patternInfo-width");
    const iframeHeight = this.willSelectTd.getAttribute("data-patternInfo-height");
    const containerType = this.willSelectTd.getAttribute("data-patternInfo-container");
    //const iframeElem = '<iframe id="popIframe" frameborder="0" scrolling="no" marginwidth="0" marginheight="0"><\/iframe>';

    /*
    const iframeElem = document.createElement("iframe");
    iframeElem.setAttribute("id", "ad-"+adid);
    iframeElem.setAttribute("src", iframeSrc);
    iframeElem.setAttribute("width",iframeWidth);
    iframeElem.setAttribute("height",iframeHeight);
    iframeElem.setAttribute("class","popIframe");
    */
    //this.popWinElem.appendChild(iframeElem);
    var iframeHTML = '<iframe class="banner-iframe" id="ad-' + adid + '" width="'+ iframeWidth +'" height="'+ iframeHeight + '" frameborder="0" scrolling="no" marginwidth="0" marginheight="0" src="'+ iframeSrc +'" data-src="'+ iframeSrc +'"></iframe>';
    if (containerType === 'banner') {
      iframeHTML = '<div class="bn-ph"><div class="banner-container"><div class="banner-inner"><div class="banner-content">' + iframeHTML + '</div></div></div></div>';
    } else if (containerType === 'mpu') {
      iframeHTML = '<div class="mpu-container">' + iframeHTML + '</div>';
    } else if (containerType === 'mpuInStroy') {
      iframeHTML = '<div class="mpu-container-instory">' + iframeHTML + '</div>';
    }

    this.iframePart.innerHTML = iframeHTML;
    this.popWinElem.style.display = "block";
    this.popWinElem.style.height = "300px";
   // this.popWinIframe.location.reload();
    //this.popWinIframe.src = this.popWinIframe.src;

    ///MARK:貌似只有这样动态处理iframe才能让它自动刷新
   
  }

  static init() {
    new AddPopWin(document, "popWin")
  }


}

export default AddPopWin;

