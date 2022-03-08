<script setup lang="ts">

    const {tagsLookup} = useTags();

    // const page = {
    //   lastActivity: 0,
    //   // "_id":{"$numberDouble":"1.0007428151000E+10"},
    //   // "activeScore":{"$numberInt":"0"},
    //   // "adult":false,
    //   "biography":"Close❌\n👭🏻兩姐妹susu開創的養生茶小店\n🇭🇰香港自家制小店\n💵Payme | FPS | Bank Transfer\n📦平郵 ｜ 順豐 ｜面交(東鐵沿線)\n🎁歡迎訂購散水禮物，婚禮回禮等等...\n🛍歡迎DM或點下面whatsapp link 下單",
    //   "brickAndMortar":false,
    //   // "businessRegistration":false,
    //   "followerCount":1608,
    //   // "followingCount":{"$numberInt":"830"},
    //   // "fullName":"𝓢𝓾𝓼𝓾.𝓬𝓱𝓪養生茶 || 花茶 ||水果茶 || 冷泡茶",
    //   "locations":[],
    //   "mediaCount":81,
    //   "medias": [
    //     {
    //       id: 'id',
    //       code: 'CLZgxXFjPiO',
    //     }
    //   ],
    //   // "mediaUrls":["https://scontent-hkg4-1.cdninstagram.com/v/t51.2885-15/150787098_152367376704308_3452290134182951987_n.jpg?stp=dst-jpg_e35_s1080x1080&cb=9ad74b5e-7e291d1f&_nc_ht=scontent-hkg4-1.cdninstagram.com&_nc_cat=108&_nc_ohc=P29nDOXzGc4AX88R7V4&edm=ABmJApABAAAA&ccb=7-4&ig_cache_key=MjUxMTE4MjM5Njc2NzY2NDI3MA%3D%3D.2-ccb7-4&oh=00_AT-zPt3KEIA0lLxErMnYz67w4VQGxrI_fhM_EOW6JCHVcA&oe=61F878DE&_nc_sid=6136e7","https://scontent-hkg4-1.cdninstagram.com/v/t51.2885-15/150941680_871159673462427_8079581001106523128_n.jpg?stp=dst-jpg_e35_s1080x1080&cb=9ad74b5e-7e291d1f&_nc_ht=scontent-hkg4-1.cdninstagram.com&_nc_cat=103&_nc_ohc=Yl3z0DVuN8YAX8hXYLy&edm=ABmJApABAAAA&ccb=7-4&ig_cache_key=MjUxMTE4MTkxODk0NDI1MTk1Mg%3D%3D.2-ccb7-4&oh=00_AT82eF4thvNIoEwLnjS-NSoJCYE36vTvA3cP0YAKSaLaIg&oe=61FA552C&_nc_sid=6136e7","https://scontent-hkg4-2.cdninstagram.com/v/t51.2885-15/151811494_1671834206329917_3439524254574899315_n.jpg?stp=dst-jpg_e35_s1080x1080&cb=9ad74b5e-7e291d1f&_nc_ht=scontent-hkg4-2.cdninstagram.com&_nc_cat=109&_nc_ohc=uxYg6LYw9bkAX8KDDYy&edm=ABmJApABAAAA&ccb=7-4&ig_cache_key=MjUxMTE4MTQ3MDM4ODQ3MDA0NQ%3D%3D.2-ccb7-4&oh=00_AT-u_y7m2UP_iC4RtgvWN0Gw8iRlVMnYbCDzPYoWmXPhPw&oe=61F9CCB4&_nc_sid=6136e7"],
    //   "profilePicUrl":"https://scontent-hkg4-1.cdninstagram.com/v/t51.2885-19/94730584_1985404248269838_3376414541758857216_n.jpg?stp=dst-jpg_s150x150&cb=9ad74b5e-7e291d1f&_nc_ht=scontent-hkg4-1.cdninstagram.com&_nc_cat=106&_nc_ohc=tvG5RElIgE0AX_VjuJP&edm=AEF8tYYBAAAA&ccb=7-4&oh=00_AT-jhQrubt594nSdQJdo7Dwuj72Ha-2b03grnHtMUuyx-Q&oe=61F9E2D1&_nc_sid=a9513d",
    //   "tags":["tea"],
    //   "username":"susu.cha"
    // };

    // Page Data Init
    import IgPage from "../../models/IgPage";
    import dayjs from "dayjs";

    const page = ref(null);
    const lastActive = ref("");
    const {data} = useLazyFetch(`/api/shop`, {params: {username: useRoute().params.username}, server: false});
    watch(data, (newData) => {
      const {page: _page} = newData;
      page.value = _page
      lastActive.value = dayjs(_page.lastActivity * 1000).format('DD/MM/YYYY');
      reviewingPagePk.value = _page.pk;
    })

    const {data: mediaData} = useLazyFetch(`/api/media`, {params: {username: useRoute().params.username}, server: false});
    const medias = computed(() => mediaData.value.medias || []);

    // Media Modal
    import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";

    const showModal = useShowMediaModal();
    const showingMediaModalData = useShowingMediaModalData();

    // Reviews
    import IgPageReview from "~/models/IgPageReview";

    const reviews = ref<IgPageReview[]>([]);

    async function fetchReviews() {
      reviews.value = (await $fetch('/api/reviews', { method: 'GET', params: {
          pagePk: page.value.pk,
        }}))['reviews'];
    }

    // Create Review
    import useCreateReview from "~/composables/useCreateReview";

    const {
      reviewingPagePk,
      isCreatingReview,
      rating,
      content,
      createReview,
    } = useCreateReview();

    async function sendReview() {
      await createReview();
      await fetchReviews();
    }
</script>

<script lang="ts">


export default  {
    data(): {
      selectedIndex: number,
    } {
      return {
        selectedIndex: 0,
      }
    },
}
</script>

<template>
    <div class="mb-16">
        <div v-if="page !== null" class="container mx-auto">
            <section class="md:grid grid-cols-8">
                <div class="col-span-3 lg:col-span-2 pr-4">
                    <div class="bg-gray-300 rounded-full square-image-container mr-8" v-lazy:background-image="page.profilePicUrl" style="height: 100px;"></div>
                    <div class="mt-2">
                        <div class="font-semibold text-xl truncate">{{ page.username }}</div>
                        <div class="mt-2 text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>
                    </div>

                    <div class="mt-2 flex text-gray-500 text-sm md:text-lg">
                      <div class="flex">
                        <div class="text-center" style="flex: 1;">
                          <div>粉絲</div>
                          <div>{{ page.followerCount.toLocaleString() }}</div>
                        </div>
                        <div class="bg-gray-300 mx-4" style="width: 1px;"></div>
                        <div class="text-center" style="flex: 1;">
                          <div>貼文</div>
                          <div>{{ page.mediaCount.toLocaleString() }}</div>
                        </div>
                      </div>
                    </div>

                    <div v-if="page.brickAndMortar" class="mt-2 text-gray-500 text-sm md:text-lg">
                      {{ '門市：' + page.locations.join('、') }}
                    </div>
                    <!--                    <button class="btn btn-outline">我知道</button>-->

                    <div class="mt-2 line-clamp-2" style="font-size: 0;">
                      <div v-for="tag in page.tags"
                           :key="tag"
                           class="tag mr-1 2xl:mr-2 !md:text-lg">{{ `#${tagsLookup[tag]}` }}</div>
                    </div>
                </div>

                <div class="py-4 col-span-5 lg:col-span-6">
                    <div class="text-gray-500">{{ page.fullName }}</div>
                    <div class="mt-2 text-gray-500 whitespace-pre-wrap">{{ page.biography }}</div>
                </div>
            </section>

            <section class="md:mt-8">
                <div class="mb-4 text-lg md:text-2xl flex">
                    <button class="px-5 py-2 md:px-6 md:py-3" :class="{'tab-selected': selectedIndex == 0}" @click="selectedIndex = 0">貼文</button>
                    <button class="px-5 py-2 md:px-6 md:py-3" :class="{'tab-selected': selectedIndex == 1}" @click="selectedIndex = 1; fetchReviews();">評論</button>
                </div>
                <div v-if="selectedIndex == 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-4">
                  <MediaCard v-for="media in medias"
                             class="col-span-1"
                             @click="showModal = true; showingMediaModalData = {code: media.code, pagePk: media.pagePk, username: page.username};"
                             style="cursor: pointer"
                             :media="media"
                             :shop="page"
                             :key="media.id + '-post-card'"></MediaCard>
                </div>
                <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <div class="col-span-1 lg:order-2">
                    <div class="text-lg">撰寫評論</div>
                    <ReviewCreateCard v-model:rating="rating" v-model:content="content" :isCreatingReview="isCreatingReview" @create-review="sendReview()"></ReviewCreateCard>
                  </div>
                  <div class="col-span-1 lg:order-1">
                    <template v-for="review in reviews">
                      <ReviewCard :review="review"></ReviewCard>
                      <hr/>
                    </template>
                    <!-- No Reviews -->
                    <div v-if="reviews.length == 0" class="mt-2 p-6 bg-gray-100 rounded-md text-lg text-center">
                      暫時沒有任何評論
                    </div>
                  </div>
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
