<template>
    <div>

        <div class="modal-content fixed-bottom" style="width:500px;height:800px;  margin-left: auto; margin-right: 10%;">
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
                    <MessagistWrapper :messagesToPrintOrg="messagesToPrint" :claim="true" :messages="{}" v-for="(messagesToPrint, key) in messagesToPrintList" :key="key"> </MessagistWrapper>
                </div>
                <div v-for="(messages, key) in QAItem">
                    <MessagistWrapper 
                    @scrollToBottom="scrollToBottom"
                    :key="key" @done="chatDone(key)" :messages="messages" 
                    :isNewDialog="messages.isNewDialog != null ? messages.isNewDialog : true"> </MessagistWrapper>
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
            messageSkip : 0,
            messageCountOneTime : 20,
            visiable :true,
            nextMessage : false,
            totalMessageCount : 0,
            messagesToPrintList : [],
            wheelCtl : {
                lock : false,
                time : 1000
            },
            QAItem: [],
            claim : {
                id: 0,
                init: {
                    content: [
                        `為保護您的權益，請詳細閱讀「 隱私權及個人資料保護政策 」，如您已充分瞭解並同意，請繼續進行對談服務。
                        <br><br>
                        點選 <a href="#"> 隱私權及個人資料保護政策如附件pdf </a>`
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
       
       
        }
        // ,        
        // messagesToPrintList:
        // {
        //     handler(){
        //         if(this.nextMessage)
        //             this.scrollToTop()
        //         else
        //             this.scrollToBottom()
        //     },
        //     flush : "post"
       
       
        // }

    },
    props: {
        websocket_url: String,
        api_action : Object,
        init_content : String,
        test : Boolean,
    },
    components: {
        MessagistWrapper: MessagistWrapper
    },
    methods: {
        GetUserMessages() 
        {
            let messagesToPrint = [];
            if(this.totalMessageCount < this.messageSkip ) return 
            if(this.nextMessage) 
                this.messageSkip += this.messageCountOneTime;
            Vue.prototype.$API.GetUserMessagesNewToOld(this.messageSkip, this.messageCountOneTime,
            (resp ) => {
                resp.data.list.reverse();
                this.totalMessageCount = resp.data.count;
                resp.data.list.forEach((message) => {

                    var obj = new MessageObject(message.Text, message.Origin == 0 ? 'system' : 'user' );
                    obj.setDbItemData(message)
                    messagesToPrint.push(obj);
                })


                if(!this.nextMessage)
                {
                    if(resp.data.count == 0 )
                    {
                        messagesToPrint.push( new MessageObject(this.claim.init.content[0]));
                    }
                    this.messagesToPrintList.push(messagesToPrint)
                    this.scrollToBottom()


                }
                else if(resp.data.list.length > 0)
                {
                    var currentMessages = [messagesToPrint].concat(this.messagesToPrintList );
                    this.messagesToPrintList = [];
                    setTimeout(() => {
                        nextTick(() => {
                            this.messagesToPrintList = currentMessages
                            console.log("currentMessages", this.messagesToPrintList)
                            this.scrollToTop()
    


                        })
                    }, 200);


                }
            }
            
        )

        },
        scrollToBottom() {
            nextTick(() => { 
                this.$refs.modalBody.scrollTop = this.$refs.modalBody.scrollHeight
                this.currentScrollTop = this.$refs.modalBody.scrollTop
            });
        },
        scrollToTop() {

            nextTick(() => { 
                this.$refs.modalBody.scrollTop = 0
            });
        },
        chatDone(id) {
            this.QAItem.forEach(e => e)
            messageInit.id = id;
            if(this.QAItem.length > 1)
                this.QAItem[this.QAItem.length -2 ].isNewDialog = false;
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
        Vue.prototype.$test = this.test;
        this.claim.init.content[0] = this.init_content ; 
        console.log("initContent", this.claim.init.content[0]);
        this.QAItem.push(Object.assign({}, messageInit))
        this.GetUserMessages();
        setTimeout(() => {
            this.$refs.modalBody.addEventListener("wheel", event => {
            console.log("fff", this.$refs.modalBody.scrollTop)
            if(this.$refs.modalBody.scrollTop == 0 && !this.wheelCtl.lock )
            {
                this.wheelCtl.lock = true;
                setTimeout(() => this.wheelCtl.lock = false, this.wheelCtl.time);
                this.nextMessage = true;
                this.GetUserMessages()
            }
            else{
                this.nextMessage = false;
            }
        });
        }, 1000)


        new client().setWebSocketURL(this.websocket_url);

    },
}

</script>