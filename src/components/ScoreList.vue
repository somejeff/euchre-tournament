<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm12 md4 lg4 v-for="round in rounds" :key="round.id">
        <v-card>
          
          <v-toolbar dark color="indigo lighten-2">
            <h4>Round {{ round.id }}</h4>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="success" dark class="mb-2" v-on="on">Add Player</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Round: {{ editedRound }}</span>
                  <span class="headline">Table: {{ editedTable }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs6 sm6 md2>
                        <v-text-field v-model="search" label="Search Player ID"></v-text-field>
                      </v-flex>
                      <v-flex xs6 sm6 md2>
                        <v-btn @click="searchTable">Search</v-btn>
                      </v-flex>
                      <v-flex xs12 sm6 md6>{{ editedItem.team1 }}</v-flex>
                      <v-flex xs12 sm6 md6>{{ editedItem.team2 }}</v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-divider></v-divider>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      editedRound: -1,
      editedTable: -1,
      editedItem: null,
      rounds: [],
      search: null
    };
  },
  mounted() {
    this.rounds = this.$store.state.rounds;
  },
  methods: {
    searchTable() {
      /*this.editedRound = 0;
      const round = this.rounds[this.editedRound];
      for (let i = 0; i < round.tables.length; i++) {
        const table = round.tables[i];
        if (
          [
            table.team1.player1.id,
            table.team1.player2.id,
            table.team2.player1.id,
            table.team2.player2.id
          ].indexOf(this.searchTable)
        ) {
          this.editedTable = i;
          this.editedItem = table;
        }
       
      } */
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = {};
        this.editedRound = -1;
        this.editedTable = -1;
      }, 300);
    },

    save() {
      Object.assign(
        this.rounds[this.editedRound].tables[this.editedTable],
        this.editedItem
      );
      //this.$store.dispatch("updatePlayers", this.players);
      this.close();
    }
  }
};
</script>

<style>
</style>
