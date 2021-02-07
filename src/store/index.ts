import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    myName: '',
    room: '',
    confetti: false,
    superConfetti: false,
  },
  getters: {
    getName(state) {
      state.myName = localStorage.getItem('myName') || '';
      return state.myName.toLowerCase();
    },
    getRoom(state) {
      state.room = localStorage.getItem('room') || '';
      return state.room.toLowerCase();
    },
  },
  mutations: {
    setName(state, name: string) {
      state.myName = name.toLowerCase();
      localStorage.setItem('myName', state.myName);
    },
    setRoom(state, room: string) {
      state.room = room.toLowerCase();
      localStorage.setItem('room', state.room);
    },
    showConfetti(state) {
      state.confetti = true;
      window.setTimeout(() => {
        state.confetti = false;
      }, 5000);
    },
    showSuperConfetti(state) {
      state.superConfetti = true;
      window.setTimeout(() => {
        state.superConfetti = false;
      }, 5000);
    },
  },
  actions: {},
  modules: {},
});
