<template>
  <div>
    <h2>Checkout some past and upcoming games:</h2>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Location</th>
          <th>Home</th>
          <th>Home score</th>
          <th>Visitor score</th>
          <th>Visitor</th>
        </tr>
      </thead>
      <tr v-for="game in games.g" :key="game.gid">
        <td>{{ game.gdte }}</td>
        <td>{{ game.an }}</td>
        <td>{{ game.h.tn }}</td>
        <td>{{ game.h.s }}</td>
        <td>{{ game.v.s }}</td>
        <td>{{ game.v.tn }}</td>
        <td v-if="isAuthenticated">
          <router-link :to="'/comments/' + game.gid + '/' + game.h.tn + '/' + game.v.tn"><img
              src="../assets/comment.png" height="30" /></router-link>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import json from '../json/nba_2021_database.json'
import { useAuth0 } from '@auth0/auth0-vue';
export default {
  data() {
    const auth0 = useAuth0()
    return {
      isAuthenticated: auth0.isAuthenticated,
      games: json
    }
  }
}
</script>