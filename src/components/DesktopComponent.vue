<template>
  <div
    id="desktop"
    class="d-flex flex-wrap justify-content-around align-items-center mx-auto"
    :class="{ 'extend-sm': playersCount >= 9 && playersCount <= 10, 'extend-md': playersCount >= 11 }"
  >
    <single-player-component
      v-for="(player, name) in players"
      :key="name"
      :player="player"
      :name="name"
      :myName="myName"
      :showPoints="showPoints"
      :cheated="checkCheaters(player)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Players, Player } from '../types/player';
import SinglePlayerComponent from './SinglePlayerComponent.vue';

@Component({
  components: {
    SinglePlayerComponent,
  },
})
export default class PlayersComponent extends Vue {
  @Prop() players!: Players;
  @Prop() showPoints!: boolean;
  @Prop() myName!: string;
  @Prop() cheaterModeOn!: boolean;
  @Prop() timedVoting!: boolean;

  checkCheaters(player: Player) {
    if (this.cheaterModeOn && player.cheated) {
      return true;
    }
    return false;
  }

  get playersCount() {
    return this.players ? Object.keys(this.players).length : 0;
  }
}
</script>

<style scoped lang="scss">
#desktop {
  width: 600px;
  height: 300px;

  // 130px max
  &.extend-sm /deep/ {
    .single-player {
      width: 110px !important;
    }
  }
  &.extend-md /deep/ {
    .single-player {
      width: 80px !important;
    }
  }

  img {
    width: 130px;
    height: 90px;
    display: block;
  }
}
</style>
