<template>
  <div class="Messagist" >
    <transition-group
      name="messagist__list"
      tag="ul"
      v-if="done || claim"
      style="padding-bottom: 0px; padding: 10px"
      :class="dialogClass"
    >
      <message
        v-for="message in messagesToPrint"
        :key="message.id"
        :message="message"
        :class="'messagist__list-item '"
      />
    </transition-group>
    <div v-if="isNewDialog && done" class="d-flex">
      <div class="d-flex" v-if="suggestion != null">
        <span style="color: lightslategray">滿意度 : </span>
        <span class="p-1 ml-2 mr-2">
          <el-rate :max="5" v-model="agreeLevel" :texts="texts" show-text>
          </el-rate>
        </span>

      </div>
      <button @click="SuggestAgencyMessage" v-if="suggestion != null "
        class="btn btn-info mb-2"
        style="
          margin-top: auto;
          padding: 0px;
          width: 50px;
          height: 30px;
          font-size: 15px;
        "
      >
        送出
      </button>
      <button @click="() =>{suggestion = ''; $emit('scrollToBottom') }" v-else-if="!loading && done"
        class="btn btn-info mb-2 ml-2"
        style="
          margin-top: auto;
          padding: 0px;
          width: 50px;
          height: 30px;
          font-size: 15px;
        "
      >
        建議
      </button>
    </div>
    <div v-if="isNewDialog &&  suggestion != null " class="d-flex mb-2">
      <textarea class="form-control col-10 mt-2" v-model="suggestion" />

    </div>

    <div
      v-if="!claim"
      class="fixed-bottom"
      style="
        width: 500px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        background-color: white;
        margin-left: auto;
        margin-right: 10%;
      "
    >
      <Dot v-if="loading"> </Dot>

      <div v-else>
        <choice
          @onSend="$emit('scrollToBottom')"
          v-for="(value, key) in current.choices"
          :key="key"
          :primaryKey="key"
          :choice="value"
          @scrollToBottom="$emit('scrollToBottom')"
          @selected="selected"
          style="margin-right: 0px"
          class="messagist__choices-list-item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Message from "./Message.vue";
import Choice from "./Choice.vue";
import Dot from "./Dot.vue";
import { nextTick } from 'vue';
var MessageObject = require("./MessageObject");
var client = require("../client");

export default {
  name: "Messagist",

  props: {
    isNewDialog: Boolean,
    messages: Object,
    claim: Boolean,
    messagesToPrintOrg: Array,
  },

  components: {
    message: Message,
    choice: Choice,
    Dot: Dot,
  },
  emits: ["choices", "scrollToBottom"],
  data() {
    return {
      texts: ["很差", "差", "尚可", "好", "很好"],
      agreeLevel: 0,
      messagesToPrint: [],
      interval: {
        user: 800,
        system: 400,
      },
      printing: true,
      currentKey: "init",
      loading: false,
      awaitingUserInput: false,
      done: false,
      client: new client(),
      suggestMessageId: null,
      suggestion: null,
    };
  },
  
  computed: {
    dialogClass()
    {
      return ( this.suggestion == '' && this.isNewDialog  ) ? 'borderHighlight' : ''
    },
    current() {
      if (!this.messages[this.currentKey]) {
        console.warn(
          "[Messagist Warn]",
          `Key "${this.currentKey}" is not defined in your message definitions`
        );
        return {
          messages: [],
          choices: [],
        };
      }

      let contents = this.messages[this.currentKey].content;
      if (typeof contents == "string") contents = [contents];

      return {
        messages: contents,
        choices: this.messages[this.currentKey].choices,
        action: this.messages[this.currentKey].action,
      };
    },

    choicesVisible() {
      return (
        !this.printing && !this.loading && !this.awaitingUserInput && !this.done
      );
    },
  },

  methods: {
    SuggestAgencyMessage() {
      Vue.prototype.$API.SuggestAgencyMessage({
          Seq: this.suggestMessageId,
          AgreeLevel: this.agreeLevel,
          Suggestion: this.suggestion,
        });
      this.suggestion = null;
    },

    trigger(key) {
      this.awaitingUserInput = true;
      this.$emit(key, (options) => {
        this.continue(options);
      });
    },

    continue(options) {
      // TODD: Extend options, currently it supports a string only
      this.selected({ key: this.primaryKey, custom: options });
    },

    delayPrint() {
      setTimeout(() => {
        this.loading = false;
        this.printLoop();
        this.$emit("done");
      }, this.interval.user);
    },

    tryCallback() {
      if (typeof this.current.action != "function") return;
      const cb = this.current.action.bind(this);
      return cb();
    },

    printLoop() {
      this.printing = true;
      let messages = Array.from(this.current.messages);

      const loop = () => {
        if (messages.length == 0) {
          this.tryCallback();

          return (this.printing = false);
        }

        setTimeout(() => print(messages.shift()), this.interval.system);
      };

      const print = (m) => {
        if (m) {
          var AgencyMessageObject = new MessageObject(m);

          if (this.isNewDialog) {
            Vue.prototype.$API.StoreUserMessage(
              {
                Origin: 0,
                Text: m,
              },
              (resp) => {
                this.suggestMessageId = resp.data;
              }
            );
          }

          this.messagesToPrint.push(AgencyMessageObject);
        }

        this.$nextTick(loop);
      };

      print(messages.shift());
    },

    selected({ key, custom }) {


      const message = custom ? custom : this.current.choices[key];
      console.log("message", message);
      var ClientMessageObject = new MessageObject(message, "user");
      if (this.isNewDialog)
        Vue.prototype.$API.StoreUserMessage({
          Origin: 1,
          Text: message,
        });
      this.messagesToPrint.push(ClientMessageObject);

      this.currentKey = key;
      const setResponseMessage = (message) => {
        this.messages.accept.content = message.replaceAll("\n", "<br>");
        this.awaitingUserInput = false;
        this.done = true;
        this.delayPrint();
      };

      this.loading = true;
      nextTick(() => this.$emit('scrollToBottom'))
      if(Vue.prototype.$test )
      {
        setResponseMessage("測試..")
      }
      else{
        this.client.ws_send(message, setResponseMessage)
      }


    },
  },

  mounted() {
    if (this.messagesToPrintOrg) this.messagesToPrint = this.messagesToPrintOrg;

    console.log("isNewDialog", this.isNewDialog);
    this.printLoop();
  },
};
</script>

<style lang="stylus">
@import '../assets/styles/element-ui.css';
@import '../assets/styles/dot-loading.css';
.borderHighlight
  border #17a2b8 dotted 1px
.Messagist
  max-width 640px
  margin 0 auto

  ul
    padding 30px 40px

.messagist__list-item
  transition all 500ms

.messagist__list-item-loading
  text-align left
  margin-left 40p

.messagist__list-enter
  opacity 0
  transform translateY(30px)

.messagist__choices-item
  transition all 1s

.messagist__choice-list-enter,
.messagist__choice-list-leave-to
  opacity 0
  transform translateY(30px)



  .dot-stretching
    position relative
    width 10px
    height 10px
    border-radius 5px
    background-color #9880ff
    color #9880ff
    transform scale(1.25, 1.25)
    animation dot-stretching 2s infinite ease-in
</style>
