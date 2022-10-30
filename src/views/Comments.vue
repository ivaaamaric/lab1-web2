<template>
    <div>
        <h2>Comments on {{ home }} vs. {{ visitor }}:</h2>
        <div v-for="comment in oldComments" :key="comment">
            <p>{{ comment.user }} said: {{ comment.comment }}
                <img v-if="user.role == admin" @click="deleteComment(comment)"
                    src="../assets/delete.png" height="25" />
            </p>
        </div>
        <div v-for="comment in allLocalComments?.filter((comment) => comment.gameId == this.$route.params.id)"
            :key="comment">
            <p>{{ comment.user }} said: {{ comment.comment }}
                <img v-if="comment.user == user.name || user.role == admin" @click="deleteComment(comment)"
                    src="../assets/delete.png" height="25" />
                <img v-if="comment.user == user.name" @click="updateComment(comment)" src="../assets/edit.png"
                    height="25" />
            </p>
        </div>
    </div>
    <div>
        <textarea v-model="input" />
    </div>
    <button @click="addComment(input)">Have your say</button>
</template>
  
<script>
import json from '../json/comments.json'
import { useAuth0 } from '@auth0/auth0-vue';

export default {
    data() {
        const auth0 = useAuth0()
        return {
            home: this.$route.params.home,
            visitor: this.$route.params.visitor,
            oldComments: json.comments.filter((comment) => comment.gameId == this.$route.params.id),
            allLocalComments: JSON.parse(window.localStorage.getItem('comments')),
            input: "",
            editingMode: false,
            editingComment: null,
            user: auth0.user
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
            if (comment.user != this.user.name) {
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