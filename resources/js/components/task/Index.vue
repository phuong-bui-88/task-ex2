<template>
    Task index
    <div v-for="(item, index) in tasks" class="list-group-item">
        <router-link :to="{name: 'task.edit', params: { taskId: item.id}}" @click="$emit('clickedItem', item.id)">
            <div data-bs-toggle="offcanvas" href="#edit-task" class="row">
                <div class="col-2">{{ item.id }} </div>
                <div class="col-10">{{ item.title }}</div>
            </div>
        </router-link>
    </div>

    <TaskCreate />

    <div v-if="isTaskIndexRoute" class="d-none">
        <div class="offcanvas offcanvas-end" tabindex="-1" id="edit-task" data-bs-scroll="true" data-bs-backdrop="false"></div>
    </div>

</template>

<script>

import {onMounted, ref} from "vue"
import useTask from "../../composables/task.js"
import TaskCreate from "../task/Create.vue"


export default {
    components: {
        TaskCreate
    },
    emits: ['clickedItem'],
    setup() {
        const { tasks, getTasks } = useTask()
        const isTaskIndexRoute = ref(false)
        onMounted(getTasks)

        return { tasks, getTasks, isTaskIndexRoute }
    },
    created() {
        this.$watch(
            () => this.$route.name,
            (routeName) => {
                this.isTaskIndexRoute = (routeName == 'task.index')
            },
            { immediate: true }
        )
    }
}

</script>
