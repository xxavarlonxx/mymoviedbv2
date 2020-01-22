<template>
    <v-dialog max-width="290" :value="dialog" persistent >
        <v-toolbar color="error" dark flat>
            <v-toolbar-title>
                <div class="title">{{ title }}</div>
            </v-toolbar-title>
        </v-toolbar>
        <v-card>
            <v-card-text>{{ text}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat  @click="onNo">No</v-btn>
                <v-btn color="error" @click="onYes">Yes</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    computed: {
        dialog(){
            return this.$store.getters.confirmDialog
        }
    },
    props: ['title', 'text'],
    methods: {
        onYes(){
            this.$emit('confirmclicked', true)
        },
        onNo(){
            this.$emit('confirmclicked', false)
        }
    }

}
</script>

<style>

</style>
