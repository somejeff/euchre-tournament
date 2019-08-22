<template>
  <v-container>
    <v-stepper v-model="step" vertical >
      <v-stepper-step step="1" editable>
        Setup Player List
        <small>{{ this.$store.state.players.length}} Players</small>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-card class="mb-5">
          <PlayerList />
        </v-card>
        <v-btn color="primary" @click="step = 2">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-step step="2" editable>
        Generate Rounds
        <small>{{ this.$store.state.rounds.length}} Rounds</small>
      </v-stepper-step>
      <v-stepper-content step="2">
        <v-card  class="mb-5">
          <Generator />
        </v-card>
        <v-btn color="primary" @click="step = 3;componentKey++">Continue</v-btn>
      </v-stepper-content>

      <v-stepper-step step="3">Print Scorecards</v-stepper-step>

      <v-stepper-content step="3" editable>
        <v-card class="mb-5">
          <ScorecardPDF :key="componentKey" />
        </v-card>
        <v-btn color="primary" to="/scoreboard">Start</v-btn>
      </v-stepper-content>

    </v-stepper>
  </v-container>
</template>

<script>
import PlayerList from "../components/PlayerList";
import Generator from "../components/Generator";
import ScorecardPDF from "../components/ScorecardPDF";

export default {
  components: {
    PlayerList,
    Generator,
    ScorecardPDF
  },
  data() {
    return {
      step: 1,
      playerListDone: this.$store.state.players.length >= 4,
      roundsDone: this.$store.state.rounds.length > 0,
      scorecardsDone: this.$store.state.scorecards.length > 0,
      gamesDone: this.$store.state.games.length > 0,
      componentKey: null
    };
  },
  created() {
    this.step = 1;
    if (this.playerListDone) {
      this.step = 2;
    }
    if (this.roundsDone) {
      this.step = 3;
    }
    if (this.scorecardsDone) {
      this.step = 4;
    }
    if (this.gamesDone) {
      this.step = 5;
    }
  }
};
</script>
