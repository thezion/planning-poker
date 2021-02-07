<template>
  <div class="single-player text-center" @contextmenu="deletePlayer($event)">
    <div class="poker-place-holder mx-auto">
      <div class="warpper">
        <transition-group name="rotate">
          <img key="offline" v-if="!player.connected" src="img/offline.png" />
          <!-- v-else-if="(name==myName && player.point != 0) || showPoints" -->
          <img
            v-else-if="showPoints"
            key="point"
            :src="'img/' + (player.point < 0 ? 'question' : player.point == 0 ? 'pass' : player.point) + '.png'"
          />
          <img v-else-if="player.point != 0" key="back" src="img/back.png" />
          <img v-if="cheated" key="cheat" src="img/cheat.gif" width="62" />
        </transition-group>
      </div>
    </div>
    <div class="player-name" :class="{ 'text-warning': name == $store.state.myName }">
      {{ name | nameFilter }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import db from '../services/firebase';
import { Player } from '../types/player';
import nameFilter from '../filters/nameFilter';

@Component({
  components: {},
  filters: {
    nameFilter,
  },
})
export default class PlayersComponent extends Vue {
  @Prop() player!: Player;
  @Prop() showPoints!: boolean;
  @Prop() name!: string;
  @Prop() cheated!: boolean;

  deletePlayer(e: Event) {
    e.preventDefault();
    if (confirm('Delete player "' + this.name + '" ?')) {
      db.deletePlayer(this.name);
    }
  }
}
</script>

<style scoped lang="scss">
.single-player {
  width: 130px;
  height: 125px;

  .poker-place-holder {
    width: 66px;
    height: 98px;
    padding: 2px 1px;
    border: 2px dashed rgba(255, 255, 255, 0.35);
    border-radius: 6px;
    .warpper {
      position: relative;
      width: 100%;
      height: 100%;
      * {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .player-name {
    margin-top: 9px;
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
  }
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.3s ease;
}
.rotate-enter {
  transform: rotateY(90deg);
}
.rotate-leave-to {
  opacity: 0;
}
</style>
