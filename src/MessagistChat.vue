<template>
    <div>

        <div class="modal-content fixed-bottom" style="width:500px;height:70%;  margin-left: auto; margin-right: 10%;">
            <div class="modal-header text-center" style="
            background-color: #01afb8;
            color: white;
        ">
                <h5 id="staticBackdropLiveLabel" class="modal-title w-100" style="
            text-align: center;
        ">工程數位轉型智能客服</h5>

                <button @click="$emit('cancel')" type="button" data-dismiss="modal" aria-label="Close" class="close"><span
                        aria-hidden="true">×</span></button>
            </div>
            <div class="modal-body" style="overflow: auto;  margin-bottom:100px; " ref="modalBody" id="content">
                <div>
                    <!-- <MessagistWrapper :claim="true" :messages="claim" v-if="messagesToPrintList.length == 0" :key="1">  </MessagistWrapper> -->
                    <MessagistWrapper :messagesToPrintOrg="messagesToPrint" :claim="true" :messages="{}" v-for="(messagesToPrint, key) in messagesToPrintList" > </MessagistWrapper>
                </div>
                <div v-for="(messages, key) in QAItem">
                    <MessagistWrapper :key="key" @done="chatDone(key)" :messages="messages" :isNewDialog="true"> </MessagistWrapper>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
var client = require("../client")
const messageInit = {
    id: 0,
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
import MessagistWrapper from './MessagistWrapper.vue';
import { nextTick } from 'vue';
var  MessageObject = require("./MessageObject");
export default {
    name: "MessagistChat",
    emits : ["cancel"],
    data() {
        return {
            visiable :true,
            messagesToPrintList : [],
            QAItem: [],
            claim : {
                id: 0,
                init: {
                    content: [
                        `為保護您的權益，請詳細閱讀「 隱私權及個人資料保護政策 」，如您已充分瞭解並同意，請繼續進行對談服務。
                        <br><br>
                        點選 隱私權及個人資料保護政策如附件pdf`
                    ],
                    choices: {
                        accept: ''
                    }
                },
                accept: {
                    content: ''
                }
            }
        }
    },
    watch :
    {
        QAItem :
        {
            handler(){
                this.scrollToBottom()
            },
            flush : "post"
       
       
        },
        messagesToPrintList :
        {
            handler(v){
                this.scrollToBottom()
            },
            flush : "post"
       
        },
    },
    props: {
        websocket_url: String,
        api_action : Object,
        init_content : String
    },
    components: {
        MessagistWrapper: MessagistWrapper
    },
    methods: {
        scrollToBottom() {

            console.dir(this.$refs.modalBody )
            console.log()
            nextTick(() =>  this.$refs.modalBody.scrollTop = this.$refs.modalBody.scrollHeight)
            console.log("fsdfsdf", this.$refs.modalBody , this.$refs.modalBody.scrollHeight);
        },
        chatDone(id) {
            messageInit.id = id;
            this.QAItem.push(Object.assign({}, messageInit))
        }
    },
    created()
    {
        Vue.prototype.$API  = this.api_action
        console.log("Vue.prototype.$API" ,  this.api_action)
    },
    mounted() {
        console.log("MessagistChat, mounted")
        Vue.prototype.$width = this.width
        this.claim.init.content[0] = this.init_content ; 
        console.log("initContent", this.claim.init.content[0]);
        this.QAItem.push(Object.assign({}, messageInit))
        let messagesToPrint = []
        Vue.prototype.$API.GetUserMessages(
            (resp ) => {
                resp.data.forEach((message) => {

                    var obj = new MessageObject(message.Text, message.Origin == 0 ? 'system' : 'user' );
                    obj.setCreateTime(message.CreateTIme)
                    messagesToPrint.push(obj);
                })
                if(resp.data.length == 0 )
                {
                    messagesToPrint.push( new MessageObject(this.claim.init.content[0]));
                }
            }
        )

        this.messagesToPrintList.push(messagesToPrint)
        new client().setWebSocketURL(this.websocket_url);

    },
}

</script>