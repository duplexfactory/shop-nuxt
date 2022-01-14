<script lang="ts">
    // import Header from "~/components/editor-plugin/Header"
    // import List from "~/components/editor-plugin/List"
    export default {
        async mounted() {
            const EditorJS = await import("@editorjs/editorjs")
            const Header = await import("@editorjs/header")
            const List = await import("@editorjs/list")
            const Table = await import("@editorjs/table")

            var editor = new EditorJS.default({
                holder: "editor",
                tools: {
                    header: {
                        class: Header.default,
                        shortcut: 'CMD+SHIFT+H',
                        inlineToolbar: true,
                    },
                    list: {
                        class: List.default,
                        shortcut: 'CMD+SHIFT+L'
                    },
                    table: {
                        class: Table.default,
                        inlineToolbar: true,
                    },
                }
            });
        }
    }
</script>

<template>
    <div>
        <div id="editor"></div>
    </div>
</template>
