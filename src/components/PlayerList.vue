<template>
  <v-container>

    <div ref="spreadsheet"></div>

  </v-container>
</template>

<script>
import jexcel from "jexcel";
import "jexcel/dist/jexcel.css";

export default {
  name: "PlayerList",
  data() {
    return {
      spreadsheet: null,
      spreadsheetOptions: {
        data: [],
        allowToolbar: true,
        search: true,
        columns: [
          { type: "text", title: "Name", width: "400px" },
          {
            type: "dropdown",
            title: "Gender",
            width: "150px",
            source: [{ id: "f", name: "Female" }, { id: "m", name: "Male" }]
          },

          { type: "numeric", title: "Fixed Table", width: "200px" }
        ],
        onchange: this.dataChanged,
        allowInsertColumn:false,
        allowManualInsertColumn:true,
        allowDeleteColumn:true
      },
      players: []
    };
  },


  created() {
    this.initialize();
  },

  mounted() {
    this.spreadsheet = jexcel(this.$el, this.spreadsheetOptions);
    this.spreadsheet.insertRow();
  },
  methods: {
    initialize() {
      this.players = this.$store.state.players;
      this.spreadsheetOptions.data = this.players.map(player => {
        return [player.name, player.gender];
      });
    },
    dataChanged(instance, cell, x, y, value) {
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
