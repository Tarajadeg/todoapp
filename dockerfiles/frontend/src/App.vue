<template>
    <div class="w-screen h-screen bg-gray-800">
        <div class="max-w-xl mx-auto pt-16">
            <todo-input
                    v-model="todoInputValue"
                    @addTodo="addTodo"
            />
        </div>
        <div class="max-w-xl mx-auto mt-4 bg-gray-700 rounded-lg p-4 shadow-lg space-y-2">
            <p v-if="todos.length === 0" class="text-xl text-white text-center font-kanit font-extralight">
                No todos here
            </p>
            <todo-item
                    v-else
                    v-for="todo in todos"
                    :key="todo.uuid"
                    :uuid="todo.uuid"
                    :todo-text="todo.todoText"
                    v-model:todo-complete="todo.todoComplete"
            />
        </div>
    </div>
</template>

<script>
import TodoInput from "./components/todoInput";
import TodoItem from "./components/todoItem";

export default {
    name: 'App',
    components: {
        TodoItem,
        TodoInput
    },
    data: () => ({
        todoInputValue: '',
        todos: []
    }),
    methods: {
        addTodo: function () {
            this.$socket.client.emit('addTodo', {
                todoText: this.todoInputValue,
                todoComplete: false
            })
        }
    },
    sockets: {
        connected: function (args) {
            console.log('connected')
            console.log(args.todoList)
            if (Array.isArray(args.todoList)) {
                this.todos = args.todoList
            }
        },
        updateTodos: function (args) {
            console.log('update todos')
            console.log(args.todoList)
            if (Array.isArray(args.todoList)) {
                this.todos = args.todoList
            }
        },
        addTodo: function (todo) {
            console.log('adding todo')
            console.log(todo)
            this.todos.push(todo)
        }
    }

}
</script>

<style>
</style>
