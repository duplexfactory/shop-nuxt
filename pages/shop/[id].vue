<script setup lang="ts">
    import IgPage from "../../models/IgPage";
    import dayjs from "dayjs";

    const {data} = await useFetch(`/api/shop`, {params: {id: useRoute().params.id}});
    const {page} = data.value as { page: IgPage };
    const {tagsLookup} = useTags();

    const {
        username,
        lastActivity,
        biography,
        followerCount,
        mediaCount,
        profilePicUrl,
        tags,
        brickAndMortar,
        locations
    } = page

    const lastActive = dayjs(lastActivity * 1000).format('DD/MM/YYYY');
    const description = biography;
</script>

<script lang="ts">
export default  {
    data(): {
      selectedIndex: number,
      showModal: boolean,
      showingMediaCode: string
    } {
      return {
        selectedIndex: 0,
        showModal: false,
        showingMediaCode: ""
      }
    }
}
</script>

<template>
    <div>
        <!-- Media modal -->
        <transition name="modal">
            <MediaModal v-if="showModal" @close="showModal = false">
              <template v-slot:body>
                <div class="grid grid-cols-8">
                  <div class="col-span-4">
                    <MediaCardIGEmbed :post-id="showingMediaCode" :fixed-aspect-ratio="0"></MediaCardIGEmbed>
                  </div>
                  <div class="col-span-4">
                    <div class="text-lg md:text-2xl px-5 py-2 md:px-6 md:py-3">評論</div>

                  </div>
                </div>
              </template>
            </MediaModal>
        </transition>

        <div class="container mx-auto">
            <section class="md:grid grid-cols-8">
                <div class="col-span-3 lg:col-span-2 pr-4">
                    <div class="rounded-full mr-8" style="aspect-ratio: 1; height: 120px;" :style="`background-image: url(${$encryptImageUrl(profilePicUrl)});`"></div>
                    <div class="mt-4">
                        <div class="font-semibold text-xl truncate">{{ username }}</div>
                        <div class="mt-2 text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>
                    </div>
                </div>

                <div class="py-4 col-span-5 lg:col-span-6 text-sm md:text-lg">
                    <div class="text-gray-500 flex">
                      <div class="flex">
                        <div class="text-center" style="flex: 1;">
                          <div>粉絲</div>
                          <div>{{ followerCount.toLocaleString() }}</div>
                        </div>
                        <div class="bg-gray-300 mx-4" style="width: 1px;"></div>
                        <div class="text-center" style="flex: 1;">
                          <div>貼文</div>
                          <div>{{ mediaCount.toLocaleString() }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="mt-4 line-clamp-2" style="font-size: 0;">
                        <div v-for="tag in tags"
                             :key="tag"
                             class="tag mr-1 2xl:mr-2 !md:text-lg">{{ `#${tagsLookup[tag]}` }}</div>
                    </div>

                    <div v-if="brickAndMortar" class="mt-4 text-gray-500">
                        <div>門市</div>
                        <div>{{ locations.join('、') }}</div>
                    </div>
      <!--                    <button class="btn btn-outline">我知道</button>-->

                </div>
            </section>

            <section class="md:mt-8">
                <div class="mb-4 text-lg md:text-2xl flex">
                    <button class="px-5 py-2 md:px-6 md:py-3" :class="{'tab-selected': selectedIndex == 0}" @click="selectedIndex = 0">貼文</button>
                    <button class="px-5 py-2 md:px-6 md:py-3" :class="{'tab-selected': selectedIndex == 1}" @click="selectedIndex = 1">評論</button>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-4">
<!--                    {{ medias }}-->
<!--                  {{ medias }}-->
                  <MediaCard v-for="media in page.medias"
                             class="col-span-1"
                             @click="showModal = true; showingMediaCode = media.code;"
                             style="cursor: pointer"
                             :media="media"
                             :shop="page"
                             :key="media.id + '-post-card'"></MediaCard>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>

.tab-selected {
  @apply border-bottom-4 border-pink-400;
}

</style>
