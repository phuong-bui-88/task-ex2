<template>
    <div class="container">
        <div class="row">
            <div class="col-3">
                <MenuRight />
            </div>
            <div class="col-9">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script>
    import MenuRight from "./components/MenuRight.vue"

    export default {
        components: {
            MenuRight
        }
    }

</script>
