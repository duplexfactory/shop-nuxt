<template>
    <div class="container mx-auto">
        <h1 class="mt-8 text-2xl md:text-4xl font-bold">
            商戶登入
        </h1>
        <input v-model="email" class="mt-4 block text-input-primary" type="text" name="email" placeholder="電郵">
        <input v-model="password" class="mt-4 block text-input-primary" type="password" name="password"
               placeholder="密碼">
        <button @click="login" class="mt-4 btn btn-primary">登入</button>

        <div class="mt-8 text-gray-500">
            <span class="mr-2">未有帳戶？</span>
            <nuxt-link to="/verify" class="hover:underline cursor-pointer">立即申請</nuxt-link>
        </div>
        <div class="mt-2 text-gray-500">
            <nuxt-link to="/auth/forgot-password" class="hover:underline cursor-pointer">忘記密碼？</nuxt-link>
        </div>
    </div>
</template>

<script setup lang="ts">

    import {
        getAuth,
        signInWithEmailAndPassword
    } from "firebase/auth";


    const email = ref("");
    const password = ref("");

    const router = useRouter();

    // Login
const isLoggedIn = useIsLoggedIn();

    async function login() {
        try {
            const auth = getAuth();

            const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

            isLoggedIn.value = true;

            // Signed in
            const user = userCredential.user;
            await router.push({path: '/my/shop'});
        } catch (firebaseSignInError) {
            const errorCode = firebaseSignInError.code;
            const errorMessage = firebaseSignInError.message;

            // this.$toast.error("登入失敗", {position: "top"});
        }
    }

</script>

<style scoped>

</style>
