

## Getting Started


### 引入


main.js :
```js
import Messagist from 'chat-ui-websocket'

Vue.prototype.$websocket_url = "你的 websocket 位置"

Vue.component('MessagistComponent', Messagist)
```
你需要賦值給 `$websocket_url`  webosocket 的 位址

你的vue檔 :
```html
<template>
  <div id="app">
    <MessagistComponent :websocket_url="$websocket_url">

    </MessagistComponent>
  </div>
</template>
```

### 安裝套件
```cmd
npm i chat-ui-websocket

```

### 資料串接實作
#### 依功能條列以下並說明
1. `GetUserMessagesNewToOld`　(　skip, count, result　) : 單前端需要取得訊息資料由新到舊時執行，其中 :
   * result :  前端處理function， 接收列舉物件，在實作中執行 result(resp)，resp 帶表列舉物件 ，物件欄位如下
     

        | 欄位 | 說明 |
        | ------| --------------------|
        | Seq | 訊息ID |
        | Origin | 訊息來源(0: 客服 , 1: 使用者) |
        | Text | 訊息 |
        | CreateTIme | 建立時間 |
        | UserMainSeq | 使用者識別碼 |
        | AgreeLevel | 滿意度 5-1 好-不好 |
        | Suggestion | 給予回饋 |

   * skip : 跳過訊息數
   * count : 取得訊息數
2. `StoreUserMessage` (data, result) : 當前端需要儲存發送訊息
   
   *  data : 乃上述物件格式
   *  result : 方法同上述執行result(resp)，resp 是 新增訊息的識別碼(ID)
4. `SuggestAgencyMessage` (data) : 當前端需要儲存訊息儲存的建議
   
   *  data : 乃上述物件格式



