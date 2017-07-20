
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