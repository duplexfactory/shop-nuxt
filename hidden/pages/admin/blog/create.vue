<template>
  <div>
    <textarea id="myTextarea"></textarea>
    <button @click="save">Save</button>
  </div>
</template>

<script type="ts" setup>

const htmlContent = ref("");

function save() {
  htmlContent.value = tinymce.get("myTextarea").getContent();
}

</script>

<script type="ts">
export default {
  name: "create-blog",
  mounted() {
    tinymce.init({selector:'textarea'});
  }
}
</script>

<style scoped>

</style>