import { ref } from 'vue'
import axios  from "axios"
import GlobalConst from './../consts/base.js'

const tasks = ref({})
const remainCount = ref(0)
const allCount = ref(0)
const overDateCount = ref(0)
const taskStatus = ref(GlobalConst.ALL_STATUS)

export default function useTask() {
    const task = ref({})

    const getTasks = async (queryTask = '', hasIndex = true) => {
        let status = ''
        status = (GlobalConst.ALL_STATUS == taskStatus.value) ? '?status=0' : status
        status = (GlobalConst.REMAIN_STATUS == taskStatus.value) ? '?status=1' : status
        status = (GlobalConst.OVER_DATE_STATUS == taskStatus.value) ? '?status=2' : status

        hasIndex = (hasIndex) ? '' : '&index=0'
        queryTask = queryTask + status + hasIndex

        let result = await axios.get('/api/tasks' + queryTask)
        tasks.value = result.data.data
        allCount.value = result.data.allCount
        remainCount.value = result.data.remainCount
        overDateCount.value = result.data.overDateCount
    }

    const getTask = async (taskId) => {
        let result = await axios.get('/api/tasks/' + taskId)

        task.value = result.data.data
    }

     const storeTask = async (task) => {
        let result = await axios.post('/api/tasks', task)
        result = result.data.data
        tasks.value.push(result)

        return result
    }

    const updateTask = async (task, includeTasks = false) => {
        let result = await axios.put('/api/tasks/' + task.id, task)
        if (includeTasks && result.status == 200) {
            tasks.value.forEach((item, index) => {
                if (item.id === task.id) {
                    tasks.value[index] = task
                }
            })
        }
    }

    const deleteTask = async (taskId, includeTasks = false) => {
        let result = await axios.delete('/api/tasks/' + taskId)
        if (includeTasks && result.status == 200) {
            tasks.value.forEach((item, index) => {
                if (item.id == taskId) {
                    tasks.value.splice(index, 1)
                }
            })
        }
    }

    return { tasks, task, taskStatus, remainCount, allCount, overDateCount, getTask, getTasks, updateTask, deleteTask, storeTask }
}
