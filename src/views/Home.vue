<template>
  <v-container>
    <v-stepper v-model="step" vertical>
        <v-stepper-step
          :complete="playerListDone"
          step="1"
          editable
          @click="$router.push('/players')"
        >
          Setup Player List
          <small>{{ this.$store.state.players.length}} Players</small>
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          :complete="roundsDone"
          step="2"
          editable
          @click="$router.push('/generator')"
        >
          Generate Rounds
          <small>{{ this.$store.state.rounds.length}} Rounds</small>
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="scorecardsDone" step="3" editable @click="$router.push('/scorecards')">Print Scorecards</v-stepper-step>

        <v-divider></v-divider>
        <v-stepper-step :complete="gamesDone" step="4" editable @click="$router.push('/score')">Update Leaderboard</v-stepper-step>

        <v-divider></v-divider>
        <v-stepper-step step="5" editable>Announce Winners</v-stepper-step>
    </v-stepper>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      playerListDone: this.$store.state.players.length >= 4,
      roundsDone: this.$store.state.rounds.length > 0,
      scorecardsDone: this.$store.state.scorecards.length > 0,
      gamesDone: this.$store.state.games.length > 0
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
