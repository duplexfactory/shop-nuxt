<template>
    <div class="mb-16">
        <div v-if="!!page" class="container mx-auto">
            <section class="mt-8 md:mt-0 md:grid grid-cols-8 lg:(px-16)">
                <div class="col-span-3 lg:(col-span-2)">
                    <div v-if="verifiedPage" class="rounded-full overflow-hidden image-container aspect-square mr-8 mb-2"
                         style="height: 100px;">
                      <img class="h-full w-full"
                           :alt="page.username"
                           v-lazy="page.profilePicUrl"/>
                    </div>
                    <div>
                        <h1 class="font-semibold text-xl truncate">{{ page.username }}</h1>
                        <div v-if="lastActive" class="text-gray-400 text-xs">最後活躍 {{ lastActive }}</div>
                    </div>

                    <div class="my-4 flex text-gray-500 text-sm">
                      <div class="text-center flex-1">
                        <div>粉絲</div>
                        <div>{{ !!page.followerCount ? page.followerCount.toLocaleString() : "-" }}</div>
                      </div>
                      <div class="bg-gray-300 mx-4" style="width: 1px;"></div>
                      <div class="text-center flex-1">
                        <div>貼文</div>
                        <div>{{ page.mediaCount.toLocaleString() }}</div>
                      </div>
                    </div>

                    <div class="mb-2 line-clamp-2" style="font-size: 0;">
                      <div v-for="tag in page.tags"
                           :key="tag"
                           class="tag mr-1 2xl:mr-2 !md:text-lg">{{ `#${tagsLookup[tag]}` }}</div>
                    </div>
                </div>

                <div class="col-span-5 lg:col-span-6 pt-2 md:pt-4 md:pl-8 text-gray-500 text-sm">

                  <div v-for="(pageInfoRow, i) in pageInfoRows" :key="pageInfoRow.value + i.toString()" class="mb-1">
                    <i class="mr-2" :class="pageInfoRow.iconClass"></i>
                    <component :is="pageInfoRow.link ? 'a' : 'span'"
                               class="break-words"
                               :class="{'hover:underline': pageInfoRow.link}"
                               target="_blank"
                               :href="pageInfoRow.link">{{ pageInfoRow.value }}</component>
                  </div>
                  <!--                    <button class="btn btn-outline">我知道</button>-->

                  <div class="text-gray-400 mt-4 text-xs"><i>圖片、文字、資料來源: IG @ <a class="hover:underline" :href="`https://www.instagram.com/${page.username}/`" target="_blank">{{ page.username }}</a></i></div>
                  <div class="text-gray-400 text-xs"><i>本網只根據IG上張貼的資料作整理，並沒有核實。資料或有錯漏，僅供參考。</i></div>
                </div>

                <div v-if="verifiedPage" class="col-span-8 py-4 text-gray-500 text-sm">
                    <h2 class="font-semibold">{{ page.fullName }}</h2>
                    <h3 class="mt-2 whitespace-pre-wrap">{{ page.biography }}</h3>
                    <a class="hover:underline" :href="page.externalUrl" target="_blank">{{ page.externalUrl }}</a>
                </div>
            </section>

            <section class="mt-4">
                <div class="mb-4 text-lg md:text-2xl flex">
                    <h2 class="px-5 py-2 md:px-6 md:py-3 cursor-pointer" :class="{'tab-selected': selectedIndex == 0}" @click="selectedIndex = 0">貼文</h2>
                    <h2 class="px-5 py-2 md:px-6 md:py-3 cursor-pointer" :class="{'tab-selected': selectedIndex == 1}" @click="selectedIndex = 1; fetchReviews();">評論</h2>
                </div>
                <div v-if="selectedIndex == 0" :class="verifiedPage ? 'grid' : 'md:grid'" class="grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-4">
                  <!-- lazy component ratio for taking up space before scrolling to it -->
                  <lazy-component v-for="(media, i) in medias"
                                  :key="media.id + '-post-card'"
                                  class="col-span-1"
                                  :style="verifiedPage ? 'aspect-ratio: 3/5' : ''"
                                  @show="showMedia(i)">
                    <LazyMediaCard v-if="verifiedPage"
                               @click="showMediaModal(media)"
                               style="cursor: pointer"
                               :media="media"
                               :shop="page"></LazyMediaCard>
                    <LazyMediaCardIGEmbed
                        v-else
                        class="mb-4 md:mb-0"
                        @showMediaModal="showMediaModal(media)"
                        :price="mediaPrice(media)"
                        top-bar
                        :post-id="media.code"
                        :fixed-aspect-ratio="0"
                        :username="page.username"></LazyMediaCardIGEmbed>
                  </lazy-component>
                </div>
                <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                  <div class="col-span-1 lg:order-2">
                    <div class="text-lg">撰寫評論</div>
                    <ReviewCreateCard v-model:rating="rating" v-model:content="content" :isCreatingReview="isCreatingReview" @create-review="sendReview()"></ReviewCreateCard>
                  </div>
                  <div class="col-span-1 lg:order-1">
                    <template v-for="review in reviews">
                      <ReviewCard :review="review" :checkMediaButton="true" @showMedia="showMediaModalByCode(review.mediaCode)"></ReviewCard>
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

<script setup lang="ts">

const {tagsLookup, categories} = useTags();

const verifiedPage = true;

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
import IgPage from "~/models/IgPage";
import PageInfoRow from "~/models/PageInfoRow";
import dayjs from "dayjs";

const config = useRuntimeConfig();
const route = useRoute();

const {data, error} = await useLazyFetch(`/api/shop/username/${route.params.username}`)
const found = (!error?.value && data.value)
// if (!!error && !!error.value) {
//   throwError(notFound);
// }

const page = found ? computed<IgPage>(() => data.value?.page as IgPage || null) : computed<IgPage | null>(() => ({
  _id: "",
  temp: true,
  pk: 0,
  username: route.params.username,
  fullName: "",
  biography: "",
  mediaCount: 0,
  adult: false,
  locations: [],
  extraData: {},
  tags: [],
}) as IgPage)
const lastActive = computed(() => (found && page.value?.lastActivity) ? dayjs(page.value.lastActivity * 1000).format('DD/MM/YYYY') : "");
const pageInfoRows = computed(() => PageInfoRow.rowsFromPage(page.value));

const selectedIndex = ref(0);

// Medias
let mediaPending = ref(false);
const medias = ref([]);
async function fetchMedias() {
  const params = {
    username: route.params.username,
    limit: 12
  }
  if (medias.value.length != 0) {
    params["before"] = medias.value[medias.value.length - 1].takenAt;
  }
  const {data: mediaData, pending} = await useLazyFetch(`/api/media/list`, {params});
  if (mediaData.value != null) {
    medias.value = [...medias.value, ...mediaData.value.medias];
    mediaPending.value = false;
  }
  else {
    // Client navigation.
    watch(mediaData, (newData) => {
      medias.value = [...medias.value, ...newData.medias];
      mediaPending.value = false;
    })
  }
}
if(found) await fetchMedias();

async function showMedia(i: number) {
  if (i == medias.value.length - 1 && !mediaPending.value) {
    mediaPending.value = true;
    await fetchMedias();
  }
}

// Meta
useMeta(computed(() => {
  let metaDescLocation = "", metaDescFullname = "";
  if (page.value !== null) {
    if (page.value.locations.length !== 0) {
      metaDescLocation = `，門市位於${page.value.locations.join("、")}`;
    }

    if (verifiedPage) {
      metaDescFullname = page.value.fullName;
    }
    else {
      // Construct a full name for unverified pages.
      const universalCategory = categories.find((c) => c.id === "universal");
      const universalTagIds = (universalCategory["tags"] as {id: string}[]).map((t) => t.id);

      const basicTagLabels = [], universalTagLabels = [];
      page.value.tags.forEach((t) => {
        if (universalTagIds.includes(t))
          universalTagLabels.push(tagsLookup[t]);
        else
          basicTagLabels.push(tagsLookup[t]);
      });

      if (universalTagLabels.length === 0) {
        // No universal tags.
        metaDescFullname = "專售" + basicTagLabels.join("、") + "。";
      }
      else {
        metaDescFullname = "";

        const prefixTagLabels = page.value.tags.filter((t) => ["south-korea", "japan", "second-hand"].includes(t)).map((t) => tagsLookup[t]);
        if (prefixTagLabels.length === 0) {
          metaDescFullname += basicTagLabels.join("、")
        }
        else {
          if (basicTagLabels.length === 0)
            metaDescFullname += prefixTagLabels.join("、") + "貨品";
          else
            metaDescFullname += prefixTagLabels.map((prefix) => basicTagLabels.map((base) => prefix + base)).flat().join("、")
        }

        if (page.value.tags.includes("purchase")) {
          metaDescFullname += "代購";
        }

        if (page.value.tags.includes("customize")) {
          metaDescFullname += metaDescFullname.length === 0 ? "訂製貨品" : "，可訂製";
        }

        metaDescFullname = (page.value.tags.includes("purchase") ? "專營" : "專售") + metaDescFullname + "。";
      }
    }
  }
  const metaDescription = `${route.params.username}的IG Shop門市、評論、商業登記、相片及貼文${metaDescLocation}。${metaDescFullname}`;
  return {
    title: `${route.params.username} | IG Shop 推薦及評論平台 | Shoperuse`,
    meta: [
      {name: 'description', hid: 'description', content: metaDescription},
      {property: 'og:title', hid: 'og:title', content: `${route.params.username} | IG Shop 推薦及評論平台 | Shoperuse`},
      {property: 'og:url', hid: 'og:url', content: `${config.DOMAIN}/shop/${route.params.username}`},
      // {property: 'og:image', hid: 'og:image', content: `${page.value !== null ? page.value.profilePicUrl : ""}`},
      // {property: 'og:image:height', hid: 'og:image:height', content: '150'},
      // {property: 'og:image:width', hid: 'og:image:width', content: '150'},
      {property: 'og:description', hid: 'og:description', content: metaDescription}
    ]
  }
}))

// Media Modal
import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";

const showModal = useShowMediaModal();
const showingMediaModalData = useShowingMediaModalData();

function showMediaModal(media: IgMedia) {
  if (page.value != null) {
    showModal.value = true;
    showingMediaModalData.value = {
      media: media,
      simplePage: page.value
    };
  }
}

function showMediaModalByCode(mediaCode: string) {
  if (page.value != null) {
    showModal.value = true;
    showingMediaModalData.value = {
      code: mediaCode,
      simplePage: page.value
    };
  }
}

// Reviews
import IgPageReview from "~/models/IgPageReview";

const reviews = ref<IgPageReview[]>([]);

async function fetchReviews() {
  if(!found) return
  reviews.value = (await $fetch('/api/reviews', { method: 'GET', params: {
      pageId: page.value._id,
    }}))['reviews'];
}

// Create Review
import useCreateReview from "~/composables/useCreateReview";
import IgMedia from "~/models/IgMedia";
import useMediaPrice from "~/composables/useMediaPrice";

const {
  reviewingPageId,
  isCreatingReview,
  rating,
  content,
  createReview,
} = useCreateReview();

async function sendReview() {
  if(!found) return
  reviewingPageId.value = page.value._id;
  await createReview();
  await fetchReviews();
}

// Media Price
const { mediaPrice } = useMediaPrice();

</script>

<style scoped>

.tab-selected {
  @apply border-b-4 border-pink-400;
}

img:not([src]) {
  visibility: hidden;
}

</style>
