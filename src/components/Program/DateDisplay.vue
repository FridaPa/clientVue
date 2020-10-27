<template>
    <span>
        {{date.getFullYear()}}-{{date.getMonth() + 1}}-{{date.getDate()}}
    </span>
</template>

<script>
export default {
    props: ['date']
}
</script>