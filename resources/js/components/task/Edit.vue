<template>
    <div class="d-none" data-bs-toggle="offcanvas" href="#edit-task" ref="showTaskOnMount">First Task Click</div>

    <div class="offcanvas offcanvas-end" tabindex="-1" id="edit-task" data-bs-scroll="true" data-bs-backdrop="false" ref="editTask">
        <div class="offcanvas-body">
            <div class="mb-3">
                <a class="d-none" data-bs-dismiss="offcanvas" ref="close">Close</a>
                <button class="btn btn-secondary dropdown-toggle" type="button" id="edit-task-dropdown" data-bs-toggle="dropdown">
                    ...
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" @click="deleteTask" data-db-dismiss="offcanvas">Delete </a></li>
                </ul>
            </div>

            <div class="mb-3">
                <label class="form-label">Title</label>
                <input v-model="task.title" id="task-title" class="form-control" type="text" @blur="updateTask">
            </div>

            <div class="mb-3">
                <label class="form-label">Description</label>
                <QuillEditor theme="snow" ref="quillEditor" @focusout="updateTask"/>
            </div>

            <div class="mb-3">
                <label class="form-label">Date</label>
                <DatePicker v-model="task.start_date" @dayclick="updateTask">
                    <template v-slot="{inputValue, inputEvents}">
                        <input class="bg-white border px-2 py-1 rounded" :value="inputValue" v-on="inputEvents" />
                    </template>
                </DatePicker>
            </div>

            <div class="mb-3">
                <file-pond
                    name="test"
                    ref="pond"
                    label-idle="Drop files here or <span class='filepond--label-action'>Browse</span>"
                    allow-multiple="true"
                    v-bind:files="myFiles"
                    :server="{load, process, revert, remove}"
                    />
            </div>
        </div>
    </div>
</template>

<script>
import {ref} from "vue";
import useTask from "../../composables/task.js"
import { useRoute } from "vue-router"
import { removeFilePond, uploadFilePond } from "../../composables/file_pond.js";
import {DatePicker} from "v-calendar";
import DateFilter from '../../filters/date.js'

export default {
    components: {DatePicker},
    props: {
        isSamePage: [Boolean, String]
    },
    emits: ['resetSamePage'],
    data() {
        let myFiles = []
        return { myFiles }
    },
    setup() {
        const { tasks, task, getTask, updateTask, deleteTask } = useTask()
        const  { isCloseTask, isOpenTask } = ref(false)
        const route = useRoute()
        return { tasks, task, getTask, updateTask, deleteTask, route, isOpenTask, isCloseTask }
    },
    created() {
        this.$watch(
            () => this.$route.params,
            (toParams) => {
                if (toParams.taskId) {
                    this.getTask(toParams.taskId)
                }
            },
            { immediate: true }
        )
        this.$watch(
            () => this.task,
            (newVal) => {
                if (newVal) {

                    let description = (newVal.description) ?? ''
                    this.$refs.quillEditor.setHTML(newVal.description)

                    let myFiles = []
                    newVal.documents.map(function(value, key) {
                        myFiles.push({
                            source: value,
                            options: { type: 'local' }
                        })
                    })

                    this.myFiles = myFiles
                }
            }
        )
        this.$watch(
            () => this.isSamePage,
            (newVal) => {
                if (newVal) {
                    if (this.isOpenTask === true) {
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
        load(url, load, error, progress, abort, headers) {
            fetch(url)
                .then(res => {
                    res.blob().then(load)
                })
        },
        revert(uniqueField, load, error) {
            removeFilePond(uniqueField)
            load()
        },
        process(fileName, file, metadata, load, error, progress, abort) {
            const field = {
                name: 'task',
                id: this.task.id
            }

            uploadFilePond(file, progress, field)
                .then(url => {
                    load(url)
                })
        },
        remove(source, load, error) {
            removeFilePond(source)
            load()
        },
        updateTask() {
            this.task.start_date = DateFilter(this.task.start_date)
            this.task.description = this.$refs.quillEditor.getHTML()
            this.updateTask(this.task, true)
        },
        deleteTask() {
            this.deleteTask(this.task.id, true)
            this.$router.push({ name: 'task.index' })
        },
        closingTask(event) {
            if (this.isCloseTask === true) {
                return ;
            }

            if (this.isSamePage === false) {
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
