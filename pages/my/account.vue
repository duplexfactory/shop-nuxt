<template>
    <div class="">
        <div v-if="authLoading"
             class="absolute z-50 flex flex-col justify-center items-center inset-0 bg-white"
             style="min-width: 100%; min-height: 100%;">
            <div>
                <i class="spr-spin4 animate-spin text-6xl text-pink-400"></i>
            </div>
        </div>

        <div class="info-group">
            <div class="md:text-xl font-bold">
                帳戶
            </div>

            <div class="table">
                <div class="table-row">
                    <div class="table-cell pr-2 pt-2">
                        電郵
                    </div>
                    <div class="table-cell pt-2">
                        <input class="text-input-primary w-full" type="text" placeholder="電郵"/>
                    </div>
                </div>
                <div class="table-row">
                    <div class="table-cell pr-2 pt-2">
                        <div>Instagram帳戶</div>
                        <div v-if="!verifiedPage" class="pt-2 text-gray-600 text-xs">連結帳戶後，你將能於本網站顯示貼文</div>
                    </div>
                    <div class="table-cell pt-2">
                        <button v-if="!verifiedPage" class="text-pink-600 py-4" @click="authorize()"><i
                            class="spr-instagram"></i>立即連結
                        </button>
                        <template v-else>
                            <a class="hover:underline text-pink-600 mr-2"
                               :href="`https://www.instagram.com/${pageUsername}/`"
                               target="_blank">{{ "@" + pageUsername }}</a>
                            <button class="text-gray-500 py-2" @click="verifiedPage = false">解除連結</button>
                        </template>
                    </div>
                </div>
            </div>
            <button @click="" class="mt-4 btn btn-primary">儲存</button>
        </div>
        <div class="info-group">
            <div class="md:text-xl font-bold">
                變更密碼
            </div>

            <div class="table">
                <div class="table-row">
                    <div class="table-cell pr-2 pt-2">
                        當前密碼
                    </div>
                    <div class="table-cell pt-2">
                        <input class="text-input-primary w-full" type="password" placeholder="當前密碼"/>
                    </div>
                </div>
                <div class="table-row">
                    <div class="table-cell pr-2 pt-2">
                        新密碼
                    </div>
                    <div class="table-cell pt-2">
                        <input class="text-input-primary w-full" type="password" placeholder="新密碼"/>
                    </div>
                </div>
                <div class="table-row">
                    <div class="table-cell pr-2 pt-2">
                        重新輸入新密碼
                    </div>
                    <div class="table-cell pt-2">
                        <input class="text-input-primary w-full" type="password" placeholder="重新輸入新密碼"/>
                    </div>
                </div>
            </div>
            <button @click="" class="mt-4 btn btn-primary">儲存</button>
        </div>
    </div>
</template>

<script setup lang="ts">
const {code} = useRoute().query
const verifiedPage = ref(false);
const pageUsername = ref("shoperuse");
const authLoading = ref(!!code);

function authorize() {
  const config = useRuntimeConfig();

  const url = new URL(`https://api.instagram.com/oauth/authorize`)

  url.searchParams.set("client_id", config.IG_APP_ID)
  url.searchParams.set("redirect_uri", config.DOMAIN + `/my/account`)
  url.searchParams.set("scope", "user_profile,user_media")
  url.searchParams.set("response_type", "code")

  window.location.assign(url.href)
}

onMounted(async () => {
  if (code) {
    const {getAuthHeader} = useAuth()
    const {username} = await $fetch("/api/auth/ig-code", {
      params: {code},
      headers: await getAuthHeader()
    })
    pageUsername.value = username
    verifiedPage.value = true
    authLoading.value = false
  }
});
</script>

<style scoped>

    .info-group {
        @apply bg-white rounded-md border p-4 mb-4;
    }


</style>
