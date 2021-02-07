<template>
  <nav class="navbar navbar-dark bg-dark">
    <router-link class="navbar-brand" to="/">
      <img src="img/favicon-192x192.png" class="logo d-inline-block align-top mr-2" />
      Planning Poker
    </router-link>
    <span class="navbar-text">
      <font-awesome-icon icon="user-circle" size="lg" />
      {{ $store.state.myName || 'Guest' | nameFilter }}
    </span>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import nameFilter from '../filters/nameFilter';

@Component({
  filters: {
    nameFilter,
  },
})
export default class HeaderComponent extends Vue {}
</script>

<style scoped lang="scss">
.logo {
  height: 1.5em;
}
.bg-dark {
  background: #111 !important;
}
</style>
