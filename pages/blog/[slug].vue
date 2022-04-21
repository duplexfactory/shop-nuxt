<script setup lang="ts">
  import Blog from "~/models/Blog"
  import dayjs from "dayjs";
  import {abortNavigation} from "#app";

  const config = useRuntimeConfig();
  const route = useRoute();

  // Extract blog ID
  const lastSeparatorIndex = (route.params.slug as string).lastIndexOf("-");
  const blogId = (route.params.slug as string).slice(lastSeparatorIndex + 1);

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
    return {
      id: "",
      created: 0,
      title: "",
      slug: "",
      metaDesc: "",
      htmlContent: "",
    };
  })
  const created = dayjs(blog.value.created).format('DD/MM/YYYY');

  const structuredPath = `/blog/${blog.value.slug}-${blog.value.id}`;
  if (route.path !== structuredPath) {
    // 302 redirect
    navigateTo(structuredPath);
  }

  import edjsHTML from "editorjs-html";

  const parser = edjsHTML();
  // function createElementFromHTML(htmlString) {
  //   const div = document.createElement('div');
  //   div.innerHTML = htmlString.trim();
  //
  //   // Change this to div.childNodes to support multiple top-level nodes.
  //   return div.firstChild as HTMLElement;
  // }
  // const htmlContent = parser.parse(blog.value.htmlContent).map((s) => {
  //   const e = createElementFromHTML(s);
  //   const alignment = b.data.alignment ?? b.tunes?.alignmentTune?.alignment ?? "left";
  //   e.setAttribute("style", `text-align: ${alignment}`);
  // })
  const htmlContent = blog.value.htmlContent.blocks.map((b) => {
    const alignment = b.data.alignment ?? b.tunes?.alignmentTune?.alignment ?? "left"
    const style = `style="text-align: ${alignment}"`;
    return `<div ${style}>${parser.parseBlock(b)}</div>`
  }).join("");

  // Meta
  useMeta(computed(() => {
    return {
      title: `${blog.value.title} | IG Shop 推薦及評論平台 | Shoperuse`,
      meta: [
        {name: 'description', hid: 'description', content: blog.value.metaDesc},
        {property: 'og:title', hid: 'og:title', content: `${blog.value.title} | IG Shop 推薦及評論平台 | Shoperuse`},
        {property: 'og:url', hid: 'og:url', content: `${config.DOMAIN}/blog/${blog.value.slug}-${blog.value.id}`},
        // {property: 'og:image', hid: 'og:image', content: `${page.value !== null ? page.value.profilePicUrl : ""}`},
        // {property: 'og:image:height', hid: 'og:image:height', content: '150'},
        // {property: 'og:image:width', hid: 'og:image:width', content: '150'},
        {property: 'og:description', hid: 'og:description', content: blog.value.metaDesc}
      ]
    }
  }))
</script>

<template>
  <div class="container mx-auto py-4">
    <div class="grid grid-cols-12">
      <div v-if="blog" class="col-start-3 col-span-8">
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

        <div v-html="htmlContent"></div>

      </div>
    </div>
  </div>
</template>

<style scoped>

.social-btn {
  @apply rounded-full border border-pink-400 text-pink-400 p-1 ml-1;
}

</style>
