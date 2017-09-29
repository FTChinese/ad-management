 function popWin() {
  const popWinElem = document.getElementById("popWin");
  const popWinIframe = popWinElem.querySelector("iframe");

  document.addEventListener("click", (e)=> {
    console.log(e.target);
    if(e.target.tagName !== "TD") {
      popWinElem.style.display = "none";
      return;
    }
    const adid = e.target.innerHTML;
    if(adid.length !== 12) {
      return;
    } 
    const iframeSrc = 'a.html?v=20161009143608' + '#adid='+ adid + '&pid=' + adid;
    const iframeWidth = e.target.getAttribute("data-patternInfo-width");
    const iframeHeight = e.target.getAttribute("data-patternInfo-height");
    
    popWinIframe.setAttribute("src", iframeSrc);
    popWinIframe.setAttribute("width",iframeWidth);
    popWinIframe.setAttribute("height",iframeHeight);
    popWinElem.style.display = "block";
    
    
  },false);
}

export default popWin;

