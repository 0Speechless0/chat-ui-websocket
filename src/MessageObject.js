import uuidv4 from 'uuid/v4'

module.exports =  class MessageObject {
    constructor(text, author="system") {
      this.text = text
      this.author = author
      this.id = uuidv4()
    }
}