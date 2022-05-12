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
<!--                        <input v-model="email" class="text-input-primary w-full" type="text" placeholder="電郵"/>-->
                        <div>{{email}}</div>
                    </div>
                </div>
                <div class="table-row">
                    <div class="table-cell pr-2 pt-2">
                        <div>Instagram帳戶</div>
                        <div v-if="!isIgConnected" class="pt-2 text-gray-600 text-xs">連結帳戶後，你將能於本網站顯示貼文</div>
                    </div>
                    <div class="table-cell pt-2">
                        <button v-if="!isIgConnected" class="text-pink-600 py-4" @click="authorize"><i
                            class="spr-instagram"></i>立即連結
                        </button>
                        <template v-else>
                            <a class="hover:underline text-pink-600 mr-2"
                               :href="`https://www.instagram.com/${igUsername}/`"
                               target="_blank">{{ "@" + igUsername }}</a>
                            <button class="text-gray-500 py-2" @click="isIgConnected = false">解除連結</button>
                        </template>
                    </div>
                </div>
            </div>
<!--            <button @click="" class="mt-4 btn btn-primary">儲存</button>-->
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
                        <input class="text-input-primary w-full" type="password" autocomplete="new-password" v-model="currentPw" placeholder="當前密碼"/>
                    </div>
                </div>
                <div class="table-row">
                    <div class="table-cell pr-2 pt-2">
                        新密碼
                    </div>
                    <div class="table-cell pt-2">
                        <input class="text-input-primary w-full" type="password" autocomplete="new-password" v-model="password" placeholder="新密碼"/>
                    </div>
                </div>
                <div class="table-row">
                    <div class="table-cell pr-2 pt-2">
                        重新輸入新密碼
                    </div>
                    <div class="table-cell pt-2">
                        <input class="text-input-primary w-full" type="password" autocomplete="new-password" v-model="rePassword" placeholder="重新輸入新密碼"/>
                    </div>
                </div>
            </div>
            <div class="mt-2 font-semibold text-red-500" v-if="pwErr">{{pwErr}}</div>
            <button @click="changePw" class="mt-4 btn btn-primary">儲存</button>
        </div>
    </div>
</template>

<script setup lang="ts">

import {getAuth, User} from "firebase/auth"
import {EmailAuthProvider, reauthenticateWithCredential, updatePassword} from "@firebase/auth"

const {code} = useRoute().query
const isIgConnected = useIsIgConnected()
const igUsername = useIgUsername();
const authLoading = ref(!!code);

const {
  authorize
} = useIgAuth();

onMounted(async () => {
  if (code) {
    const {getAuthHeader} = useAuth()
    const {username} = await $fetch("/api/auth/ig-code", {
      params: {code},
      headers: await getAuthHeader()
    })
    igUsername.value = username
    isIgConnected.value = true
    authLoading.value = false
  }
});

const currentUser = useCurrentUser();
const email = ref("");
email.value = currentUser.value?.email ?? "";
watch(
    () => currentUser.value,
    async (u: User, prevU) => {
      email.value = u?.email ?? "";
    }
)

const currentPw = ref("")
const password = ref("")
const rePassword = ref("")
const pwErr = ref("")

async function changePw() {
  if (password.value.length < 6) {
    pwErr.value = "密碼最少為6位"
    return;
  }
  if (password.value !== rePassword.value) {
    pwErr.value = "確認密碼不符"
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(
      currentUser.value.email,
      currentPw.value
    );
    await reauthenticateWithCredential(currentUser.value, credential)
    await updatePassword(currentUser.value, password.value)
  } catch(e) {
    pwErr.value = "當前密碼不符"
    return;
  }

  [currentPw, password, rePassword, pwErr].forEach(r => r.value = "")
  const nuxt = useNuxtApp()
  nuxt.vueApp.$toast.success("成功更改密碼", {position: "top"})
}
</script>

<style scoped>

    .info-group {
        @apply bg-white rounded-md border p-4 mb-4;
    }


</style>
