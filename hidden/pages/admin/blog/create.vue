<template>
  <div class="container mx-auto pb-8">
    <div class="mb-4">
      <button class="btn btn-primary mr-4" @click="loadTiny">Load TinyMCE</button>
      <button class="btn btn-primary" @click="save">Save</button>
    </div>

    <textarea id="myTextarea"></textarea>
  </div>
</template>

<script type="ts" setup>

useMeta({
  script: [
    {type: 'text/javascript', src: "/js/tinymce/js/tinymce/tinymce.min.js"}
  ]
})

const htmlContent = ref("");

function loadTiny() {
  tinymce.init({selector:'#myTextarea'});
}

function save() {
  htmlContent.value = tinymce.get("myTextarea").getContent();
  console.log(htmlContent.value);
}

// useMounted(() => {
//   this.$nextTick(async () => {
//     await tinymce.init({selector:'#myTextarea'});
//   })
// })

</script>

<style scoped>

</style>