<template>
    <div class="row">
        <div class="col-9">
            <router-view @clicked-item="onTaskClick"></router-view>
        </div>
        <div class="col-3">
            <router-view name="right" :isSamePage="isSamePage" @reset-same-page="isSamePage = $event"></router-view>
        </div>
    </div>
</template>

<script>

import {useRoute} from "vue-router"

export default {
    setup() {
        const route = useRoute()
        return { route }
    },
    data() {
        return {
            isSamePage: false,
        }
    },
    methods: {
        onTaskClick(id) {
            this.isSamePage = (id == this.route.params.taskId)
        }
    }
}
</script>
