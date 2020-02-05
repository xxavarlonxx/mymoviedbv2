<template>
    <v-dialog max-width="300" :value="visible" persistent>
        <v-toolbar flat color="primary" dark>
            <v-toolbar-title>
                <div class="title">Edit</div>
            </v-toolbar-title>
        </v-toolbar>
        <v-card>
            <v-card-text>
                <v-combobox
                    v-model="currentMedium"
                        :items="mediums"
                        label="Select a medium"
                        required></v-combobox>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat @click="onCancel">Cancel</v-btn>
                <v-btn  color="primary" @click="onSave">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data(){
        return {
            select: ''
        }
    },
    props: ['currentMedium'],
    computed: {
        mediums(){
            return this.$store.getters.mediums
        },
        visible(){
            return this.$store.getters.showEditDialog
        }
    },
    methods: {
        onCancel(){
            this.$store.commit('toggleEditDialog')
        },
        onSave(){
            this.$emit('onSave', this.currentMedium)
            //this.$store.commit('toggleEditDialog')
        }
    }

}
</script>

<style>

</style>
