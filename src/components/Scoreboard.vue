<template>
  <v-container grid-list-md>
    <v-layout wrap>
      <v-flex md6>
        <v-data-table :items="partOne" :headers="headers" hide-actions>
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex md6>
        <v-data-table :items="partTwo" :headers="headers" hide-actions>
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [{ text: "Player", value: "name" }],
      sortedList: []
    };
  },
  created() {
    this.sortedList = this.$store.state.players.sort((a, b) => {
      return a < b ? 1 : -1;
    });
  },
  computed: {
    partOne() {
      return this.sortedList.filter((val, idx,list) => {
        return idx < list.length / 2;
      });
    },

    partTwo() {
      return this.sortedList.filter((val, idx,list) => {
        return idx >= list.length / 2;
      });
    }
  }
};
</script>

<style>
</style>
