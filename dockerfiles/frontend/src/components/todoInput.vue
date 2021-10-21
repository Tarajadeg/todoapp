<template>
    <div class="flex flex-row items-center rounded-lg shadow-lg w-full h-16 bg-gray-700 px-4">
        <input type="text"
               placeholder="What do you need to do today?"
               :value="modelValue"
               @input="$emit('update:modelValue', $event.target.value)"
               @keypress.enter="submitTodo"
               class="text-white placeholder-opacity-40 bg-transparent w-full text-2xl text-center font-kanit font-extralight focus:outline-none"
        />
        <button class="flex items-center justify-center bg-blue-500 rounded-lg shadow-lg p-2" @click="submitTodo">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    name: "todoInput",
    props: {
        modelValue: String
    },
    methods: {
        submitTodo: function () {
            if (this.modelValue.trim() !== '') {
                this.$emit('addTodo')
                this.$emit('update:modelValue', '')
            }
        }
    }
}
</script>

<style scoped>

</style>