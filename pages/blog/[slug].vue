<script setup lang="ts">
  import Blog from "~/models/Blog"

  const route = useRoute();
  const lastSeparatorIndex = (route.params.slug as string).lastIndexOf("-");
  const slug = (route.params.slug as string).slice(0, lastSeparatorIndex);
  const blogId = (route.params.slug as string).slice(lastSeparatorIndex + 1);

  const blog: Blog = {
    id: "",
    created: 0,
    title: "",
    slug: "",
    metaTitle: "",
    htmlContent: "",

  }
</script>

<template>
  <div class="container mx-auto py-4">
    <div>{{ blog.title }}</div>
    <div class="flex">
      <div>
        
      </div>

      <!-- Share Buttons -->
      <div></div>
    </div>
  </div>
</template>

<style scoped>

</style>