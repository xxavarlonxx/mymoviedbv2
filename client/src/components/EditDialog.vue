<template>
    <v-dialog max-width="300" :value="dialog" persistent>
        <v-toolbar flat color="primary" dark>
            <v-toolbar-title>
                <div class="title">Edit</div>
            </v-toolbar-title>
        </v-toolbar>
        <v-card>
            <v-card-text>
                <v-combobox
                    v-model="currentMedium"
                        :items="items"
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
        items(){
            return this.$store.getters.mediums
        },
        dialog(){
            return this.$store.getters.editDialog
        }
    },
    methods: {
        onCancel(){
            this.$store.commit('toggleEditDialog')
        },
        onSave(){
            this.$emit('clickedsave', this.currentMedium)
            this.$store.commit('toggleEditDialog')
        }
    }

}
</script>

<style>

</style>
