<template>
    <div>
        <div v-for="(messages, key) in QAItem">
          <MessagistWrapper :key="key" @done="chatDone(key)" :messages="messages" > </MessagistWrapper>
        </div>
    </div>

</template>
<script>
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

        },
    }

</script>