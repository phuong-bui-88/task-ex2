import { ref } from 'vue'
import axios  from "axios"


const tasks = ref({})

export default function useTask() {
    const task = ref({})

    const getTasks = async () => {
        axios.get('/api/tasks')
            .then(response => {
                tasks.value = response.data.data
            })
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

    return { tasks, task, getTask, getTasks, updateTask, deleteTask, storeTask }
}
