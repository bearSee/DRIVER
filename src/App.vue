<template>
  <div id="app">
    <transition
      name="main-classes-transition"
      enter-active-class="animated fadeIn"
      leave-active-class="animated">
      <router-view />
    </transition>
  </div>
</template>

<script>

export default {
    name: 'App',
    methods: {
        forbidEnter(event) {
            const {
                keyCode, key, target,
            } = event;
            if ((keyCode === 13 || key === 'Enter') && !['INPUT', 'TEXTAREA'].includes(target.tagName)) {
                // eslint-disable-next-line no-unused-expressions
                event.preventDefault ? event.preventDefault() : window.event.returnValue = false;
            }
        },
    },
    created() {
        window.addEventListener('keypress', this.forbidEnter);
    },
    destroyed() {
        window.removeEventListener('keypress', this.forbidEnter);
    },
};
</script>
<style lang="scss">
@import "@/assets/scss/style.scss";

html{
  overflow: hidden;
}
html,body{
  height: 100%;
  background-color: #f9fbff;
  padding: 0 !important;
  font-size: 14px;
}
textarea {
  font-family: inherit;
}
a {
  text-decoration:none;
  color: inherit;
}
#app {
  height: 100%;
}
</style>
