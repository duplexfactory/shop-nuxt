<template>
  <div class="container mx-auto pb-8">

    <div class="mb-4 text-right">
      <button class="btn btn-primary" @click="save" :disabled="isSubmitting">Save</button>
    </div>

    <div class="mb-4 flex">
      <input v-model="blog.title" class="flex-1 text-input-primary" type="text" name="title" placeholder="Title">
    </div>

    <div class="mb-4 flex">
      <input v-model="blog.slug" class="flex-1 mr-4 text-input-primary" type="text" name="slug" placeholder="Slug">
      <input v-model="blog.metaDesc" class="flex-1 text-input-primary" type="text" name="metaDesc" placeholder="Meta Description">
    </div>

    <div class="mb-4">
      <button class="btn btn-primary mr-4" @click="loadTiny">Load TinyMCE</button>
    </div>

    <textarea id="myTextarea"></textarea>
  </div>
</template>

<script setup lang="ts">

const nuxt = useNuxtApp();

useMeta({
  script: [
    {type: 'text/javascript', src: "/js/tinymce/js/tinymce/tinymce.min.js"}
  ]
})

const blog = ref({
  title: "",
  slug: "",
  metaDesc: "",
  htmlContent: "",
})
const isSubmitting = ref(false);

function loadTiny() {
  tinymce.init({selector:'#myTextarea'});
}

async function save() {

  blog.value.htmlContent = tinymce.get("myTextarea").getContent();

  // Submit
  isSubmitting.value = true;
  const {data, error} = await useFetch("/api/blog", {method: "POST", body: {
      ...blog.value
    }});
  isSubmitting.value = false;

  // Error
  if (error.value) {
    nuxt.vueApp.$toast.error("儲存失敗！", {position: "top"});
    return;
  }

  // Reset
  blog.value = {
    title: "",
    slug: "",
    metaDesc: "",
    htmlContent: "",
  }

  nuxt.vueApp.$toast.success("儲存成功！", {position: "top"});
}

// useMounted(() => {
//   this.$nextTick(async () => {
//     await tinymce.init({selector:'#myTextarea'});
//   })
// })

</script>
