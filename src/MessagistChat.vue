<template>
    <div>
        <div v-for="(messages, key) in QAItem">
          <MessagistWrapper :key="key" @done="chatDone(key)" :messages="messages" > </MessagistWrapper>
        </div>
    </div>

</template>
<script>
    var client = require("../client")
    const messageInit =  {
        id : 0,
        init: {
            content: [
            ],
            choices: {
                accept: ''
            }
        },
        accept: {
            content: ''
        }
    }
    import MessagistWrapper  from './MessagistWrapper.vue';
    export default {
        name : "MessagistChat",
        data(){
            return {
                QAItem : []
            }
        },
        props :{
            websocket_url : String
        },
        components : {
            MessagistWrapper :MessagistWrapper
        },
        methods: {
            chatDone(id)
            {
                messageInit.id = id;
                this.QAItem.push(Object.assign({}, messageInit ) )
            }
        },
        mounted() {
            console.log("MessagistChat, mounted")
            this.QAItem.push(Object.assign({}, messageInit ))
            new client().setWebSocketURL(this.websocket_url);

        },
    }

</script>