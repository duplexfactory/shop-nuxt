<template>
  <div>
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

    <div class="border rounded-md">
      <div id="editor"></div>
    </div>

  </div>
</template>

<script setup lang="ts">

import type EditorJS from "@editorjs/editorjs";
import type {EditorConfig} from "@editorjs/editorjs";
import type {PropType, Ref} from "vue";
import Blog from "~/models/Blog";

const nuxt = useNuxtApp();

const {
  editBlog,
} = defineProps({
  editBlog: Object as PropType<Blog>
})
const blog: Ref<Omit<Blog, "id" | "created">> = ref({
  title: "",
  slug: "",
  metaDesc: "",
  htmlContent: null,
});
if (editBlog) {
  blog.value = editBlog
}
// watch(editBlog, (newEditBlog) => {
//   console.log("changeddd!!!!");
//   blog.value = newEditBlog
// });

const isSubmitting = ref(false);

const editor: Ref<EditorJS | null> = ref(null);

onMounted(async () => {
  const EditorJS = await import("@editorjs/editorjs")
  const Header = await import("@editorjs/header")
  const List = await import("@editorjs/list")
  const Table = await import("@editorjs/table")
  const FontSize = await import('editorjs-inline-font-size-tool');
  const Paragraph = await import('editorjs-paragraph-with-alignment');
  const AlignmentTuneTool = await import('editorjs-text-alignment-blocktune');

  const editorConfig: EditorConfig = {
    holder: "editor",
    tools: {
      header: {
        class: Header.default,
        shortcut: 'CMD+SHIFT+H',
        inlineToolbar: true,
        tunes: ["alignmentTune"]
      },
      list: {
        class: List.default,
        shortcut: 'CMD+SHIFT+L'
      },
      table: {
        class: Table.default,
        inlineToolbar: true,
      },
      fontSize: {
        class: FontSize.default,
        inlineToolbar: true,
      },
      paragraph: {
        class: Paragraph.default,
        inlineToolbar: true,
      },
      alignmentTune: {
        class: AlignmentTuneTool.default,
        config:{
          default: "right",
          blocks: {
            header: 'center',
            list: 'right'
          }
        },
      }
    },
  }

  if (blog.value.htmlContent) {
    editorConfig.data = blog.value.htmlContent
  }
  editor.value = new EditorJS.default(editorConfig);
})

async function save() {

  blog.value.htmlContent = await editor.value.save();

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
    htmlContent: null,
  }

  nuxt.vueApp.$toast.success("儲存成功！", {position: "top"});
}


</script>
