<template lang="html">
  <div>
    <div class="row">
      <div class="col-9">
        <input type="text" style="margin:10px" autocomplete="off"  class="el-input__inner"
          v-model="text" :ref="`textinput`" >
      </div>
      <div class="col-3 d-flex justify-content-center " style="
        margin-top: 10px;
    "><button @click="send" style="
        height: 40px;
    " class="btn btn-light"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            fill="#01afb8" height="50px" width="50px" version="1.1" id="Layer_1" viewBox="0 0 512 512"
            xml:space="preserve" style="
        width: 100px;
        height: 25px;
    ">
            <g>
              <g>
                <path
                  d="M508.645,18.449c-2.929-2.704-7.133-3.51-10.826-2.085L6.715,204.446c-3.541,1.356-6.066,4.515-6.607,8.264    c-0.541,3.75,0.985,7.496,3.995,9.796l152.127,116.747c-0.004,0.116-0.575,0.224-0.575,0.342v83.592    c0,3.851,2.663,7.393,6.061,9.213c1.541,0.827,3.51,1.236,5.199,1.236c2.026,0,4.181-0.593,5.931-1.756l56.12-37.367    l130.369,99.669c1.848,1.413,4.099,2.149,6.365,2.149c1.087,0,2.186-0.169,3.248-0.516c3.27-1.066,5.811-3.672,6.786-6.974    L511.571,29.082C512.698,25.271,511.563,21.148,508.645,18.449z M170.506,321.508c-0.385,0.36-0.7,0.763-1.019,1.163    L31.659,217.272L456.525,54.557L170.506,321.508z M176.552,403.661v-48.454l33.852,25.887L176.552,403.661z M359.996,468.354    l-121.63-93.012c-1.263-1.77-2.975-3.029-4.883-3.733l-47.29-36.163L480.392,60.86L359.996,468.354z">
                </path> 
              </g>
            </g>
          </svg></button></div>
    </div>
    <div class="d-flex justify-content-center m-1" >
      <button class="btn btn-light m-1"  style="color:rgb(1, 175, 184)">新手專區</button>
      <button class="btn btn-light m-1" style="color:rgb(1, 175, 184)">常見問題</button>

    </div>

    <!-- <div>
        <a
            class="messagist__choices-list-item"
            :href="primaryKey"
            @click.prevent="selected"
          >
            {{ text }}
          </a>
      </div> -->

  </div>
</template>

<script>


export default {
  data() {
    return {
      text: ""
    }
  },
  name: 'Choice',

  props: {
    primaryKey: String,
    messagesId: Number
    // choice: [Object, String]
  },

  computed: {

    // isObject() {
    //   return typeof this.choice === 'object'
    // },

    // text() {
    //   return (this.isObject ? this.choice.text : this.choice)
    // }
  },
  mounted() {

    this.$refs[`textinput`].focus();
  },
  methods: {
    trigger(key) {
      this.$parent.awaitingUserInput = true
      this.$parent.$emit(key, (options) => { this.continue(options) })
    },

    continue(options) {
      // TODD: Extend options, currently it supports a string only
      this.$emit('selected', { key: this.primaryKey, custom: options })
    },

    send() {
      if(!this.text ) alert("請輸入文字")
      console.log("AA", this.text.match(/.{1,25}/g).reduce((a, c) => a + c + "\n", ""));
      this.$emit('selected', { custom: this.text.match(/.{1,30}/g).reduce((a, c) => a + (a == "" ? "" : "<br />") + c, ""), key: this.primaryKey })
    },
    focusInput() {
      // console.log("this.$refs.textinput", this.$refs[`textinput${this.messagesId}`])
      // this.$refs[`textinput${this.messagesId}`].focus();
    }
  }
}
</script>

<style lang="stylus">

  .messagist__choices-list-item
    margin-right 40px
    display block
    text-align right
    color #b3e6a6


    .el-input__inner 
      margin-left 100px
      -webkit-appearance none
      background-color #fff
      background-image none
      border-radius 4px
      border 1px solid #dcdfe6
      box-sizing border-box
      color #606266
      display inline-block
      font-size inherit
      height 40px
      line-height 40px
      outline none
      padding 0 15px
      transition border-color .2s cubic-bezier(.645,.045,.355,1)
      width 100%

    .el-button 
      display inline-block
      line-height 1
      white-space nowrap
      cursor pointer
      background #fff
      border 1px solid #dcdfe6
      color #606266
      -webkit-appearance none
      text-align center
      box-sizing border-box
      outline none
      margin 0
      transition .1s
      font-weight 500
      -moz-user-select none
      -webkit-user-select none
      -ms-user-select none
      padding 12px 20px
      font-size 14px
      border-radius 4px   
</style>
