class Adimg {
  constructor(root, mode) {
    /**
     * @param root: TYPE Object. The root div of a Ad Banner Pic, concluding all components of it.
     */
    if(root instanceof HTMLElement) {
      this.root = root;
    } else {
      this.root = document.getElementById(root);
      console.log(this.root);
    }

    if(mode !== "prod") {
      mode = "dev";
    }
    
    if(this.root.querySelector("#openBtn") instanceof HTMLElement) {
      this.open = this.root.querySelector("#openBtn");
    }
    if(this.root.querySelector("#bannerImg") instanceof HTMLElement) {
      this.img = this.root.querySelector("#bannerImg");
    }

    if(this.root.querySelector("#bannerA") instanceof HTMLElement) {
      this.a = this.root.querySelector("#bannerA");
    }
    if(mode === "prod") {
      this.dynamicGetHTMLData();
    }
  }

  dynamicGetHTMLData() {
    if(window.parent && window.parent.detailPage && window.parent.bannerImg && this.img && this.a) {
      this.a.href = window.parent.detailPage;
      this.img.src = window.parent.bannerImg;
    }
  }
}

export default Adimg;