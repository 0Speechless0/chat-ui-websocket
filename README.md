

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



