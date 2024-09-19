<template lang="html">

  <!-- <li :class="cssClass" v-if="!isHTML(message.text)"> -->
    <li :class="cssClass" >
      <!-- <img src="../assets/image/user.jpg"/>  -->
      <img  class="agencyImage" width="40"  height ="50" style="margin-top: auto;" v-if="message.author == 'system'"/>
      <!-- <img  class="userImage" width="40"  height ="40" style="margin-top: auto;" v-else/> -->
      <span v-html="message.text" />
      <div style="color:#b4b1b1; margin-top: auto; font-size: 12px; padding: 5px; max-width: 84px" v-if="message.createTime" >{{ message.createTime }} </div>
      
    </li>
    
  <!-- <div v-else v-html="message.text">

  </div> -->
</template>


<script>
export default {
  name: 'Message',

  props: {
    message: Object
  },
  methods: {

    isHTML(str) {
      var a = document.createElement('div');
      a.innerHTML = str;

      for (var c = a.childNodes, i = c.length; i--;) {
        if(c[i].nodeName =='BR') continue
        if (c[i].nodeType == 1) return true;
      }

      return false;
    }
  },
  computed: {
    cssClass() {
      if(this.message.author == "system")
        return `messagist__list-item-${this.message.author} d-flex`
      else
        return `messagist__list-item-${this.message.author} d-flex flex-row-reverse`
    }
  },
  mounted()
  {

    console.log("mounted message");
  }
}
</script>

<style lang="stylus">
@import '../assets/styles/userImage.css';
@import '../assets/styles/agencyImage.css';
color-system = aliceblue
color-user = #b3e6a6
transparent-body()
  content ''
  display block
  position absolute
  border 8px solid transparent


.messagist__list-item
  list-style none
  margin-bottom 5px

  span
    padding 10px
    display inline-block
    background color-system
    position relative
    border-radius .5rem
    max-width 80%

  &-system
    text-align left

    span::before
      transparent-body()
      border-right-color color-system
      left -16px
      bottom 8px

  &-user
    text-align right

    span
      background color-user

      &::after
        transparent-body()
        border-left-color color-user
        right -16px
        bottom 8px

  &-system + &-user,
  &-user + &-system
    margin-top 10px
</style>

