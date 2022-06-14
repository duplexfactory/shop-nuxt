<script setup lang="ts">

  import IgPageExtraData from "~/models/IgPageExtraData"
  import {extraDataLookup} from "~/models/PageInfoRow"
  import {useIgUsername} from "~/composables/states"
  import type {Ref} from "vue"
  import {PageSearch} from "~/models/PageSearch"

  const nuxt = useNuxtApp()

  const shop: Ref<PageSearch> = ref<PageSearch>(null)
  const {categories, tagsLookup} = useTags()
  const selectedTag = ref("")

  function addSelectedTag() {
    if (shop.value.tags.includes(selectedTag.value) || selectedTag.value === "") {
      return
    }
    shop.value.tags.push(selectedTag.value)
  }

  type PickType<T, U> = Record<{
    [K in keyof T]: T[K] extends U ? K : never
  }[keyof T], U>
  const extraDataStringFields: (keyof PickType<IgPageExtraData, string>)[] = [
    "phone",
    "whatsapp",
    "wechat",
    "signal",
    "email",
    "address",
    "openHours",
    "link", // IgPage.externalUrl
    "relatedPage",
    "facebook",
    "discount",
    "shopSince",
  ]
  function extraDataStringFieldPaste(e, key: (keyof PickType<IgPageExtraData, string>)) {
    if (key === "phone" || key === "whatsapp" || key === "signal") {
      let paste = (e.clipboardData || window.clipboardData).getData('text')
      shop.value.extraData[key] = paste.replace(/[^0-9]/g, '')
      e.preventDefault()
    }
  }
  function extraDataStringFieldKeyPress(e: KeyboardEvent, key: (keyof PickType<IgPageExtraData, string>)) {
    if (key === "phone" || key === "whatsapp" || key === "signal") {
      if (e.key === " " || isNaN(Number(e.key))) {
        return e.preventDefault()
      }
    }
  }

  const extraDataBooleanFields: (keyof PickType<IgPageExtraData, boolean>)[] = [
    "br",
    "noRefund",
    "noIgDM",
    "noPhoneCall",
  ]

  const extraDataMultiStringFieldsTemp = ref({})
  const extraDataMultiStringFields: (keyof PickType<IgPageExtraData, string[]>)[] = [
    "paymentMethods",
    "mailing"
  ]
  function addMultiStringField(key: (keyof PickType<IgPageExtraData, string[]>)) {
    if (!!extraDataMultiStringFieldsTemp.value[key]) {
      shop.value.extraData[key].push(extraDataMultiStringFieldsTemp.value[key])
      extraDataMultiStringFieldsTemp.value[key] = ''
    }
    else {
      nuxt.vueApp.$toast.error("不能增加空白！", {position: "top"});
    }
  }

  // Licence
  const licenceChecked = ref(false)
  const licenceNumber = ref("")
  watch(licenceChecked, (checked, prevChecked) => {
    shop.value.extraData.licence = checked
    if (!checked) {
      licenceNumber.value = ""
    }
  })
  watch(licenceNumber, (n, prevN) => {
    if (n === "") {
      shop.value.extraData.licence = licenceChecked.value
    } else {
      shop.value.extraData.licence = licenceNumber.value
    }
  })

  const isIgConnected = useIsIgConnected()
  const igUsername = useIgUsername()

  async function init(username: string) {
    const {data} = await useFetch(`/api/shop/username/${username}`)
    shop.value = data.value.page

    if (!shop.value.extraData) {
      shop.value.extraData = {}
    }
    for (const key of extraDataMultiStringFields) {
      if (!shop.value.extraData[key])
        shop.value.extraData[key] = []
    }

    licenceChecked.value = !!shop.value.extraData.licence
    licenceNumber.value = (!!shop.value.extraData.licence && typeof shop.value.extraData.licence === "string" ? shop.value.extraData.licence : "")
  }

  if (igUsername.value) {
    await init(igUsername.value)
  } else {
    watch(igUsername, () => init(igUsername.value))
  }

  const {
    authorize
  } = useIgAuth();

  // Edit basic data.
  const basicDataSaving = ref(false);
  async function saveBasic() {
    if (shop.value === null)
      return;

    const body = ["username", "fullName", "biography", "tags"].reduce((prev, k) => {
      prev[k] = shop.value[k]
      return prev
    }, {});

    basicDataSaving.value = true;
    const {getAuthHeader} = useAuth()
    await $fetch('/api/shop/edit/self-basic', { headers: await getAuthHeader(), method: 'PUT', body})
    basicDataSaving.value = false;

    nuxt.vueApp.$toast.success("成功儲存基本資料！", {position: "top"});
  }

  // Edit extra data.
  const extraDataSaving = ref(false);
  async function saveExtra() {

    const body = {
      ...shop.value.extraData,
    };
    if (licenceChecked.value) {
      body.licence = licenceNumber.value === "" ? true : licenceNumber.value
    }
    else {
      body.licence = false
    }

    extraDataSaving.value = true;
    const {getAuthHeader} = useAuth()
    await $fetch('/api/shop/edit/self-extra', { headers: await getAuthHeader(), method: 'PUT', body})
    extraDataSaving.value = false;

    nuxt.vueApp.$toast.success("成功儲存詳細資料！", {position: "top"});
  }

  // Placeholder.
  function placeholder(extraDataKey: keyof IgPageExtraData) {
    if (extraDataKey === "phone" || extraDataKey === "whatsapp" || extraDataKey === "signal") {
      return extraDataLookup[extraDataKey].title + " （不用 +號 或 空白鍵）"
    }
    if (extraDataKey === "relatedPage") {
      return extraDataLookup[extraDataKey].title + " （請輸入IG名稱）"
    }
    if (extraDataKey === "facebook") {
      return extraDataLookup[extraDataKey].title + " （e.g. https://www.facebook.com/igshop）"
    }
    return extraDataLookup[extraDataKey].title
  }

</script>

<template>
  <div>
    <template v-if="!isIgConnected || !shop">
      <div class="info-group flex justify-center">
        <div class="text-center w-3/5">
          <button class="btn-primary" @click="authorize"><i class="spr-instagram mr-2"></i>連結Instagram帳戶</button>
          <div class="mt-4">
            以你的Instagram帳戶登入後，即可<b>隨意修改你的IG Shop在Shoperuse上的資訊</b>，更可於<b>Shoperuse搜尋結果顯示你的IG Shop貼文照片</b>！
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex mb-4">
        <nuxt-link class="btn-outline" :to="`/shop/${igUsername}`">查看商店頁面</nuxt-link>
      </div>

      <div class="info-group">
        <div class="md:text-xl font-bold">
          基本資料
        </div>

        <div class="mt-2 flex items-center">
          <span>名稱</span>
          <input v-model="shop.username" disabled class="ml-2 text-input-primary flex-1" type="text" name="username"
                 placeholder="名稱"/>
        </div>
        <div class="mt-2 flex items-center">
          <span>全名</span>
          <input v-model="shop.fullName" class="ml-2 text-input-primary flex-1" type="text" name="fullName"
                 placeholder="全名"/>
        </div>
        <div class="mt-2">
          描述
          <div class="my-1 text-sm text-gray-500">
            建議電話、WhatsApp、地址等資料於「詳細資料」部分才填寫，避免重複。
          </div>
          <textarea v-model="shop.biography"
                    class="mt-1 w-full border rounded-md p-2"
                    rows="5"></textarea>
        </div>
        <div class="mt-2">
          <div>分類</div>
          <div class="my-1 text-sm text-gray-500">
            建議選擇最少一個分類，否則用戶按分類搜尋時不會找到你的IG Shop。
          </div>
          <div class="flex items-center">
            <select class="border rounded-sm text-sm p-1" v-model="selectedTag">
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
        <button @click="saveBasic" :disabled="basicDataSaving" class="mt-4 btn btn-primary">儲存</button>
      </div>
      <div class="info-group">
        <div class="md:text-xl font-bold">
          詳細資料
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div class="table col-span-1">
            <div v-for="extraDataStringFieldKey of extraDataStringFields" class="table-row">
              <div class="table-cell fit-width pr-2 pt-2">
                <i :class="extraDataLookup[extraDataStringFieldKey].iconClass"></i>
              </div>
              <div class="table-cell pt-2">
                <input v-model="shop.extraData[extraDataStringFieldKey]"
                       @paste="extraDataStringFieldPaste($event, extraDataStringFieldKey)"
                       @keypress="extraDataStringFieldKeyPress($event, extraDataStringFieldKey)"
                       class="text-input-primary w-full"
                       type="text"
                       :placeholder="placeholder(extraDataStringFieldKey)"/>
              </div>
            </div>
          </div>

          <div class="col-span-1">
            <div class="table w-full">

              <div v-for="extraDataMultiStringFieldKey of extraDataMultiStringFields" class="table-row">
                <div class="table-cell fit-width pr-2 pb-4">
                  <i :class="extraDataLookup[extraDataMultiStringFieldKey].iconClass"></i>
                </div>
                <div class="table-cell pb-4">
                  <div class="flex items-center">
                    <input size="1" style="flex: 1;"
                           v-model="extraDataMultiStringFieldsTemp[extraDataMultiStringFieldKey]"
                           class="text-input-primary" type="text"
                           :placeholder="extraDataLookup[extraDataMultiStringFieldKey].title"/>
                    <button class="btn btn-outline ml-2"
                            @click="addMultiStringField(extraDataMultiStringFieldKey)">
                      +
                    </button>
                  </div>
                  <div v-for="value in shop.extraData[extraDataMultiStringFieldKey]"
                       :key="value"
                       class="chip">
                    {{ value }}
                    <button
                      @click="shop.extraData[extraDataMultiStringFieldKey] = shop.extraData[extraDataMultiStringFieldKey].filter((v) => v !== value)">
                      <i class="spr-cancel"></i></button>
                  </div>
                </div>
              </div>

              <div class="table-row">
                <div class="table-cell fit-width pr-2 pb-4">
                  <i :class="extraDataLookup['licence'].iconClass"></i>
                </div>
                <div class="table-cell pb-4">
                  <div class="w-full flex justify-between items-center">
                    <label for="checkbox-licence" class="py-2 text-md">
                      {{ extraDataLookup['licence'].title }}
                    </label>
                    <input type="checkbox" id="checkbox-licence" v-model="licenceChecked">
                  </div>
                  <input v-if="licenceChecked" v-model="licenceNumber" class="text-input-primary w-full" type="text"
                         placeholder="牌照號碼"/>
                </div>
              </div>

              <div v-for="extraDataBooleanFieldKey of extraDataBooleanFields" class="table-row">
                <div class="table-cell fit-width pr-2 pb-4">
                  <i :class="extraDataLookup[extraDataBooleanFieldKey].iconClass"></i>
                </div>
                <div class="table-cell pb-4">
                  <div class="w-full flex justify-between items-center">
                    <label :for="'checkbox-' + extraDataBooleanFieldKey" class="py-2 text-md">
                      {{ extraDataLookup[extraDataBooleanFieldKey].title }}
                    </label>
                    <input type="checkbox" :id="'checkbox-' + extraDataBooleanFieldKey"
                           v-model="shop.extraData[extraDataBooleanFieldKey]">
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <button @click="saveExtra" :disabled="extraDataSaving" class="mt-4 btn btn-primary">儲存</button>

      </div>
    </template>
  </div>
</template>

<style scoped>

  .info-group {
    @apply bg-white rounded-md border p-4 mb-4;
  }

  .table-cell.fit-width {
    width: 1px;
    white-space: nowrap;
  }

  .chip {
    @apply inline-block text-pink-600 text-md border rounded-md p-2 mt-1 mr-2;
  }

</style>
