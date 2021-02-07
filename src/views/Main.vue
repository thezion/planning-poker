<template>
  <div>
    <div id="desk" class="position-relative mb-4 px-3">
      <h1 class="py-4 text-center text-white">
        {{ room | nameFilter }}
        <button @click="toggleSettings" class="btn btn-sm btn-outline-light">
          <font-awesome-icon icon="cog" size="md" />
          {{ gameMode }}
        </button>

        <span v-if="settingsOpen">
          <button
            @click="changeGameMode('Standard')"
            class="btn btn-sm ml-3"
            v-bind:class="[gameMode === 'Standard' ? 'btn-danger' : 'btn-light']"
          >
            Standard
          </button>
          <button
            @click="changeGameMode('Cheater')"
            class="btn btn-sm ml-3"
            v-bind:class="[cheaterMode ? 'btn-danger' : 'btn-light']"
          >
            Cheater
          </button>
          <button
            @click="changeGameMode('Timed Voting')"
            class="btn btn-sm ml-3"
            v-bind:class="[timedVoting ? 'btn-danger' : 'btn-light']"
          >
            Timed
          </button>
        </span>
      </h1>

      <div class="mb-4" v-if="!observer">
        <div v-if="timedVoting" class="position-absolute text-white" id="timed-voting">
          <div class="col">
            <button @click="startVoting" v-if="!voting" class="btn btn-lg btn-block btn-primary mt-5">
              Start the clock!
            </button>
          </div>
          <div class="col text-center" v-if="timedVoting && voting">
            <h3>Place your bets!</h3>
            <base-timer-component @timesUp="timesUp" />
          </div>
        </div>
        <div id="pokers" class="position-absolute" v-if="!timedVoting || (timedVoting && voting)">
          <poker-component @onPoint="point" :currentPoint="myPoint" class="justify-content-center" />
        </div>
      </div>

      <players-component
        class="mt-5"
        :players="players"
        :showPoints="showPoints"
        :myName="myName"
        :gameMode="gameMode"
        :cheaterModeOn="cheaterMode"
        :timedVoting="timedVoting"
      />

      <div id="vote-actions" class="d-flex justify-content-between position-relative" v-if="!observer && !timedVoting">
        <button @click="clearVotes" class="btn btn-lg btn-dark">Clear Votes</button>
        <button @click="showVotes" class="btn btn-lg btn-dark">Show Votes</button>
      </div>
    </div>
    <div class="text-secondary text-center">
      <p v-if="observer"><span class="badge badge-info">info</span> You are an observer of this session.</p>
      <p v-if="!observer">
        <span class="badge badge-secondary">Tips</span> To remove a player, right click the player's name.
      </p>
      <!-- <pre>{{ players }}</pre> -->
      <p>
        <a href @click.prevent="refresh">Refresh</a>
        |
        <a href @click.prevent="logout">Log Out</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PokerComponent from '../components/PokerComponent.vue';
import PlayersComponent from '../components/DesktopComponent.vue';
import BaseTimerComponent from '../components/BaseTimer.vue';

import db from '../services/firebase';
import nameFilter from '../filters/nameFilter';
import { Players, Player } from '../types/player';

@Component({
  components: {
    PokerComponent,
    PlayersComponent,
    BaseTimerComponent,
  },
  filters: {
    nameFilter,
  },
})
export default class Main extends Vue {
  room = '';
  myName = '';
  myPoint = 0;
  observer: boolean = false;
  gameMode = 'Standard';
  cheaterMode: boolean = false;
  timedVoting: boolean = false;
  voting: boolean = false;
  settingsOpen: boolean = false;

  // from database
  showPoints = false;
  players: Players = {};

  created() {
    this.room = this.$route.params.room.toLowerCase().trim();
    this.observer = (this.$route.query.observer as string) == '1';
    if (!this.observer) {
      this.myName = this.$store.getters.getName;
    }
    this.$store.commit('setRoom', this.room);
  }

  mounted() {
    if (!this.room || (!this.myName && !this.observer)) {
      this.$router.push('/');
    } else {
      // init
      db.signIn(this.room, this.myName);
      // listener
      db.watch(snapshot => {
        const res = snapshot.val();
        this.players = res.players;
        //
        this.updateMyPoint();
        //
        const playerArr = Object.values(this.players);
        this.showPoints = res.showPoints == 1 ? true : this.allPlayersVoted(playerArr);
        if (this.showPoints && this.isConsistent(playerArr)) {
          this.$store.commit('showConfetti');
        }
      });
    }
  }

  point(pt: number) {
    db.setPoint(pt, this.showPoints);
  }

  changeGameMode(mode: string) {
    this.settingsOpen = false;
    db.clearVotes();
    this.gameMode = mode;
    switch (mode) {
      case 'Cheater': {
        this.cheaterMode = true;
        this.timedVoting = false;
        break;
      }
      case 'Timed Voting': {
        this.timedVoting = true;
        this.cheaterMode = false;
        break;
      }
      default: {
        this.timedVoting = false;
        this.cheaterMode = false;
      }
    }
  }

  toggleSettings() {
    this.settingsOpen = !this.settingsOpen;
  }

  startVoting() {
    this.voting = true;
    db.clearVotes();
  }

  timesUp() {
    this.voting = false;
    db.showVotes();
  }

  clearVotes() {
    db.clearVotes();
  }

  showVotes() {
    db.showVotes();
  }

  refresh() {
    window.location.reload();
  }

  logout() {
    db.deletePlayer(this.myName);
    this.$router.push('/');
  }

  isConsistent(playerArr: Player[]): boolean {
    const validPlayerArr = playerArr.filter(player => {
      return player.connected && player.point >= 0;
    });
    const consistent =
      validPlayerArr.length >= 2 &&
      validPlayerArr[0].point > 0 &&
      validPlayerArr.every(player => {
        return player.point == validPlayerArr[0].point;
      });
    return consistent;
  }

  nobodyCheated(playerArr: Player[]): boolean {
    const cheaters = playerArr.filter(player => {
      return player.cheated && player.point >= 0;
    });
    if (cheaters.length > -1) {
      return false;
    }
    return true;
  }

  allPlayersVoted(playerArr: Player[]) {
    return (
      playerArr.filter(player => {
        return player.point == 0;
      }).length === 0
    );
  }

  updateMyPoint() {
    if (this.players[this.myName]) {
      this.myPoint = this.players[this.myName].point;
    }
  }

  beforeDestroy() {
    db.detachListener();
    // disconnect
    db.offline();
  }
}
</script>

<style scoped lang="scss">
#desk {
  width: 960px;
  height: 580px;
  background: url('../../public/img/poker-desk.jpg');
  #vote-actions {
    z-index: 10;
  }
  #pokers {
    z-index: 5;
    bottom: 15px;
    width: 100%;
  }
  #timed-voting {
    top: 2rem;
    right: 1rem;
  }
}
</style>
