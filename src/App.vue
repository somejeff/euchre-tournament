<template>
  <v-app>
    <v-toolbar app dense >
      <v-toolbar-title class="headline">
        <span>Euchre Tournamenter</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/players">Player List</v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>
