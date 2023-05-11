<template>
    <div class="float-lg-start float-sm-end">
        <VCalendar :attributes="attributes" />
    </div>
</template>

<script>

import useTask from "../../composables/task.js";
import { onMounted } from "vue";

export default {
    setup() {
        const { tasks, getTasks } = useTask()
        onMounted(getTasks)

        return { tasks }
    },
    computed: {
        attributes() {
            if (!this.tasks.length) {
                return
            }

            const todos = []

            this.tasks.forEach((item, index) => {
                let date = new Date(item.start_date)
                let year = date.getFullYear()
                let month = date.getMonth()
                let day = date.getDate()

                todos.push({
                    description: item.title,
                    isComplete: true,
                    dates: new Date(year, month, day),
                    color: 'red'
                })
            })

            const todosCalendar = todos.map(todo => ({
                dates: todo.dates,
                dot: {
                    color: todo.color,
                    class: todo.isComplete ? 'opacity-75' : '',
                },
                popover: {
                    label: todo.description,
                },
                customDate: todo,
            }))

            return [
                {
                    key: 'today',
                    highlight: true,
                    dates: new Date(),
                },
                ...todosCalendar
            ]
        }
    }
}
</script>
