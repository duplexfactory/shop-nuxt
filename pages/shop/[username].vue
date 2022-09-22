<template>
  <div class="bg-gray-100 pt-4 md:pt-8 pb-16">
    <div v-if="!!page" class="sm:container mx-auto">
      <section class="md:grid grid-cols-8 p-4 lg:(px-16 py-8) bg-white">
        <div class="col-span-3 lg:(col-span-2)">
          <div v-if="verifiedPage" class="rounded-full overflow-hidden image-container aspect-square mr-8 mb-2"
               style="height: 100px;">
            <img class="h-full w-full"
                 :alt="page.username"
                 v-lazy="page.profilePicUrl"/>
          </div>
          <div>
            <h1 class="font-semibold text-xl truncate">
              <a :href="`https://www.instagram.com/${page.username}/`"
                 target="_blank">{{ page.username }}</a>
            </h1>
          </div>

          <div class="my-4 flex">
            <div v-for="metric in pageMetrics" :key="'metric-' + metric.title" class="flex-1 text-sm">
              <div class="text-gray-500">{{ metric.title }}</div>
              <div class="font-semibold text-gray-800">{{ metric.value }}</div>
            </div>
          </div>

          <div class="mb-2 line-clamp-2" style="font-size: 0;">
            <div v-for="tag in page.tags"
                 :key="tag"
                 class="tag mr-2">{{ `#${tagsLookup[tag]}` }}
            </div>
          </div>
        </div>

        <div v-if="verifiedPage" class="col-span-5 lg:col-span-6 pt-2 md:pt-4 md:pl-8 text-gray-500 text-sm">
          <h2 class="font-semibold">{{ page.fullName }}</h2>
          <h3 class="mt-2 whitespace-pre-wrap">{{ page.biography }}</h3>
          <a class="hover:underline" :href="page.externalUrl" target="_blank">{{ page.externalUrl }}</a>
        </div>

      </section>

      <section class="mt-4 grid grid-cols-12 gap-4">

        <div class="col-span-12 lg:col-span-3 text-sm">

          <div class="bg-white p-4 sticky top-4">
            <h2 class="text-lg font-semibold mb-4">店鋪資料</h2>

            <div class="text-gray-500">
              <div v-for="(pageInfoRow, i) in pageInfoRows" :key="pageInfoRow.value + i.toString()" class="mb-1 flex">
                <div>
                  <i class="mr-2" :class="pageInfoRow.iconClass"></i>
                </div>
                <div>
                  <component :is="pageInfoRow.link ? 'a' : 'span'"
                             class="break-words"
                             :class="{'hover:underline': pageInfoRow.link}"
                             target="_blank"
                             :href="pageInfoRow.link">{{ pageInfoRow.value }}
                  </component>
                </div>

              </div>
              <!--                    <button class="btn btn-outline">我知道</button>-->

              <div class="text-gray-400 mt-4 text-xs"><i>圖片、文字、資料來源: IG @ <a class="hover:underline"
                                                                             :href="`https://www.instagram.com/${page.username}/`"
                                                                             target="_blank">{{ page.username }}</a></i></div>
              <div class="text-gray-400 mt-2 text-xs"><i>資料或有錯漏，僅供參考。</i></div>
            </div>
          </div>

        </div>

        <div class="col-span-12 lg:col-span-9 bg-white p-4">
          <!-- Tabs -->
          <div class="mb-4 text-lg font-semibold flex">
            <h2 class="px-4 py-2 cursor-pointer" :class="{'tab-selected': selectedIndex == 0}"
                @click="selectedIndex = 0">貼文</h2>
            <h2 v-if="found" class="px-4 py-2 cursor-pointer"
                :class="{'tab-selected': selectedIndex == 1}" @click="selectedIndex = 1; fetchReviews();">評論</h2>
          </div>

          <!-- Tab content -->
          <div v-if="selectedIndex == 0" :class="verifiedPage ? 'grid' : 'md:grid'"
               class="grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-4">
            <template v-for="(media, i) in medias"
                      :key="media.id + '-post-card'">

              <!-- aspect ratio for taking up space before scrolling to it -->
              <div v-if="verifiedPage"
                   class="col-span-1"
                   style="aspect-ratio: 3/5">
                <MediaCard @click="showMediaModal(media)"
                           class="cursor-pointer"
                           :media="media"
                           :shop="page"></MediaCard>
              </div>

              <lazy-component v-else
                              class="col-span-1">
                <LazyMediaCardIGEmbed
                    class="mb-4 md:mb-0"
                    @showMediaModal="showMediaModal(media)"
                    :price="mediaPrice(media)"
                    top-bar
                    :post-id="media.code"
                    :fixed-aspect-ratio="0"
                    :username="page.username"></LazyMediaCardIGEmbed>
              </lazy-component>
            </template>
          </div>
          <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div class="col-span-1 lg:order-2">
              <div class="text-lg">撰寫評論</div>
              <ReviewCreateCard v-model:rating="rating"
                                v-model:content="content"
                                v-model:imageFiles="imageFiles"
                                :isCreatingReview="isCreatingReview"
                                @create-review="sendReview()"></ReviewCreateCard>
            </div>
            <div class="col-span-1 lg:order-1">
              <template v-for="review in reviews">
                <ReviewCard :review="review" :checkMediaButton="true"
                            @showMedia="showMediaModalByCode(review.mediaCode)"></ReviewCard>
                <hr/>
              </template>
              <!-- No Reviews -->
              <div v-if="reviews.length == 0" class="mt-2 p-6 bg-gray-100 rounded-md text-lg text-center">
                暫時沒有任何評論
              </div>
            </div>
          </div>

          <!-- Tab infinite scroll -->
          <div v-if="mediaPending" class="flex justify-center mt-8">
            <i class="spr-spin4 animate-spin text-6xl text-pink-400"></i>
          </div>
        </div>

      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import {PageSearch} from "~/models/PageSearch"
  import PageInfoRow from "~/models/PageInfoRow"
  import dayjs from "dayjs"
  import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states"
  import IgPageReview from "~/models/IgPageReview"
  import useCreateReview from "~/composables/useCreateReview"
  import IgMedia from "~/models/IgMedia"
  import useMediaPrice from "~/composables/useMediaPrice"
  import useMediaList from "~/composables/useMediaList";
  import {notFound} from "~/utils/h3Error";

  const {tagsLookup, categories} = useTags()

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

  const config = useRuntimeConfig()
  const route = useRoute()

  const {data, error} = await useContentKeyedLazyFetch(`/api/shop/username/${route.params.username}`)
  const found = computed(() => !error?.value && data.value)
  if (!!error && !!error.value) {
    throwError(notFound);
  }

  const page = computed<PageSearch>(() => found.value ? data.value?.page as PageSearch : null)
  const verifiedPage = computed<boolean>(() => !!page.value ? page.value.igConnected : false)
  const lastActive = computed(() => (found.value && page.value?.lastActivity) ? dayjs(page.value.lastActivity * 1000).fromNow() : "")
  const pageInfoRows = computed(() => PageInfoRow.rowsFromPage(page.value))

  const selectedIndex = ref(0)

  const pageMetrics = computed<{ title: string, value: string }[]>(() => {
    return [
      {
        title: "粉絲",
        value: !!page.value.followerCount ? page.value.followerCount.toLocaleString() : "-"
      },
      {
        title: "貼文",
        value: page.value.mediaCount.toLocaleString()
      },
      {
        title: "最後活躍",
        value: lastActive.value
      },
    ]
  })

  // Medias

  const {
    mediaPending,
    medias,
    fetchOfficialMedias,
    fetchDynamoMedias
  } = useMediaList();

  async function fetchMedias() {
    return (page.value.igConnected) ? fetchOfficialMedias(page.value._id) : fetchDynamoMedias(route.params.username)
  }

  if (page.value) await fetchMedias()
  else watch(page, async (f) => {
    if (f) await fetchMedias()
  })

  if (process.client) {
    window.onscroll = async function(ev) {
      const pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight,  document.documentElement.clientHeight,  document.documentElement.scrollHeight,  document.documentElement.offsetHeight );
      if (Math.ceil(window.innerHeight + window.scrollY) >= pageHeight) {
        // Reached bottom.
        if (selectedIndex.value === 0) {
          // Load more medias.
          if (!mediaPending.value && medias.value.length < page.value.mediaCount) {
            mediaPending.value = true
            await fetchMedias()
          }
        }
      }
    };
  }

  // Meta
  useMeta(computed(() => {
    let metaDescLocation = "", metaDescFullname = ""
    if (page.value !== null) {
      if (page.value.locations.length !== 0) {
        metaDescLocation = `，門市位於${page.value.locations.join("、")}`
      }

      if (verifiedPage) {
        metaDescFullname = page.value.fullName
      } else {
        // Construct a full name for unverified pages.
        const universalCategory = categories.find((c) => c.id === "universal")
        const universalTagIds = (universalCategory["tags"] as { id: string }[]).map((t) => t.id)

        const basicTagLabels = [], universalTagLabels = []
        page.value.tags.forEach((t) => {
          if (universalTagIds.includes(t))
            universalTagLabels.push(tagsLookup[t])
          else
            basicTagLabels.push(tagsLookup[t])
        })

        if (universalTagLabels.length === 0) {
          // No universal tags.
          metaDescFullname = "專售" + basicTagLabels.join("、") + "。"
        } else {
          metaDescFullname = ""

          const prefixTagLabels = page.value.tags.filter((t) => ["south-korea", "japan", "second-hand"].includes(t)).map((t) => tagsLookup[t])
          if (prefixTagLabels.length === 0) {
            metaDescFullname += basicTagLabels.join("、")
          } else {
            if (basicTagLabels.length === 0)
              metaDescFullname += prefixTagLabels.join("、") + "貨品"
            else
              metaDescFullname += prefixTagLabels.map((prefix) => basicTagLabels.map((base) => prefix + base)).flat().join("、")
          }

          if (page.value.tags.includes("purchase")) {
            metaDescFullname += "代購"
          }

          if (page.value.tags.includes("customize")) {
            metaDescFullname += metaDescFullname.length === 0 ? "訂製貨品" : "，可訂製"
          }

          metaDescFullname = (page.value.tags.includes("purchase") ? "專營" : "專售") + metaDescFullname + "。"
        }
      }
    }
    const metaDescription = `${route.params.username}的IG Shop門市、評論、商業登記、相片及貼文${metaDescLocation}。${metaDescFullname}`
    return {
      title: `${route.params.username} | IG Shop 推薦及評論平台 | Shoperuse`,
      meta: [
        {name: "description", hid: "description", content: metaDescription},
        {property: "og:title", hid: "og:title", content: `${route.params.username} | IG Shop 推薦及評論平台 | Shoperuse`},
        {property: "og:url", hid: "og:url", content: `${config.DOMAIN}/shop/${route.params.username}`},
        // {property: 'og:image', hid: 'og:image', content: `${page.value !== null ? page.value.profilePicUrl : ""}`},
        // {property: 'og:image:height', hid: 'og:image:height', content: '150'},
        // {property: 'og:image:width', hid: 'og:image:width', content: '150'},
        {property: "og:description", hid: "og:description", content: metaDescription}
      ]
    }
  }))

  // Media Modal

  const showModal = useShowMediaModal()
  const showingMediaModalData = useShowingMediaModalData()

  function showMediaModal(media: IgMedia) {
    if (page.value != null) {
      showModal.value = true
      showingMediaModalData.value = {
        media: media,
        simplePage: page.value
      }
    }
  }

  function showMediaModalByCode(mediaCode: string) {
    if (page.value != null) {
      showModal.value = true
      showingMediaModalData.value = {
        code: mediaCode,
        simplePage: page.value
      }
    }
  }

  // Reviews

  const reviews = ref<IgPageReview[]>([])

  async function fetchReviews() {
    if (!found.value) return
    reviews.value = (await $fetch("/api/reviews", {
      params: {
        pageId: page.value._id,
      }
    }))["reviews"]
  }

  // Create Review

  const {
    reviewingPageId,
    isCreatingReview,
    rating,
    content,
    imageFiles,
    createReview,
  } = useCreateReview()

  async function sendReview() {
    if (!found.value) return
    reviewingPageId.value = page.value._id
    await createReview()
    await fetchReviews()
  }

  // Media Price
  const {mediaPrice} = useMediaPrice()

</script>

<style scoped>

  .tab-selected {
    @apply border-b-4 border-pink-400;
  }

  img:not([src]) {
    visibility: hidden;
  }

</style>
