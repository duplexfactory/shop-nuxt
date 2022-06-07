<template>
    <div class="container mx-auto">
      <div class="w-full md:w-1/2">
        <h1 class="mt-8 text-2xl md:text-4xl font-bold">
          商戶登入
        </h1>
        <button @click="fbLogin" class="mt-4 btn text-white w-full" style="background: #4267b2;">
          <i class="spr-facebook-squared"></i>以Facebook登入
        </button>
        <div class="my-4 flex items-center">
          <hr class="flex-1"/>
          <span class="text-gray-500">或</span>
          <hr class="flex-1"/>
        </div>
        <input v-model="email" class="block text-input-primary w-full" type="text" name="email" placeholder="電郵">
        <input v-model="password" class="mt-4 block text-input-primary w-full" type="password" name="password" placeholder="密碼">
        <div class="mt-2 text-gray-400 text-right">
          <nuxt-link to="/auth/forgot-password" class="hover:underline cursor-pointer">忘記密碼</nuxt-link>
        </div>

        <div class="mt-4">
          <button @click="login" class="btn btn-primary" :disabled="loginLoading">登入</button>
          <div class="mt-2 text-gray-400">
            <span class="mr-1">未有帳戶？</span>
            <nuxt-link to="/verify" class="hover:underline cursor-pointer">立即申請</nuxt-link>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">

    import {
        getAuth,
        signInWithEmailAndPassword,
        FacebookAuthProvider,
        signInWithPopup
    } from "firebase/auth";
    import useFbLogin from "~/composables/useFbLogin";

    const router = useRouter();
    const nuxt = useNuxtApp();

    // Login
    const isLoggedIn = useIsLoggedIn();
    watch(
        () => isLoggedIn.value,
        async (isLoggedIn, prevIsLoggedIn) => {
          if (isLoggedIn === true) {
            await navigateTo("/my/account");
          }
        }
    )

    // Email password login.
    const email = ref("");
    const password = ref("");
    const loginLoading = ref(false);
    async function login() {
        try {
            loginLoading.value = true;

            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

            loginLoading.value = false;
            isLoggedIn.value = true;

            // Signed in
            const user = userCredential.user;
            await navigateTo("/my/account");
        } catch (firebaseSignInError) {
            const errorCode = firebaseSignInError.code;
            const errorMessage = firebaseSignInError.message;

            if (errorCode === "auth/user-not-found") {
              nuxt.vueApp.$toast.error("電郵或密碼錯誤", {position: "top"});
            }
            else {
              nuxt.vueApp.$toast.error("登入失敗", {position: "top"});
            }
            loginLoading.value = false;
        }
    }

    const {
      fbLogin
    } = useFbLogin()

</script>

<style scoped>

</style>
