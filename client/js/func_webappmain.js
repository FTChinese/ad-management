/**
 * Copy from E:\FT\NEXT\app\scripts\main.js
 */
function findTop(obj) {
  var curtop = 0;
  if (obj && obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
    } while ((obj = obj.offsetParent));
    return curtop;
  }
}


/**
 * Modify from the E:\FT\webapp\app\scripts\main.js 
 * Simplify the function closeOverlay()
 */
function closeOverlay() {
  const overlayElems = document.querySelectorAll(".overlay");
  for(const elem of overlayElems) {
    elem.classList.remove("on");
  }
  const openButtons = document.querySelectorAll("button.open");
  for(const elem of openButtons) {
    elem.classList.remove("open");
  }

}

export {findTop,closeOverlay};