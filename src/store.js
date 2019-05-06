import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'


Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    players: [],
    rounds: []
  },
  mutations: {
    setPlayers(state, players) {
      state.players = players;
    },
    setRounds(state, rounds) {
      state.rounds = rounds;
    }
  },
  actions: {
    updatePlayers({ commit }, players) {
      commit('setPlayers', players);
    },

    updateRounds({ commit }, rounds) {
      commit('setRounds', rounds);
    }
  }
})
