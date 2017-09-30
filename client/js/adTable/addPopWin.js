class AddPopWin {
  constructor(rootElem,popWinElem){
    /**
    * @param rootElem:TYPE Document | HTMLElement |String——ID of an elem
    * @param popWinElem: Type HTMLElement | String——ID of an elem
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

    //this.didSelectTd = this.rootElem.querySelector(".selected");
    this.popWinIframe = this.popWinElem.querySelector("iframe");
    this.popWinMark = this.popWinElem.querySelector(".mark");

    this.updateRelatedTds.bind(this);
    this.popWin.bind(this);
    
    document.addEventListener("click", (event) => {
      this.updateRelatedTds(event);
      this.popWin();
    },false);

    document.addEventListener("keydown",(event) => {
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
    this.popWinElem.style.display = "none";
    if(!this.willSelectTd) {
      return;
    }

    const adid = this.willSelectTd.innerHTML;
    if(adid.length !== 12) {
      return;
    } 
    this.popWinMark.innerHTML = adid;
    const iframeSrc = 'marketing/a.html?v=20161009143608' + '#adid='+ adid + '&pid=' + adid;
    const iframeWidth = this.willSelectTd.getAttribute("data-patternInfo-width");
    const iframeHeight = this.willSelectTd.getAttribute("data-patternInfo-height");
    
    this.popWinIframe.setAttribute("src", iframeSrc);
    this.popWinIframe.setAttribute("width",iframeWidth);
    this.popWinIframe.setAttribute("height",iframeHeight);
    this.popWinElem.style.display = "block";

  }

  static init() {
    new AddPopWin(document, "popWin")
  }


}

export default AddPopWin;

