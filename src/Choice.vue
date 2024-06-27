<template lang="html">
    <div>
      <div style="display: flex;" >
        <input type="text"   autocomplete="off" placeholder="請輸入內容，按enter發送" class="el-input__inner" v-model="text" :ref="`textinput`" @keyup.enter="send"> 
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
  data()
  {
    return {
      text : ""
    }
  },
  name: 'Choice',

  props: {
    primaryKey: String,
    messagesId : Number
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

    console.log("this.$refs.textinput", this.$refs[`textinput`])
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
      console.log("AA", this.text.match(/.{1,25}/g).reduce((a, c) => a+ c +"\n", ""));
      this.$emit('selected', { custom : this.text.match(/.{1,30}/g).reduce((a, c) => a+ (a =="" ? "" : "<br />") + c, ""), key : this.primaryKey })
    },
    focusInput()
    {
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
