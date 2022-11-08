<template>
    <div class="row">
        <div class="col-2"></div>
        <div class="col-10">
            <input v-model="initCreateTask.title" @blur="createTask()" id="task-title" class="form-control" type="text" placeholder="create a new task">
        </div>
    </div>
</template>

<script>

import {ref} from "vue";
import useTask from "../../composables/task.js";

export default {
    setup() {
        const initCreateTask = ref({
            title: '',
            description: ''
        })

        const { tasks, storeTask } = useTask()

        return { tasks, storeTask, initCreateTask }
    },
    methods: {
        createTask() {
            if (this.initCreateTask.title.trim() == '') {
                return;
            }

            this.storeTask(this.initCreateTask)
                .then(result => {
                    this.initCreateTask =  {}
                })
        }
    }
}

</script>
