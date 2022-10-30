<template>
    {{teams}}
</template>
  
<script>
import json from '../json/nba_2021_database.json'

export default {
    data() {
        var scores = {}
        var points = {}
        for (var game in json.g) {
            if (scores[game.h.tn] == undefined && game.h.s > game.v.s) {
                scores[game.h.tn] = 1
            } else if (game.h.s > game.v.s) {
                scores[game.h.tn] += 1
            }

            if (scores[game.v.tn] == undefined && game.h.s < game.v.s) {
                scores[game.v.tn] = 1
            } else if (game.h.s < game.v.s) {
                scores[game.v.tn] += 1
            }

            if (points[game.h.tn] == undefined) {
                points[game.h.tn] = game.h.s - game.v.s
            } else {
                points[game.h.tn] += game.h.s - game.v.s
            }

            if (points[game.v.tn] == undefined) {
                points[game.v.tn] = game.v.s - game.h.s
            } else {
                points[game.v.tn] += game.v.s - game.h.s
            }
        }

        var items = Object.keys(scores).map((key) => { return [key, scores[key], points[key]] })
        items.sort((first, second) => { return first[1] - second[1] != 0 ? first[1] - second[1] : first[2] - second[2] })

        return {
            teams: items
        }
    }
}
</script>