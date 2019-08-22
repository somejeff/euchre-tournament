<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex sm12 md4>
        <v-text-field v-model="roundCount" label="Rounds"></v-text-field>
      </v-flex>
      <v-flex sm12 md4>
        <v-text-field v-model="seed" label="Seed"></v-text-field>
      </v-flex>
      <v-flex sm12 md4>
        <v-btn @click="generate" :loading="loading" color="red lighten-3">Generate</v-btn>
      </v-flex>
    </v-layout>
    <v-data-iterator
      :items="rounds"
      hide-actions
      :rows-per-page-items="[1000]"
      content-tag="v-layout"
      row
      wrap
    >
      <template v-slot:item="round">
        <v-flex xs12 sm12 md4 lg4>
          <v-card>
            <v-toolbar dark color="indigo lighten-2">
              <h4>Round {{ round.item.id }}</h4>
            </v-toolbar>
            <v-divider></v-divider>
            <v-layout row ma-2 v-for="table in round.item.tables" :key="table.id">
              <v-flex xs2 text-no-wrap>Table {{ table.table }}</v-flex>
              <v-flex xs4 text-truncate>
                {{ table.team1.player1.name }}
                <br />
                {{ table.team1.player2.name }}
              </v-flex>
              <v-flex>vs</v-flex>
              <v-flex xs5 text-truncate>
                {{ table.team2.player1.name }}
                <br />
                {{ table.team2.player2.name }}
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import MersenneTwister from "mersenne-twister";

export default {
  data() {
    return {
      loading: false,
      rounds: [],
      players: this.$store.state.players,
      roundCount: this.$store.state.generatorSettings.roundCount || 6,
      seed: this.$store.state.generatorSettings.seed || 1
    };
  },
  created() {
    this.rounds = this.$store.state.rounds;
  },
  methods: {
    generate() {
      this.loading = true;
      const mersenne = new MersenneTwister(this.seed);
      this.rounds = [];
      this.$store.dispatch("updateRounds", this.rounds);
      this.$store.dispatch("updateGeneratorSettings", {
        roundCount: this.roundCount,
        seed: this.seed
      });

      setTimeout(()=>{
        for (var roundNum = 1; roundNum <= this.roundCount; roundNum++) {
        let round;
        for (var attempts = 0; attempts <= 1000000; attempts++) {
          try {
            round = this.createRound(mersenne, roundNum, false);
          } catch (e) {
            continue;
          }
          this.rounds.push(round);
          this.progress = 1;
          break;
        }
        if (!round) {
          for (attempts = 0; attempts <= 1000000; attempts++) {
            try {
              round = this.createRound(mersenne, roundNum, true);
            } catch (e) {
              continue;
            }
            this.rounds.push(round);
            this.progress = 1;
            break;
          }
        }
      }

      this.loading = false;
      this.$store.dispatch("updateRounds", this.rounds);
      this.$store.dispatch("updateGeneratorSettings", {
        roundCount: this.roundCount,
        seed: this.seed
      });
      },1000);
      
    },
    shuffle(mersenne, arr) {
      // distilled from chancejs
      var new_array = [],
        j = 0,
        length = Number(arr.length),
        source_indexes = Array.apply(null, Array(length)).map(function(_, i) {
          return i;
        }),
        last_source_index = length - 1,
        selected_source_index;

      for (var i = 0; i < length; i++) {
        // Pick a random index from the array
        selected_source_index = Math.floor(
          mersenne.random() * last_source_index
        );
        j = source_indexes[selected_source_index];

        // Add it to the new array
        new_array[i] = arr[j];

        // Mark the source index as used
        source_indexes[selected_source_index] =
          source_indexes[last_source_index];
        last_source_index -= 1;
      }

      return new_array;
    },

    createRound(mersenne, roundNum, sameTableConflict) {
      const tables = [];
      // shuffle then remove any players that are restricted to a table
      let shuffledPlayers = this.shuffle(mersenne, this.players).filter(
        i => i.table == null
      );
      this.players
        .filter(i => i.table != null)
        .map(i => {
          shuffledPlayers.splice((i.table - 1) * 4, 0, i);
        });
      for (var table = 1; table <= this.players.length / 4; table++) {
        const tablePlayers = [
          shuffledPlayers.shift(),
          shuffledPlayers.shift(),
          shuffledPlayers.shift(),
          shuffledPlayers.shift()
        ];
        // look for pre-configured player conflicts (Alice never wants to sit at the same table as Bob)
        tablePlayers.forEach(player => {
          if (
            this.intersect(
              player.conflictingPlayers,
              tablePlayers.map(p => p.id)
            ).length > 0
          ) {
            throw new Error("Player Conflict");
          }
        });
        const t = {
          id: roundNum * 1000 + table,
          round: roundNum,
          table: table,
          team1: { player1: tablePlayers[0], player2: tablePlayers[1] },
          team2: { player1: tablePlayers[2], player2: tablePlayers[3] }
        };
        this.checkConflict(t, sameTableConflict);
        tables.push(t);
      }
      return { id: roundNum, tables: tables };
    },
    checkConflict(table, sameTableConflict) {
      this.rounds.forEach(r => {
        r.tables.forEach(t => {
          const group1 = [
            t.team1.player1.id,
            t.team1.player2.id,
            t.team2.player1.id,
            t.team2.player2.id
          ];
          const group2 = [
            table.team1.player1.id,
            table.team1.player2.id,
            table.team2.player1.id,
            table.team2.player2.id
          ];
          let conflict = this.intersect(group1, group2);

          if (conflict.length >= 2) {
            let sameTeam1 = this.intersect(conflict, [
              t.team1.player1.id,
              t.team1.player2.id
            ]);
            let sameTeam2 = this.intersect(conflict, [
              t.team2.player1.id,
              t.team2.player2.id
            ]);
            if (
              (!sameTableConflict && sameTeam1.length >= 2) ||
              sameTeam2.length >= 2
            ) {
              throw new Error("conflict");
            }
          }
        });
      });
    },
    intersect(group1, group2) {
      return group1.filter(p => group2.includes(p));
    }
  }
};
</script>

<style>
</style>
