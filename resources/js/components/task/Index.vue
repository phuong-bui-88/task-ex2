<template>
    <div class="row">
        <div class="col-12 my-3">
            <ul class="nav nav-pills">
            <li class="nav-item">
                <a class="nav-link position-relative" :class="[(taskStatus === ALL_STATUS) ? 'active' : '']" href="#" @click.prevent="activeTaskTab(ALL_STATUS)">
                    All
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{ allCount }}
                    </span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link position-relative" :class="[(taskStatus === OVER_DATE_STATUS) ? 'active' : '']" href="#" @click.prevent="activeTaskTab(OVER_DATE_STATUS)">
                    Over Date
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{ overDateCount }}
                    </span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link position-relative" :class="[(taskStatus === REMAIN_STATUS) ? 'active' : '']" href="#" @click.prevent="activeTaskTab(REMAIN_STATUS)">
                    Remain
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{ remainCount }}
                    </span>
                </a>
            </li>
        </ul>
        </div>
    </div>
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
import GlobalConst from "../../consts/base.js"

export default {
    components: {
        TaskCreate
    },
    emits: ['clickedItem'],
    setup() {
        const { tasks, taskStatus, remainCount, allCount, overDateCount, getTasks } = useTask()
        const isTaskIndexRoute = ref(false)
        onMounted(getTasks)

        return { tasks, taskStatus, remainCount, allCount, overDateCount, getTasks, isTaskIndexRoute }
    },
    created() {
        this.ALL_STATUS = GlobalConst.ALL_STATUS
        this.REMAIN_STATUS = GlobalConst.REMAIN_STATUS
        this.OVER_DATE_STATUS = GlobalConst.OVER_DATE_STATUS

        this.$watch(
            () => this.$route.name,
            (routeName) => {
                this.isTaskIndexRoute = (routeName == 'task.index')
            },
            { immediate: true }
        )
    },
    methods: {
        activeTaskTab(status) {
            this.taskStatus = status
            this.getTasks()
        }
    }
}

</script>
