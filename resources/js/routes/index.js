import { createRouter, createWebHistory } from "vue-router/dist/vue-router"

import Home from "../components/Home.vue"
import Task from "../components/task/Task.vue"
import TaskIndex from "../components/task/Index.vue"
import TaskEdit from "../components/task/Edit.vue"

const routes = [
    {
        name: 'home',
        component: Home,
    },
    {
        component: Task,
        children: [
            {
                path: '/tasks',
                name: 'task.index',
                components: {
                    default: TaskIndex
                }
            },
            {
                path: '/tasks/:taskId/edit',
                name: 'task.edit',
                components:  {
                    default: TaskIndex,
                    right: TaskEdit
                }
            }
        ]
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})
