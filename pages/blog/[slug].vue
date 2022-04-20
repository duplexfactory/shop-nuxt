<script setup lang="ts">
  import Blog from "~/models/Blog"
  import dayjs from "dayjs";

  const route = useRoute();
  const lastSeparatorIndex = (route.params.slug as string).lastIndexOf("-");
  const slug = (route.params.slug as string).slice(0, lastSeparatorIndex);
  const blogId = (route.params.slug as string).slice(lastSeparatorIndex + 1);

  const blog: Blog = {
    id: "",
    created: 1650422141,
    title: "This is a title",
    slug: "",
    metaTitle: "",
    htmlContent: "",

  }
  const created = dayjs(blog.created * 1000).format('DD/MM/YYYY');
</script>

<template>
  <div class="container mx-auto py-4">
    <div class="grid grid-cols-12">
      <div class="col-start-3 col-span-8">
        <div class="text-3xl">{{ blog.title }}</div>
        <div class="flex justify-between text-sm mt-2">
          <div class="text-gray-500">
            {{ created }}
          </div>

          <!-- Share Buttons -->
          <div class="text-sm">
            <button class="social-btn iconbox spr-whatsapp"></button>
            <button class="social-btn iconbox spr-facebook-squared"></button>
            <button class="social-btn iconbox spr-link"></button>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<style scoped>

.social-btn {
  @apply rounded-full border border-pink-400 text-pink-400 p-1 ml-1;
}

</style>