<template>
    <div class="flex flex-row items-center justify-between rounded-lg shadow bg-gray-600 p-2.5">
        <p class="text-xl text-white font-kanit font-extralight transition-opacity" :class="{ 'line-through opacity-40' : todoComplete }">
            {{ todoText }}
        </p>
        <input type="checkbox" ref="todoStatus" :checked="todoComplete" @change="updateTodo">
    </div>
</template>

<script>
export default {
    name: "todoItem",
    props: {
        uuid: String,
        todoText: String,
        todoComplete: Boolean
    },
    methods: {
        updateTodo: function () {
            this.$emit('update:todo-complete', this.$refs.todoStatus.checked)
            this.$socket.client.emit('updateTodo', {
                uuid: this.uuid,
                todoComplete: this.$refs.todoStatus.checked
            })
        }
    },
}
</script>

<style scoped>

</style>