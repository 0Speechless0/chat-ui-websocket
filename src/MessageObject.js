import uuidv4 from 'uuid/v4'
import dateFormat from "dateformat";
module.exports =  class MessageObject {
    // static setStoreAction(action)
    // {
    //   this.storeAction = action;
    // }
    constructor(text, author="system") {
      //訊息內容 對應 Message
      this.text = text
      //訊息來源 ， 對應Origin ， system : 0 ； user : 1
      this.author = author
      this.id = uuidv4()
      // 對應CreateTime
      this.createTime = this.convertToRocDate( dateFormat(new Date(), "yyyy/mm/dd HH:MM:ss") );


    }
    convertToRocDate(date)
    {
      var year = date.split("/")[0];
      return date.replace(year+ "/", year - 1911 + "/");
    }

    setDbItemData(item)
    {
      this.createTime = this.convertToRocDate(item.CreateTIme);
      this.Seq = item.Seq;
    }
    setStoreAction(action)
    {
      this.storeAction= action;
    }

}