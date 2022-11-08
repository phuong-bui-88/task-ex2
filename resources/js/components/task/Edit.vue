<template>
    <div class="d-none" data-bs-toggle="offcanvas" href="#edit-task" ref="showTaskOnMount">First Task Click</div>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="edit-task" data-bs-scroll="true" data-bs-backdrop="false" ref="editTask">
        <div class="offcanvas-body">
            <div class="col-md-12">
                <a class="d-none" data-bs-dismiss="offcanvas" ref="close">Close</a>
                <button class="btn btn-secondary dropdown-toggle" type="button" id="edit-task-dropdown" data-bs-toggle="dropdown">
                    ...
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" @click="deleteTask" data-db-dismiss="offcanvas">Delete </a></li>
                </ul>
            </div>

            <div  class="row">
                <div class="col-12">
                    <label class="form-label">Title</label>
                    <input v-model="task.title" id="task-title" class="form-control" type="text" @blur="updateTask">
                </div>

                <div class="col-12">
                    <label class="form-label">Description</label>
                    <textarea rows="3" v-model="task.description" id="task-description" class="form-control" type="text" @blur="updateTask"></textarea>
                </div>

            </div>
        </div>
    </div>
</template>

<script>

import {ref} from "vue";
import useTask from "../../composables/task.js"
import { useRoute } from "vue-router"

export default {
    props: {
        isSamePage: [Boolean, String]
    },
    emits: ['resetSamePage'],
    setup() {
        const { tasks, task, getTask, updateTask, deleteTask } = useTask()
        const  { isCloseTask, isOpenTask } = ref(false)
        const route = useRoute()
        return { tasks, task, getTask, updateTask, deleteTask, route, isOpenTask, isCloseTask }
    },
    created() {
        this.$watch(
            () => this.$route.params,
            (toParams, preParams) => {
                if (toParams.taskId) {
                    this.getTask(toParams.taskId)

                }
            },
            { immediate: true }
        ),
        this.$watch(
            () => this.isSamePage,
            (newVal, oldVal) => {
                if (newVal) {
                    if (this.isOpenTask == true) {
                        this.onCloseTaskAction()
                    }
                    else {
                        this.isOpenTask = true
                    }

                    this.$emit('resetSamePage', false)
                }
            }
        )
    },
    methods: {
        updateTask() {
            this.updateTask(this.task, true)
        },
        deleteTask() {
            this.deleteTask(this.task.id, true)
            this.$router.push({ name: 'task.index' })
        },
        closingTask(event) {
            if (this.isCloseTask == true) {
                return ;
            }

            if (this.isSamePage == false) {
                event.preventDefault()
            }
        },
        onCloseTaskAction() {
            this.isCloseTask = true
            this.$refs.close.click()
            this.isCloseTask = false
            this.isOpenTask = false
        }
    },
    mounted() {
        this.$refs.showTaskOnMount.click()
        this.$refs.editTask.addEventListener('hide.bs.offcanvas', this.closingTask.bind())
    }
}
</script>
