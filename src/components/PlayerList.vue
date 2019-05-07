<template>
  <v-container>
    <v-toolbar v-if="!bulkEdit" flat color="white">
      <v-spacer></v-spacer>

      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>

      <v-btn color="primary" dark class="mb-2" @click="showBulkEdit">Bulk Edit</v-btn>
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">Add Player</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Details</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-radio-group v-model="editedItem.gender">
                    <v-radio label="Female" value="f"></v-radio>
                    <v-radio label="Male" value="m"></v-radio>
                  </v-radio-group>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.table" label="Fixed Table"></v-text-field>
                </v-flex>
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

    <v-data-table
      v-if="!bulkEdit"
      :headers="headers"
      :search="search"
      :items="players"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.gender }}</td>
        <td>{{ props.item.table }}</td>
        <td class="justify-center layout px-0">
          <v-btn small @click="editItem(props.item)">Edit</v-btn>
          <v-btn small color="danger" @click="deleteItem(props.item)">Delete</v-btn>
        </td>
      </template>
    </v-data-table>

    <v-card v-if="bulkEdit">
        <v-textarea outline auto-grow  v-model="rawPlayers" label="Player List" class="pa-4 "></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="cancelBulkEdit">Cancel</v-btn>
        <v-btn color="primary" @click="parsePlayers">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "PlayerList",
  data() {
    return {
      search: "",
      headers: [
        { text: "Id", value: "id" },
        { text: "Player", value: "name" },
        { text: "Gender", value: "gender" },
        { text: "Fixed Table", value: "table" },
        { text: "Actions", value: "name", sortable: false }
      ],
      dialog: false,
      bulkEdit: false,
      players: [],
      rawPlayers: null,

      editedIndex: -1,
      editedItem: {
        id: 0,
        name: "",
        gender: "",
        table: null
      },
      defaultItem: {
        id: 0,
        name: "",
        gender: "",
        table: null
      }
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.players = this.$store.state.players;
    },
    cancelBulkEdit() {
      this.bulkEdit = false;
    },
    showBulkEdit() {
      this.rawPlayers = this.players
        .map(item => {
          return item.id + ", " + item.name + " , " + item.gender;
        })
        .join("\n");
      this.bulkEdit = true;
    },

    editItem(item) {
      this.editedIndex = this.players.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.players.indexOf(item);
      confirm("Are you sure you want to delete this player?") &&
        this.players.splice(index, 1);

      this.$store.dispatch("updatePlayers", this.players);
    },

    importPlayers() {
      confirm("Are you sure you want to start over?") && this.parsePlayers();
      this.closeImport();
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.players[this.editedIndex], this.editedItem);
      } else {
        this.editedItem.id =
          1 +
          this.players.reduce((accumulator, currentValue) => {
            return Math.max(accumulator, currentValue.id);
          }, 0);
        this.players.push(this.editedItem);
      }
      this.$store.dispatch("updatePlayers", this.players);
      this.close();
    },
    parsePlayers() {
      this.players = this.rawPlayers
        .split("\n")
        .map(row => row.split(/\t|,/))
        .filter(row => row.length == 3)
        .map(data => {
          return {
            id: data[0].trim(),
            name: data[1].trim(),
            gender: data[2].trim()
          };
        });
      this.$store.dispatch("updatePlayers", this.players);
      this.bulkEdit = false;
    }
  }
};
</script>