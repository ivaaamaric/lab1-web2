<template>
    <div>
        <h2>Comments on {{ home }} vs. {{ visitor }}:</h2>
        <div v-for="comment in oldComments" :key="comment">
            <p>{{ comment.user }} said: {{ comment.comment }}
                <img v-if="user?.email == adminEmail" @click="deleteComment(comment)" src="../assets/delete.png"
                    height="25" />
            </p>
        </div>
        <div v-for="comment in allLocalComments?.filter((comment) => comment.gameId == this.$route.params.id)"
            :key="comment">
            <p>{{ comment.user }} said: {{ comment.comment }}
                <img v-if="comment.user == user?.name || user?.email == adminEmail" @click="deleteComment(comment)"
                    src="../assets/delete.png" height="25" />
                <img v-if="comment.user == user?.name" @click="updateComment(comment)" src="../assets/edit.png"
                    height="25" />
            </p>
        </div>
    </div>
    <div>
        <textarea style="width:300px;" height="100" v-model="input" />
    </div>
    <button class="btn btn-primary" @click="addComment(input)">Have your say</button>
</template>
  
<script>
import { useAuth0 } from '@auth0/auth0-vue';

export default {
    data() {
        const auth0 = useAuth0()
        const json = {
            "comments": [
                {
                    "gameId": "0022200081",
                    "user": "Ben",
                    "comment": "One of the best games of the season so far"
                },
                {
                    "gameId": "0022200077",
                    "user": "Josh",
                    "comment": "Had so much fun watching!"
                },
                {
                    "gameId": "0022200077",
                    "user": "Harry",
                    "comment": "The Bulls are the best"
                },
                {
                    "gameId": "0022200078",
                    "user": "Luca",
                    "comment": "Great game!"
                },
                {
                    "gameId": "0022200078",
                    "user": "Ally",
                    "comment": "Boring game!"
                },
                {
                    "gameId": "0022200079",
                    "user": "Martin",
                    "comment": "Woah! What a dunk!"
                },
                {
                    "gameId": "0022200082",
                    "user": "Garry",
                    "comment": "Curry is the MVP!!!"
                },
                {
                    "gameId": "0022200082",
                    "user": "Susan",
                    "comment": "Fun game!"
                }
            ]
        }
        return {
            home: this.$route.params.home,
            visitor: this.$route.params.visitor,
            oldComments: json.comments.filter((comment) => comment.gameId == this.$route.params.id),
            allLocalComments: JSON.parse(window.localStorage.getItem('comments')),
            input: "",
            editingMode: false,
            editingComment: null,
            user: auth0.user,
            adminEmail: "admin@user.com"
        }
    },
    methods: {
        addComment(comment) {
            if (this.editingMode && this.editingComment != null) {
                var index = this.allLocalComments.indexOf(this.editingComment)
                if (index > -1) {
                    this.allLocalComments[index].comment = this.input
                    const data = JSON.stringify(this.allLocalComments)
                    window.localStorage.setItem('comments', data)
                }
                this.input = ""
                this.editingMode = false
                this.editingComment = null
                return
            }

            var local = window.localStorage.getItem('comments')
            var localComments = JSON.parse(local)
            if (localComments == null || localComments == undefined) localComments = []
            localComments.push({ gameId: this.$route.params.id, user: this.user.name, comment: comment })
            const data = JSON.stringify(localComments)
            window.localStorage.setItem('comments', data)
            this.allLocalComments = localComments
            this.input = ""
        },
        deleteComment(comment) {
            if (comment.user != this.user.name || !this.isAdmin) {
                return
            }
            var index = this.allLocalComments.indexOf(comment)
            if (index > -1) {
                this.allLocalComments.splice(index, 1)
                const data = JSON.stringify(this.allLocalComments)
                window.localStorage.setItem('comments', data)
            }
            index = this.oldComments.indexOf(comment)
            if (index > -1) {
                this.oldComments.splice(index, 1)
            }
        },
        updateComment(comment) {
            if (comment.user != this.user.name) {
                return
            }
            this.input = comment.comment
            this.editingMode = true
            this.editingComment = comment
        }
    }
}
</script>