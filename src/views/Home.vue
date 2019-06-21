<template>
  <v-container>
    <v-stepper v-model="step" vertical>
      <v-stepper-step :complete="playerListDone" step="1" editable>
        Setup Player List
        <small>{{ this.$store.state.players.length}} Players</small>
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-card color="grey lighten-4" class="mb-5">
          <PlayerList/>
        </v-card>
        <v-btn color="primary" @click="step = 2">Continue</v-btn>
        <v-btn flat>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="roundsDone" step="2" editable>
        Generate Rounds
        <small>{{ this.$store.state.rounds.length}} Rounds</small>
      </v-stepper-step>
      <v-stepper-content step="2">
        <v-card color="grey lighten-4" class="mb-5">
          <Generator/>
        </v-card>
        <v-btn color="primary" @click="step = 3;componentKey++">Continue</v-btn>
        <v-btn flat>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-step
        :complete="scorecardsDone"
        step="3"
        editable
      >Print Scorecards</v-stepper-step>

      <v-stepper-content step="3">
        <v-card color="grey lighten-4" class="mb-5">
          <ScorecardPDF :key="componentKey"/>
        </v-card>
        <v-btn color="primary" @click="step = 4">Continue</v-btn>
        <v-btn flat>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="gamesDone" step="4" editable>Update Leaderboard</v-stepper-step>

      <v-divider></v-divider>
      <v-stepper-step step="5" editable>Announce Winners</v-stepper-step>
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
