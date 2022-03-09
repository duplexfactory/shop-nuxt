<template>
  <div class="px-4 sm:container mx-auto mb-16">

    <div class="grid grid-cols-4 gap-8">

      <!-- Left filter column -->
      <div class="col-span-1 p-4 hidden md:block">

        <div class="font-semibold mb-2">分類</div>
        <div v-for="category in ageRestrictedCategories" :key="category['id']" class="text-sm">
          <button @click="toggleCategory(category['id'])"
                  class="block py-1"
                  :class="{'text-pink-400': category.tags.map((t) => t.id).includes(selectedTag)}">{{ category['label'] }}</button>
          <ul v-if="selectedCategories.includes(category['id'])">
            <li v-for="tag in category.tags" :key="tag.id" class="px-4 py-1" :class="{'text-pink-400': selectedTag == tag.id}">
              <button @click="selectTag(tag.id)">{{ tag.label }}</button>
            </li>
          </ul>
        </div>

        <hr class="my-4"/>

        <div>
          <input type="checkbox" id="brick-and-mortar" name="brickAndMortar" v-model="brickAndMortar">
          <label for="brick-and-mortar" class="pl-2">實體商店</label>
        </div>

        <div class="mt-4">
          <input type="checkbox" id="business-registration" name="businessRegistration" v-model="businessRegistration">
          <label for="business-registration" class="pl-2">商業登記</label>
        </div>

      </div>

      <div class="col-span-4 md:col-span-3">

        <div class="flex items-center mb-2 md:mb-4">
          <div v-if="$route.query['keyword']" class="text-sm">你正在搜尋「 <span class="font-semibold">{{ $route.query['keyword'] }}</span> 」</div>
          <div class="text-xs text-gray-500">(共 {{ searchResultTotalCount }} 個結果)</div>

          <div class="flex-1"></div>

          <Pagination v-model:currentPage="currentPage"
                      :records="searchResultTotalCount"
                      :per-page="10"
                      @pageChanged="pageChanged"/>
        </div>

        <!-- Mobile filter -->
        <div class="md:hidden mb-2 text-sm">
          <button @click="isMobileFiltersShown = !isMobileFiltersShown"
                  class="flex items-center"
                  :class="{'text-pink-400': isMobileFilterActive}">
            篩選
            <i v-if="isMobileFiltersShown"
               class="sio-angle-up text-xl"
               :class="{'text-pink-400': isMobileFilterActive}"
            ></i>
            <i v-else
               class="sio-angle-down text-xl"
               :class="{'text-pink-400': isMobileFilterActive}"></i>
          </button>
          <div class="overflow-hidden">
            <transition name="accordion">
              <div v-if="isMobileFiltersShown" class="bg-gray-100 rounded-md p-2 mt-2">
                <select class="border rounded-sm" :value="selectedTag" @change="selectTag($event.target.value)">
                  <option value="" selected>所有分類</option>
                  <optgroup v-for="category in ageRestrictedCategories" :key="category['id']" :label="category['label']">
                    <option v-for="tag in category.tags" :key="tag.id" :value="tag.id">{{ tag.label }}</option>
                  </optgroup>
                </select>

                <div class="mt-2">
                  <input type="checkbox" id="brick-and-mortar-mobile" name="brickAndMortarMobile" v-model="brickAndMortar">
                  <label for="brick-and-mortar-mobile" class="pl-2">實體商店</label>
                </div>
                <div class="mt-2">
                  <input type="checkbox" id="business-registration-mobile" name="businessRegistrationMobile" v-model="businessRegistration">
                  <label for="business-registration-mobile" class="pl-2">商業登記</label>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <template v-if="!searchPending">
          <div v-for="page in searchResults" :key="page._id.toString()">
            <StoreCardRectangle @click="$router.push(`/shop/${page.username}`)"
                                style="cursor: pointer"
                                :shop="page"
                                class="mb-4"></StoreCardRectangle>
            <hr class="sm:hidden mb-4"/>
          </div>
        </template>

        <!-- Bottom Pagination -->
        <div class="flex justify-center">
          <Pagination v-model:currentPage="currentPage"
                      :records="searchResultTotalCount"
                      :per-page="10"
                      @pageChanged="pageChanged"/>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">

import {PageSearchQuery} from "~/models/PageSearchQuery";
import useSearch from "~/composables/useSearch";
import {PaginationQuery} from "~/models/PaginationQuery";
import {computed} from "@vue/reactivity";

const {
  ageRestrictedCategories,
  tagsLookup
} = useTags();

// const page = {
//   "_id": 10115857802,
//   lastActivity: 0,
//   "adult":false,
//   "biography":"韓系 | 日系 | 復古\n付款: \nFPS/Payme/Alipay/BOC\n取貨:\n面交/旺角dream catcher格仔自取/順豐到付\n買滿200減$20💕\n全店買滿400元包順豐❤\n歡迎DM查詢商品/落單\n#服裝 #衣服 #服飾店",
//   "brickAndMortar":true,
//   "businessRegistration":true,
//   "followerCount":242,
//   "followingCount":48,
//   "fullName":"vellichor香港平價女裝店✨套裝|上衣|下裝|飾品",
//   "locations":["旺角"],
//   "mediaCount":21,
//   "mediaUrls":["https://scontent-hkg4-2.cdninstagram.com/v/t51.2885-15/e35/209209710_138399534968591_8687751114042506050_n.jpg?se=8&_nc_ht=scontent-hkg4-2.cdninstagram.com&_nc_cat=111&_nc_ohc=3dn8Nn8l2xkAX9RXoHx&edm=ABmJApABAAAA&ccb=7-4&ig_cache_key=MjYwNjU3NTIzMDUxMjgzMzAzNw%3D%3D.2-ccb7-4&oh=00_AT-Z250Ds64c1dasw0YFZx29H916pyUr8CkWOiYY7Sbgbw&oe=61F8C467&_nc_sid=6136e7","https://scontent-hkg4-2.cdninstagram.com/v/t51.2885-15/e35/209340396_321975122802093_6881023015381483978_n.jpg?se=7&_nc_ht=scontent-hkg4-2.cdninstagram.com&_nc_cat=109&_nc_ohc=z4sWX83GLXYAX-JZpJ9&edm=ABmJApABAAAA&ccb=7-4&ig_cache_key=MjYwNjU3MDQ4NzM0MjIyMjQ0MQ%3D%3D.2-ccb7-4&oh=00_AT-h8E_aWpZOFe52lbgOAXO8u24LdKF7-vvssRjyEZiAvw&oe=61F9D87A&_nc_sid=6136e7","https://scontent-hkg4-1.cdninstagram.com/v/t51.2885-15/e35/186826697_320565473026296_5575303328309618653_n.jpg?se=8&_nc_ht=scontent-hkg4-1.cdninstagram.com&_nc_cat=100&_nc_ohc=EHkBPMVIxQYAX9tqgjY&edm=ABmJApABAAAA&ccb=7-4&ig_cache_key=MjU3NjMwOTcxMTMyNzI4NjQwNg%3D%3D.2-ccb7-4&oh=00_AT-5nbU1532nN5f0s2e_rOK-dU39V2dSL-Yh8dQ1w_a4hw&oe=61F9EBB9&_nc_sid=6136e7"],"profilePicUrl":"https://scontent-hkg4-2.cdninstagram.com/v/t51.2885-19/s150x150/137274571_440337453676552_6988806912843198605_n.jpg?_nc_ht=scontent-hkg4-2.cdninstagram.com&_nc_cat=104&_nc_ohc=6sJ-KJ5LBc4AX8iS8Ds&edm=AEF8tYYBAAAA&ccb=7-4&oh=00_AT9F9FnGHdkAWK1nMbkwc8nT6UrBE5Xwd33s4y6j-f6PMg&oe=61F8CC9A&_nc_sid=a9513d",
//   "tags":["apparel","women's-clothing"],
//   "username":"vellichor_shop"
// };



// Page Data Init

const route = useRoute();
const router = useRouter();
const selectedTag = ref<string>(route.query['tag'] ? route.query['tag'] : '');
const businessRegistration = ref<boolean>(route.query['br'] === 'true');
const brickAndMortar = ref<boolean>(route.query['brick'] === 'true');

const selectedCategories = ref<string[]>([]);
if (selectedTag.value !== '') {
    const category = ageRestrictedCategories.value.find((c) => !!c.tags.find((t) => t.id == selectedTag.value));
    if (category) {
        selectedCategories.value.push(category.id);
    }
}

const {
  searchResults,
  searchResultTotalCount,
  searchPending,
  search
} = useSearch();
function fetchResults(p: PaginationQuery = new PaginationQuery()) {
  search(new PageSearchQuery(
      route.query['keyword'] != "" ? route.query['keyword'] : undefined,
      selectedTag.value != "" ? selectedTag.value : undefined,
      businessRegistration.value == true ? true : undefined,
      brickAndMortar.value == true ? true : undefined,
  ), p);
}

fetchResults();

const currentPage = ref<number>(1);
function pageChanged() {
  fetchResults(new PaginationQuery(
      (currentPage.value - 1) * 10
  ));
}

const isMobileFiltersShown = ref<boolean>(false);
function clearFilters() {

}

// Meta
useMeta(computed(() => {

  let title = "", metaDescription = "";
  const tail = "你想找的 IG Shop 資訊盡在 Shopitout。IG Shop 推薦及評論平台。";
  if (route.query['keyword'] && route.query['keyword'] != "") {
    title = `${route.query['keyword']} | IG Shop 推薦及評論平台 | Shopitout`;
    metaDescription = `${route.query['keyword']}的搜尋結果 - 共${searchResultTotalCount.value}個。${tail}`;
  }
  else if (selectedTag.value != "") {
    title = `${tagsLookup[selectedTag.value]} IG Shop 一覽 | Shopitout 推薦及評論平台`;
    metaDescription = `共${searchResultTotalCount.value}個${tagsLookup[selectedTag.value]} IG Shop。${tail}`;
  }
  else if (businessRegistration.value) {
    title = `持商業登記 | IG Shop 推薦及評論平台 | Shopitout`;
    metaDescription = `共${searchResultTotalCount.value}個持商業登記的 IG Shop。${tail}`;
  }
  else if (brickAndMortar.value != "") {
    title = `門市實體店 | IG Shop 推薦及評論平台 | Shopitout`;
    metaDescription = `共${searchResultTotalCount.value}個有門市實體店的 IG Shop。${tail}`;
  }
  else {
    title = `推薦 IG Shop | IG Shop 推薦及評論平台 | Shopitout`;
    metaDescription = tail;
  }

  return {
    title,
    meta: [
      {name: 'description', hid: 'description', content: metaDescription},
      {property: 'og:title', hid: 'og:title', content: title},
      // {property: 'og:url', hid: 'og:url', content: `${config.DOMAIN}/shop/${route.params.username}`},
      {property: 'og:description', hid: 'og:description', content: metaDescription}
    ]
  }
}))

watch(
    () => route.query,
    async (q, prevQ) => {
      if (route.path != "/search") {
        return;
      }

      if (q["tag"] != undefined) {
        if (q["tag"] != selectedTag.value) {
          selectedTag.value = q["tag"] as string;
        }
      }

      fetchResults();
    }
)

watch(
    selectedTag,
    async (sT, prevST) => {
      const query = {
        ...route.query
      };
      if (selectedTag.value != '') {
        query.tag = selectedTag.value;
      }
      else {
        delete query.tag
      }

      router.replace({query});
    }
)

watch(
  businessRegistration,
  async (br, prevBr) => {
    const query = {
      ...route.query
    };
    if (businessRegistration.value) {
      query.br = 'true';
    }
    else {
      delete query.br
    }

    router.replace({query})
  }
)

watch(
  brickAndMortar,
  async (bm, prevBm) => {
    const query = {
      ...route.query
    };
    if (brickAndMortar.value) {
      query.brick = 'true';
    }
    else {
      delete query.brick
    }

    router.replace({query})
  }
)

</script>

<script lang="ts">
  export default {
    computed: {
      isMobileFilterActive() {
        return (this.selectedTag !== '') || this.brickAndMortar || this.businessRegistration;
      }
    },
    methods: {
      toggleCategory(categoryId: string) {
        if (this.selectedCategories.includes(categoryId)) {
          this.selectedCategories = this.selectedCategories.filter((c) => c != categoryId);
        }
        else {
          this.selectedCategories.push(categoryId);
        }
      },
      selectTag(tag: string) {
        this.selectedTag = tag;
      }
    }
  }
</script>

<style scoped>
input {
  cursor: pointer;
}

label {
  cursor: pointer;
}

</style>
