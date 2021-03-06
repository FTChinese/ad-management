import adDevices from "./adData/adDevice.js";


class AdTable {
  constructor(table, device) {
    /**
     * @param table: type String, the id of the table element
     * @param device: Type String, one of the key of the adDevices Obj
     */

    if(!(table instanceof HTMLElement)) {
      this.table = document.getElementById(table);
    } else {
      this.table = table;
    }
    if (!this.table) {
      return;
    }

    if(adDevices[device]) {
       this.deviceKey = device;
       this.device = adDevices[device];
    } else {
       return;
    }

    
    
    this.captionElem = document.createElement("caption");
    this.theadElem = document.createElement("thead");
    this.tbodyElem = document.createElement("tbody");

    if(this.device.id && this.device.id !== "" && this.device.patterns && this.device.channels) {

      this.deviceId = this.device.id;
      if(this.device.description) {
        this.deviceDescription = this.device.description
      } else {
        this.deviceDescription = "";
      }

      this.captionElem.innerHTML = `${this.deviceKey}:${this.device.id}`;

      this.patternArr = this.buildPatternArr(this.device.patterns);
      this.addTheadTr(this.theadElem, this.patternArr, "name");
      this.addTheadTr(this.theadElem, this.patternArr, "id");

      this.channelArr = this.buildChannelArr(this.device.channels);
      this.addTbodyTrs(this.tbodyElem, this.channelArr, this.patternArr);
    } 

    this.table.appendChild(this.captionElem);
    this.table.appendChild(this.theadElem);
    this.table.appendChild(this.tbodyElem);
  }

  buildPatternArr(patternObj) {
    const itemArr = [];
   
    for (const patternKey in patternObj) {
      const onePatternObj = patternObj[patternKey];
      
      if (onePatternObj.position && onePatternObj.id && onePatternObj.id !== "") {
        const onePatternId = onePatternObj.id;
        const onePatternWidth = onePatternObj.width?onePatternObj.width:'100%';
        const onePatternHeight = onePatternObj.height?onePatternObj.height:'50';
        const onePatternContainer = onePatternObj.container?onePatternObj.container:'';

        const onePatternPositionObj = onePatternObj.position;
        for (const positionKey in onePatternPositionObj) {
          const onePositionObj = onePatternPositionObj[positionKey];

          if(onePositionObj.id && onePositionObj.id !== "") {
            const oneItem = {
              name:`${patternKey}-${positionKey}`,
              id:`${onePatternId}${onePositionObj.id}`,
              width:onePatternWidth,
              height:onePatternHeight,
              container:onePatternContainer
            };
            itemArr.push(oneItem);
          }
          
        }
      } 
    }

    itemArr.sort((a, b) => {
      if(a.id < b.id) {
        return -1;
      } else {
        return 1;
      }
    });
    console.log(itemArr);

    return itemArr;
  }

  buildChannelArr(channelObj) {
    const itemArr = [];
   
    for (const channelKey in channelObj) {
      const oneChannelObj = channelObj[channelKey];
      if (oneChannelObj.sub && oneChannelObj.id && oneChannelObj.id !== "") {
        const oneChannelId = oneChannelObj.id
        const oneChannelTitle = oneChannelObj.title
        const oneChannelSubObj = oneChannelObj.sub;

        for (const subKey in oneChannelSubObj) {
          const oneSubObj = oneChannelSubObj[subKey];

          if(oneSubObj.id && oneSubObj.id !== "" && oneSubObj.title && oneSubObj.title !== "") {
            const oneItem = {
              name:`${channelKey}-${subKey}`,
              title:`${oneChannelTitle}-${oneSubObj.title}`,
              id:`${oneChannelId}${oneSubObj.id}`
            };
            itemArr.push(oneItem);
          }
          
        }
      } 
    }

    itemArr.sort((a, b) => {
      if(a.id < b.id) {
        return -1;
      } else {
        return 1;
      }
    });
    console.log(itemArr);

    return itemArr;
  }

  addTheadTr(tableElem, patternArr, prop) {
    const trElem = document.createElement("tr");

    //MARK:thead中的tr的前两个td为空
    const nullThElem0 = document.createElement("th");
    trElem.appendChild(nullThElem0);
    const nullThElem1 = nullThElem0.cloneNode(true);
    trElem.appendChild(nullThElem1);
    const nullThElem2 = nullThElem0.cloneNode(true);
    trElem.appendChild(nullThElem2);

    for(const item of patternArr) {
      const thElem = document.createElement("th");
      if(item[prop]) {
        thElem.innerHTML = item[prop];
      }
      trElem.appendChild(thElem); 
    }

    tableElem.appendChild(trElem);
  }

  addTbodyTrs(tableElem, channelArr, patternArr) {
    
    for(const item of channelArr) {

      const trElem = document.createElement("tr");

      if(item.name && item.name !== "" && item.id && item.id !== "") {
        const thElem0 = document.createElement("th");
        thElem0.innerHTML = item.name;
        trElem.appendChild(thElem0); 
        
        const thElem1 = document.createElement("th");
        thElem1.innerHTML = item.title;
        trElem.appendChild(thElem1);
        
        const thElem2 = document.createElement("th");
        const channelId = item.id;
        thElem2.innerHTML = channelId;
        trElem.appendChild(thElem2);
      
      
        for(const patternItem of patternArr) {
          const tdElem = document.createElement("td");
          
          if(patternItem.id) {
            const codeId = `${this.deviceId}${channelId}${patternItem.id}`;
            tdElem.innerHTML = codeId;
            tdElem.setAttribute("data-patternInfo-width", patternItem.width);
            tdElem.setAttribute("data-patternInfo-height", patternItem.height);
            tdElem.setAttribute("data-patternInfo-container", patternItem.container);
            //tdElem.addEventListener('click', this.popWinOfIframe(event), false);
          }
          trElem.appendChild(tdElem); 
        }

      }

      tableElem.appendChild(trElem);
    }
  
  }

 
  static init() {
    new AdTable("pc","PC");
    new AdTable("iPhoneApp","iPhoneApp");
    new AdTable("iPhoneWeb","iPhoneWeb");
    new AdTable("androidApp","AndroidApp");
    new AdTable("androidWeb","AndroidWeb");
    new AdTable("padApp","PadApp");
    new AdTable("padWeb","PadWeb");
  }
}

export default AdTable;