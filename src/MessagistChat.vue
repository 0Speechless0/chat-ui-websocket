<template>
    <div>

        <div class="modal-content fixed-bottom" style="width:800px;height:70%;    margin-left: auto; margin-right: 10%;">
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
            <div class="modal-body" style="overflow: auto;">
                <div>
                    <MessagistWrapper :claim="true" :messages="claim"> </MessagistWrapper>
                    <!-- <MessagistWrapper :messagesToPrintOrg="messagesToPrint" :claim="true" :messages="{}" v-for="(messagesToPrint, key) in messagesToPrintList"> </MessagistWrapper> -->
                </div>
                <div v-for="(messages, key) in QAItem">
                    <MessagistWrapper :key="key" @done="chatDone(key)" :messages="messages"> </MessagistWrapper>
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
    props: {
        websocket_url: String,
    },
    components: {
        MessagistWrapper: MessagistWrapper
    },
    methods: {
        chatDone(id) {
            messageInit.id = id;
            this.QAItem.push(Object.assign({}, messageInit))
        }
    },
    mounted() {
        console.log("MessagistChat, mounted")
        Vue.prototype.$width = this.width
        this.QAItem.push(Object.assign({}, messageInit))
        let messagesToPrint = []
        messagesToPrint.push(new MessageObject("A"))
        messagesToPrint.push(new MessageObject( "B" ,'user'))
        this.messagesToPrintList.push(messagesToPrint)
        new client().setWebSocketURL(this.websocket_url);

    },
}

</script>