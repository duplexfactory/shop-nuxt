<script setup lang="ts">

import {getAuth, onAuthStateChanged, signOut, User} from "firebase/auth";
import {useIsLoggedIn} from "~/composables/states";

// onMounted(() => {
//   const auth = getAuth();
//   onAuthStateChanged(auth, (value?: User) => {
//     if (value === null) {
//       // Not logged in.
//     }
//     else {
//       // Logged in.
//     }
//   });
// })

const router = useRouter();
const isLoggedIn = useIsLoggedIn();
if (isLoggedIn.value === true) {
  console.log("Already signed in.")
}
else if (isLoggedIn.value === false) {
  // Redirect.
  console.log("Already signed out.")
  router.replace("/login/shop");
}
else {
  console.log("Sign loading, ssr.")
}

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


const {data} = await useFetch(`/api/shop?id=43808406274`);
const {page: shop} = data.value

function logout() {
  const auth = getAuth();
  signOut(auth);
}

</script>

<template>
    <div class="container mx-auto">
      <button @click="logout">logout</button>
      {{ isLoggedIn }}

      <div class="info-group">
        <div class="md:text-xl font-bold">
          基本資料
        </div>

        <div>名稱<input v-model="shop.username" class="ml-2 text-input-primary" type="text" name="username" placeholder="名稱"/></div>
        <div>全名<input v-model="shop.fullName" class="ml-2 text-input-primary" type="text" name="fullName" placeholder="全名"/></div>
<!--        <div>描述<input v-model="username" class="text-input-primary" type="text" name="username" placeholder="描述"/></div>-->

<!--        <div>分類<input v-model="username" class="text-input-primary" type="text" name="username" placeholder="分類"/></div>-->

        <button @click="" class="mt-4 btn btn-primary">儲存</button>
      </div>


      <div class="info-group mt-4">
        <div class="md:text-xl font-bold">
          詳細資料
        </div>

<!--        <input v-model="username" class="mt-4 block w-full text-input-primary" type="text" name="username" placeholder="用戶名">-->
<!--        <input v-model="password" class="mt-4 block w-full text-input-primary" type="password" name="password" placeholder="密碼">-->
<!--        <input v-model="confirmPassword" @keyup.enter="register" class="mt-4 block w-full text-input-primary" type="password" name="reenter-password" placeholder="重新輸入密碼">-->
        <button @click="" class="mt-4 btn btn-primary">儲存</button>
      </div>


    </div>
</template>

<style scoped>

.info-group {
  @apply bg-white rounded-md border p-4;
}

</style>