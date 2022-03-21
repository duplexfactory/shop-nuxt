<template>
  <div class="container mx-auto pb-8">

    <div class="mb-4 text-right">
      <button class="btn btn-primary" @click="save">Save</button>
    </div>

    <div class="mb-4 flex">
      <input class="flex-1" type="text" name="title" placeholder="Title">
    </div>

    <div class="mb-4 flex">
      <input class="flex-1 mr-4" type="text" name="slug" placeholder="Slug">
      <input class="flex-1" type="text" name="metaTitle" placeholder="Meta Title">
    </div>

    <div class="mb-4">
      <button class="btn btn-primary mr-4" @click="loadTiny">Load TinyMCE</button>
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
input {
  @apply rounded-md border py-2 px-4 text-md;
}

input:focus {
  @apply outline-none border-pink-400;
}

</style>