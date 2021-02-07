<template>
  <div id="app" class="mx-auto shadow position-relative">
    <header-component />
    <div class="position-relative">
      <router-view />
    </div>
    <transition name="fade">
      <confetti-component v-if="$store.state.confetti" />
      <party-component v-if="$store.state.superConfetti" />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HeaderComponent from './components/HeaderComponent.vue';
import ConfettiComponent from './components/ConfettiComponent.vue';
import PartyComponent from './components/PartyComponent.vue';

@Component({
  components: {
    HeaderComponent,
    ConfettiComponent,
    PartyComponent,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import './styles/reset-bootstrap.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';
@import './styles/global.scss';
#app {
  width: 960px;
  background-color: #000;
  min-height: 100%;
  overflow: hidden;
  .view {
    z-index: 10;
  }
}
</style>
