<script setup lang="ts">
  import {abortNavigation} from "#app";
  import Blog from "~/models/Blog";

  const route = useRoute();

  const blogId = (route.params.id as string);

  if (Number(blogId) === Number.NaN) {
    // Bad ID
    abortNavigation();
  }

  const {data, error} = await useLazyFetch("/api/blog", {params: {id: blogId}});

  if (!!error && !!error.value) {
    // API error
    abortNavigation();
  }

  const blog = computed<Blog>(() => {
    if (data.value) {
      return data.value.blog;
    }
    return null
  })

</script>

<template>
  <div class="container mx-auto pb-8">
    <LazyBlogEditor :editBlog="blog"></LazyBlogEditor>
  </div>
</template>


<style scoped>

</style>