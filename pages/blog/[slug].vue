<script setup lang="ts">
  import Blog from "~/models/Blog"
  import dayjs from "dayjs";
  import {notFound} from "~/utils/h3Error";

  const config = useRuntimeConfig();
  const route = useRoute();
  const nuxt = useNuxtApp();

  // Extract blog ID
  const lastSeparatorIndex = (route.params.slug as string).lastIndexOf("-");
  const blogId = (route.params.slug as string).slice(lastSeparatorIndex + 1);

  if (Number(blogId) === Number.NaN) {
    // Bad ID
    throwError(notFound);
  }

  const {data, error} = await useLazyFetch("/api/blog", {params: {id: blogId}});

  if (!!error && !!error.value) {
    // API error
    throwError(notFound);
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
  const blocks = blog.value.htmlContent.blocks.map((b) => {
    if (b.type === "mediaCardIGEmbed") {
      return {
        type: "media-card-ig-embed",
        content: b.data.code
      }
    }
    const alignment = b.data.alignment ?? b.tunes?.alignmentTune?.alignment ?? "left"
    let margin = ""
    if (["paragraph", "header"].includes(b.type)) {
      margin = "0px 0px 16px 0px"
    }
    const style = `style="text-align: ${alignment}; margin: ${margin};"`;
    return {
      type: "html",
      content: `<div ${style}>${parser.parseBlock(b)}</div>`
    }
  });

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


  const shareWhatsAppLink = computed(() => {
    const text = `${blog.value.title} | IG Shop 推薦及評論平台 | Shoperuse\n`
        + `${config.DOMAIN}/blog/${blog.value.slug}-${blog.value.id}`;
    const url = new URL("https://api.whatsapp.com/send");
    url.search = new URLSearchParams({text});
    return url.toString();
  });

  const shareFacebookLink = computed(() => {
    const url = new URL("https://www.facebook.com/sharer.php");
    url.search = new URLSearchParams({u: `${config.DOMAIN}/blog/${blog.value.slug}-${blog.value.id}`});
    return url.toString();
  });

  function copyToClipboardClicked() {
    const text = `${blog.value.title} | IG Shop 推薦及評論平台 | Shoperuse\n`
        + `${config.DOMAIN}/blog/${blog.value.slug}-${blog.value.id}`;
    navigator.clipboard.writeText(text);
    nuxt.$toast.success("已成功複製連結。", {position: "top"});
  }
</script>

<template>
  <div class="container mx-auto py-4">
    <div class="grid grid-cols-12">
      <div v-if="blog" class="col-span-12 md:(col-start-3 col-span-8)">
        <div class="text-3xl">{{ blog.title }}</div>
        <div class="flex justify-between text-sm mt-2 mb-4">
          <div class="text-gray-500">
            {{ created }}
          </div>

          <!-- Share Buttons -->
          <div class="text-sm">
            <a :href="shareWhatsAppLink" target="_blank"><span class="social-btn iconbox spr-whatsapp"></span></a>
            <a :href="shareFacebookLink" target="_blank"><span class="social-btn iconbox spr-facebook-squared"></span></a>
            <button @click="copyToClipboardClicked" class="social-btn iconbox spr-link"></button>
          </div>
        </div>

        <template v-for="b in blocks">
          <div v-if="b.type === 'html'" v-html="b.content"></div>
<!--          :username="page.username"-->
          <client-only>
            <LazyMediaCardIGEmbed
                v-if="b.type === 'media-card-ig-embed'"
                class="md:w-1/2 mb-8"
                :post-id="b.content"
                :fixed-aspect-ratio="0"></LazyMediaCardIGEmbed>
          </client-only>
        </template>

      </div>
    </div>
  </div>
</template>

<style scoped>

.social-btn {
  @apply rounded-full border border-pink-400 text-pink-400 p-1 ml-1;
}

:deep(a) {
  @apply text-pink-700 hover:underline;
}

</style>
