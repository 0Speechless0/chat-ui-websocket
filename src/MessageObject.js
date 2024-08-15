import uuidv4 from 'uuid/v4'
module.exports =  class MessageObject {
    // static setStoreAction(action)
    // {
    //   this.storeAction = action;
    // }
    constructor(text, author="system") {
      this.text = text
      this.author = author
      this.id = uuidv4()
    }
    
    setCreateTime(time)
    {
      this.createTime = time;
    }
    setStoreAction(action)
    {
      this.storeAction= action;
    }

}