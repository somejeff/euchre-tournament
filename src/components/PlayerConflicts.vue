<template>
  <v-container>
    <div ref="spreadsheet"></div>
  </v-container>
</template>

<script>
import jexcel from "jexcel";
import "jexcel/dist/jexcel.css";

export default {
  name: "PlayerConflicts",
  data() {
    return {
      spreadsheet: null,
      spreadsheetOptions: {
        data: [],

        colAlignments: ["left", "left"],
        columns: [
          { type: "dropdown", title: "Name", width: "400px",source:this.players},
         

          { type: "dropdown", title: "Conflicts", width: "400px" }
        ],
        onchange: this.dataChanged,
        allowInsertColumn: false,
        allowManualInsertColumn: true,
        allowDeleteColumn: true,
        minSpareRows: 1
      },
      players: []
    };
  },

  created() {
    this.initialize();
  },

  mounted() {
    this.spreadsheet = jexcel(this.$el, this.spreadsheetOptions);
    //this.spreadsheet.insertRow();
  },
  methods: {
    initialize() {
      this.players = this.$store.state.players;
      this.spreadsheetOptions.data = this.players
        .filter(player => player.conflicts != null)
        .map(player => {
          return [player.name, player.conflicts];
        });
    },
    dataChanged() {
      this.players = this.spreadsheet
        .getData()
        .filter(row => row[0].length > 0)
        .map((row, i) => {
          return {
            id: i + 1,
            name: row[0],
            gender: row[1],
            table: row[2] * 1 > 0 ? row[2] : null
          };
        });
      this.$store.dispatch("updatePlayers", this.players);
    }
  }
};
</script>

<style>
.jexcel_search {
  border: 1px solid black;
}
.jexcel_filter {
  justify-content: flex-start;
}
</style>
