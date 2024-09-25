
## 需求
*    node : 8

## 安裝套件
```
npm i
```

### 組件屬性說明(MessagistComponent)

| 檔案| 說明 |
| ------| --------------------|
| websocket_url | websocket位址 |
| init_content | 使用者第一次使用時出現訊息 |

examples/simple.html 有範例

### 檔案功能說明

| 檔案| 說明 |
| ------| --------------------|
| Message | 訊息框組件 |
| Choice | 訊息發送框組件 |
| MessageObject | 訊息物件，內含API回傳的轉換 |
| MessagistChat | 主檔，列舉多個 MessagistChat組件 |
| MessagistWrapper | 訊息問答組組件 |
|Dot |    載入圖樣組件|
### 資料串接實作
#### 依功能條列以下並說明
1. `GetUserMessagesNewToOld`　(　skip, count, result　) : 單前端需要取得訊息資料由新到舊時執行，其中 :
   * result :  前端處理function， 接收列舉物件，在實作中執行 result(resp)，resp 帶表列舉物件 ，物件欄位如下
     
     
        回傳 resp 格式如下
     
       ```json
         {
         list :[
            {
                "Seq" :  訊息ID
                "Origin" :  訊息來源(0: 客服 , 1: 使用者)
                "Text" :    訊息
                "CreateTIme" :  建立時間
                "UserMainSeq" : 使用者識別碼
                "AgreeLevel" :  滿意度 5-1 好-不好
                "Suggestion" :  給予回饋
            },
            ...
        
        
            ]
        }
       ```

   * skip : 跳過訊息數
   * count : 取得訊息數
1. `StoreUserMessage` (data, result) : 當前端需要儲存發送訊息
   
   *  data : 乃上述物件格式
   *  result : 方法同上述執行result(resp)，resp 是 新增訊息的識別碼(ID)
4. `SuggestAgencyMessage` (data) : 當前端需要儲存訊息儲存的建議
   
   *  data : 乃上述物件格式


### 測試

* `npm run build` 會編譯至 dist ， 裡面的檔案可在 examples/simple.html 中看見引入 `<script src="../dist/messagist.js"></script>`，所有測試所需的引入都在這裡， 包括elementUI、boostrap、websocket等...

* `npm run dev` 會開啟測試視窗，點選 `Simple Example` ，修改vue檔儲存會立即更新，不需`npm run build`重新編譯，

### css設定

1.    需要elementUI， https://element.eleme.io/#/zh-CN/component/installation
2.    圖片引入需要轉成base64，作法詳情參考 assets 的檔案及vue檔中 sass的用法
  

### 發佈組件

https://pjchender.dev/devops/devops-publish-npm-2/

```
npm publish
```

您可能需要修改 package.json 的version ， 要與上一次發佈不同

### 其他專案安裝發佈後的組件

```cmd
npm i chat-ui-websocket

```



### 引入(編譯發佈後其他專案)


main.js :
```js
import Messagist from 'chat-ui-websocket'

Vue.prototype.$websocket_url = "你的 websocket 位置"

Vue.component('MessagistComponent', Messagist)
```
你需要賦值給 `$websocket_url`  webosocket 的 位址

專案底下任一vue檔 :
```html
<template>

    <MessagistComponent :websocket_url="$websocket_url">

    </MessagistComponent>
</template>
```


