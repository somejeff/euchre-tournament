<template>
  <v-container>
    <object id="pdf" :data="url" type="application/pdf"></object>
  </v-container>
</template>

<script>
import pdf from "pdfjs";

export default {
  data() {
    return {
      url: null
    };
  },
  created() {
    this.generatePdf();
  },
  methods: {
    generatePdf() {
      const doc = new pdf.Document();
      let cell;

      const hands = this.getHands();
      const roundCount = this.$store.state.rounds.length;
//      const players = this.$store.state.players;
//      const playerCount = players.length;

      let i = 0;
      while (i < hands.length) {
        cell = doc.cell({ x: 0 * pdf.cm, y: 28 * pdf.cm, width: 9 * pdf.cm });
        this.generateCard(cell, hands[i]);
        cell = doc.cell({ x: 11 * pdf.cm, y: 28 * pdf.cm, width: 9 * pdf.cm });
        this.generateCard(cell, hands[i + roundCount]);
        cell = doc.cell({ x: 0 * pdf.cm, y: 14 * pdf.cm, width: 9 * pdf.cm });
        this.generateCard(cell, hands[i + roundCount * 2]);
        cell = doc.cell({ x: 11 * pdf.cm, y: 14 * pdf.cm, width: 9 * pdf.cm });
        this.generateCard(cell, hands[i + roundCount * 3]);
        doc.pageBreak();
        i++;
        if (i % roundCount == 0) {
          i = i + roundCount * 3;
        }
      }

      doc.asBuffer((err, data) => {
        this.url = URL.createObjectURL(
          new Blob([data], { type: "application/pdf" })
        );
      });
    },

    generateCard(cell, card) {
      const header = cell.table({
        widths: [2 * pdf.cm, 1 * pdf.cm, 2 * pdf.cm, 4.5 * pdf.cm]
      });

      let hrow = header.row();
      hrow.cell("Round # ", {
        font: require("pdfjs/font/Times-Bold"),
        fontSize: 13,
        textAlign: "right"
      });
      hrow.cell("" + card.round, {
        font: require("pdfjs/font/Times-Bold"),
        fontSize: 13
      });
      hrow.cell("Player: ", {
        font: require("pdfjs/font/Times-Bold"),
        fontSize: 13
      });
      hrow.cell(card.player.name, {
        font: require("pdfjs/font/Times-Bold"),
        fontSize: 13,
        underline: true
      });
      hrow = header.row();
      hrow.cell("Table # ", {
        font: require("pdfjs/font/Times-Bold"),
        fontSize: 13,
        textAlign: "right"
      });
      hrow.cell("" + card.table, {
        font: require("pdfjs/font/Times-Bold"),
        fontSize: 13
      });
      hrow.cell("Partner: ", {
        font: require("pdfjs/font/Times-Roman"),
        fontSize: 13
      });
      hrow.cell(card.partner.name, {
        font: require("pdfjs/font/Times-Roman"),
        fontSize: 13
      });

      const table = cell.table({
        widths: [3 * pdf.cm, 4 * pdf.cm, 1 * pdf.cm, 1 * pdf.cm],
        borderWidth: 1,
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 1,
        paddingBottom: 1
      });
      let tr = table.header();
      tr.cell("ID: " + card.player.id, {
        font: require("pdfjs/font/Times-Bold"),
        backgroundColor: "#eeeeee"
      });
      tr.cell("Score", {
        font: require("pdfjs/font/Times-Bold"),
        fontSize: 10,
        textAlign: "center",
        backgroundColor: "#eeeeee"
      });
      tr.cell("A", {
        font: require("pdfjs/font/Times-Bold"),
        fontSize: 10,
        textAlign: "center",
        backgroundColor: "#eeeeee"
      });
      tr.cell("E", {
        font: require("pdfjs/font/Times-Bold"),
        fontSize: 10,
        textAlign: "center",
        backgroundColor: "#eeeeee"
      });

      for (let i = 1; i <= 12; i++) {
        tr = table.row();
        tr.cell("Hand # " + i, {
          font: require("pdfjs/font/Times-Roman"),
          fontSize: 11
        });
      }

      tr = table.row();
      tr.cell("Total Points", {
        font: require("pdfjs/font/Times-Bold"),
        fontSize: 12,
        underline: true,
        backgroundColor: "#eeeeee"
      });

      tr.cell({
        backgroundColor: "#eeeeee"
      });

      tr.cell({
        backgroundColor: "#eeeeee"
      });

      tr.cell({
        backgroundColor: "#eeeeee"
      });

      cell.text( " \n Check in the 'A' column, if \n\t you went alone and got all 5 tricks.", {
        fontSize: 10
      });
      
      cell.text( " \n Check in the 'E' column, if you were euchred.", {
        fontSize: 10
      });
    },
    getHands() {
      return this.$store.state.players.flatMap(player => {
        return this.$store.state.rounds.flatMap(round => {
          return round.tables
            .filter(table => {
              return [
                table.team1.player1.id,
                table.team1.player2.id,
                table.team2.player1.id,
                table.team2.player2.id
              ].includes(player.id);
            })
            .map(table => {
              let item = {
                player: player,
                round: round.id,
                table: table.table,
                partner: null
              };
              switch (player.id) {
                case table.team1.player1.id:
                  item.partner = table.team1.player2;
                  break;
                case table.team1.player2.id:
                  item.partner = table.team1.player1;
                  break;
                case table.team2.player1.id:
                  item.partner = table.team2.player2;
                  break;
                case table.team2.player2.id:
                  item.partner = table.team2.player1;
                  break;
              }
              return item;
            });
        });
      }); /*
        .sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          } else if (a.name > b.name) {
            return 1;
          } else {
            if (a.round < b.round) {
              return -1;
            } else if (a.round > b.round) {
              return 1;
            }
          }
        });*/
    }
  },
  //getPartner(id, table) {}
};
</script>
<style>
#pdf {
  width: 90%;
  height: 400px;
}
</style>
