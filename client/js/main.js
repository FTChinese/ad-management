import Adimg from "./src/img.js";
import Advideo from "./src/video.js";
import Switch from "./src/switch.js";

const mode = "prod";

const imgObj = new Adimg("imgSection", mode);
const videoObj = new Advideo("videoSection", mode);

new Switch(imgObj, videoObj, mode);