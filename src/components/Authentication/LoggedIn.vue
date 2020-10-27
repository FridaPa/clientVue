<template>
    <div>
        
    </div>
</template>

<script>
    import Axios from 'axios'
    export default {
        name: "LoggedIn",
        mounted() {
            const token = localStorage.getItem('adal.idtoken');
            Axios.defaults.headers.common['Authorization'] = token;
        }
    
    }
</script>

<style scoped>

</style>