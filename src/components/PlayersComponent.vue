<template>
  <table>
    <thead class="thead-dark">
      <tr>
        <th scope="col">Player</th>
        <th scope="col">Points</th>
      </tr>
    </thead>
    <tbody :class="{ 'table-success': showPoints }">
      <tr v-for="(player, index) in players" :key="index" :class="{ 'table-warning': player.point == 0 }">
        <td class="w-50" @contextmenu="deletePlayer($event, index)">{{ index | nameFilter }}</td>
        <td class="w-50">
          <font-awesome-icon v-if="!player.connected" icon="wifi" class="text-danger" />
          <template v-else>
            <font-awesome-icon
              v-if="!showPoints && player.point != 0"
              icon="check-circle"
              size="lg"
              class="text-success"
            />
            <font-awesome-icon v-else-if="!showPoints" icon="ellipsis-h" size="lg" class="text-secondary" />
            <span class="point-value" v-if="(index === myName || showPoints) && player.point != 0">
              {{ player.point > 0 ? player.point : '?' }}
              <span v-if="checkCheaters(player)" class="text-danger">(cheated)</span>
            </span>
            <small class="text-muted" v-else-if="showPoints && player.point == 0">Not Voting</small>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import db from '../services/firebase';
import { Players, Player } from '../types/player';
import nameFilter from '../filters/nameFilter';

@Component({
  components: {},
  filters: {
    nameFilter,
  },
})
export default class PlayersComponent extends Vue {
  @Prop() players!: Players;
  @Prop() showPoints!: boolean;
  @Prop() myName!: string;
  @Prop() cheated!: boolean;
  @Prop() cheaterModeOn!: boolean;
  @Prop() timedVoting!: boolean;

  deletePlayer(e: Event, player: string) {
    e.preventDefault();
    if (confirm('Remove player "' + player + '" ?')) {
      db.deletePlayer(player);
    }
  }
  checkCheaters(player: Player) {
    if (this.cheaterModeOn && player.cheated) {
      return true;
    }
    return false;
  }
}
</script>

<style scoped lang="scss">
table {
  min-width: 16em;
  tbody.table-success {
    .point-value {
      font-weight: bolder;
    }
  }
  td /deep/ {
    .text-danger {
      opacity: 0.5;
    }
  }
}
</style>
