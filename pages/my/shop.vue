<script setup lang="ts">

import {useIsLoggedIn} from "~/composables/states";
import IgPageExtraData from "~/models/IgPageExtraData";
import {extraDataLookup} from "~/models/PageInfoRow";

const router = useRouter();
const isLoggedIn = useIsLoggedIn();
watch(
    () => isLoggedIn.value,
    async (isLoggedIn, prevIsLoggedIn) => {
      if (isLoggedIn === true) {
        console.log("Signed in.")
      }
      if (isLoggedIn === false) {
        // Redirect.
        console.log("Signed out.")
        await router.replace("/login/shop");
      }
    }
)


const {data} = await useFetch(`/api/shop?id=1527690977`);
// 384883192
// 43808406274
const {page: shop} = data.value

const {categories, tagsLookup} = useTags()
const selectedTag = ref("");
function addSelectedTag() {
  if (shop.tags.includes(selectedTag.value)) {
    return;
  }
  shop.tags.push(selectedTag.value);
}

const extraDataStringFields = ref({
  phone: "",
  whatsapp: "",
  wechat: "",
  signal: "",
  email: "",
  address: "",
  openHours: "",
  link: "", // IgPage.externalUrl
  relatedPage: "",
  facebook:  "",
  discount:  "",
  shopSince:  "",
} as Record<{
  [K in keyof IgPageExtraData]: IgPageExtraData[K] extends string ? K : never;
}[keyof IgPageExtraData], string>);

for (const key of Object.keys(extraDataStringFields.value)) {
  extraDataStringFields.value[key] = shop.extraData[key] ?? "";
}

const extraDataBooleanFields = ref({
  br: false,
  noRefund: false,
  noIgDM: false,
  noPhoneCall: false,
} as Record<{
  [K in keyof IgPageExtraData]: IgPageExtraData[K] extends boolean ? K : never;
}[keyof IgPageExtraData], string>);

for (const key of Object.keys(extraDataBooleanFields.value)) {
  extraDataBooleanFields.value[key] = !!shop.extraData[key];
}

const extraDataMultiStringFieldsTemp = ref({});

</script>

<template>
    <div class="container mx-auto">

      <div class="info-group">
        <div class="md:text-xl font-bold">
          基本資料
        </div>

        <div class="mt-2 flex items-center">
          <span>名稱</span>
          <input v-model="shop.username" class="ml-2 text-input-primary flex-1" type="text" name="username" placeholder="名稱"/>
        </div>
        <div class="mt-2 flex items-center">
          <span>全名</span>
          <input v-model="shop.fullName" class="ml-2 text-input-primary flex-1" type="text" name="fullName" placeholder="全名"/>
        </div>
        <div class="mt-2">
          描述
          <textarea v-model="shop.biography"
                    class="mt-1 w-full border rounded-md p-2"
                    rows="5"></textarea>
        </div>
        <div class="mt-2">
          <div>分類</div>
          <div class="flex items-center">
            <select class="border rounded-sm" v-model="selectedTag">
              <option value="" selected>選擇分類</option>
              <optgroup v-for="category in categories" :key="category['id']" :label="category['label']">
                <option v-for="tag in category.tags" :key="tag.id" :value="tag.id">{{ tag.label }}</option>
              </optgroup>
            </select>
            <button class="btn-sm btn-outline ml-2" @click="addSelectedTag">+</button>
          </div>
          <div class="mt-1">
            <div v-for="tag in shop.tags"
                 :key="tag"
                 class="chip">
              {{ `#${tagsLookup[tag]}` }}
              <button @click="shop.tags = shop.tags.filter((t) => t !== tag)"><i class="spr-cancel"></i></button>
            </div>
          </div>
        </div>
        <button @click="" class="mt-4 btn btn-primary">儲存</button>
      </div>


      <div class="info-group mt-4">
        <div class="md:text-xl font-bold">
          詳細資料
        </div>

        <div class="grid grid-cols-2 gap-8">
          <div class="table col-span-1">
            <div v-for="extraDataStringFieldKey of Object.keys(extraDataStringFields)" class="table-row">
              <div class="table-cell fit-width pr-2 pt-2">
                <i :class="extraDataLookup[extraDataStringFieldKey].iconClass"></i>
              </div>
              <div class="table-cell pt-2">
                <input v-model="shop.extraData[extraDataStringFieldKey]" class="text-input-primary w-full" type="text" :placeholder="extraDataLookup[extraDataStringFieldKey].title"/>
              </div>
            </div>
          </div>

          <div class="col-span-1">
            <div class="table">
              <div v-for="extraDataMultiStringFieldKey of ['paymentMethods', 'mailing']" class="table-row">
                <div class="table-cell fit-width pr-2 pb-4">
                  <i :class="extraDataLookup[extraDataMultiStringFieldKey].iconClass"></i>
                </div>
                <div class="table-cell pb-4">
                  <div class="flex items-center">
                    <input v-model="extraDataMultiStringFieldsTemp[extraDataMultiStringFieldKey]" class="text-input-primary" type="text" :placeholder="extraDataLookup[extraDataMultiStringFieldKey].title"/>
                    <button class="btn btn-outline ml-2" @click="shop.extraData[extraDataMultiStringFieldKey].push(extraDataMultiStringFieldsTemp[extraDataMultiStringFieldKey]); extraDataMultiStringFieldsTemp[extraDataMultiStringFieldKey] = ''">+</button>
                  </div>
                  <div v-for="value in shop.extraData[extraDataMultiStringFieldKey]"
                       :key="value"
                       class="chip">
                    {{ value }}
                    <button @click="shop.extraData[extraDataMultiStringFieldKey] = shop.extraData[extraDataMultiStringFieldKey].filter((v) => v !== value)"><i class="spr-cancel"></i></button>
                  </div>
                </div>
              </div>
            </div>
            <div class="table">
              <div v-for="extraDataBooleanFieldKey of Object.keys(extraDataBooleanFields)" class="table-row">
                <div class="table-cell fit-width pr-2 pb-4">
                  <i :class="extraDataLookup[extraDataBooleanFieldKey].iconClass"></i>
                  {{ extraDataLookup[extraDataBooleanFieldKey].title }}
                </div>
                <div class="table-cell pb-4">
                  <input type="checkbox" v-model="shop.extraData[extraDataBooleanFieldKey]">
                </div>
              </div>
            </div>
          </div>

        </div>

        <button @click="" class="mt-4 btn btn-primary">儲存</button>

      </div>

      <div class="info-group my-4">
        <div class="md:text-xl font-bold">
          登入資料
        </div>

        <div class="table">
          <div class="table-row">
            <div class="table-cell pr-2 pt-2">
              用戶名
            </div>
            <div class="table-cell pt-2">
              <input class="text-input-primary w-full" type="text" placeholder="用戶名"/>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell pr-2 pt-2">
              密碼
            </div>
            <div class="table-cell pt-2">
              <input class="text-input-primary w-full" type="password" placeholder="密碼"/>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell pr-2 pt-2">
              重新輸入密碼
            </div>
            <div class="table-cell pt-2">
              <input class="text-input-primary w-full" type="password" placeholder="重新輸入密碼"/>
            </div>
          </div>
        </div>



        <button @click="" class="mt-4 btn btn-primary">儲存</button>
      </div>


    </div>
</template>

<style scoped>

.info-group {
  @apply bg-white rounded-md border p-4;
}

.table-cell.fit-width {
  width: 1px;
  white-space: nowrap;
}

.chip {
  @apply inline-block text-pink-600 text-md border rounded-md p-2 mt-1 mr-2;
}

</style>
