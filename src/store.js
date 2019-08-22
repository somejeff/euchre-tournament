import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'


Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    players: [],
    rounds: [],
    scorecards: [],
    generatorSettings: [],
    games: [],
    winners: []
  },
  mutations: {
    setPlayers(state, players) {
      state.players = players;
    },
    setGeneratorSettings(state, settings) {
      state.generatorSettings = settings;
    },
    setRounds(state, rounds) {
      state.rounds = rounds;
    }
  },
  actions: {
    updatePlayers({ commit }, players) {
      commit('setPlayers', players);
    },
    updateGeneratorSettings({ commit }, settings) {
      commit('setGeneratorSettings', settings);
    },

    updateRounds({ commit }, rounds) {
      commit('setRounds', rounds);
    }
  }
})
