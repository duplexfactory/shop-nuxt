<template>
  <div class="container mx-auto">
    <h1 class="mt-8 text-2xl md:text-4xl font-bold">
      商戶登入
    </h1>
    <input v-model="email" class="mt-4 block text-input-primary" type="text" name="email" placeholder="電郵">
    <input v-model="password" class="mt-4 block text-input-primary" type="password" name="password" placeholder="密碼">
    <button @click="login" class="mt-4 btn btn-primary">登入</button>

    <div class="mt-8 text-gray-500">
      <span class="mr-2">未有帳戶？</span><nuxt-link to="/verify" class="hover:underline cursor-pointer">立即申請</nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">

import {getAuth, signInWithEmailAndPassword, setPersistence, Persistence} from "firebase/auth";
import firebase from "firebase/compat";

// CSRF Token
const csrfToken = useCookie('csrfToken', {path: "/",});
if (process.server) {
  csrfToken.value = "123456"; // Assume this is a random hard to guess string.
}
// useMeta({
//   meta: [
//     {name: "csrf-token", content: csrfToken.value},
//   ]
// });

const email = ref("");
const password = ref("");

const router = useRouter();

async function login() {
  try {
    console.log("1");
    const auth = getAuth();
    console.log("2");
    // As httpOnly cookies are to be used, do not persist any state client side.
    // console.log(Auth.Persistence.NONE);
    // await setPersistence(auth, browserSessionPersistence);
    // await setPersistence(auth, Auth.Persistence.NONE);
    console.log("3");
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);


    // Get the user's ID token as it is needed to exchange for a session cookie.
    const idToken = await userCredential.user.getIdToken();
    // Session login endpoint is queried and the session cookie is set.
    // CSRF protection should be taken into account.
    console.log("4");
    const {data} = await useFetch('/api/auth/session-login', {method: 'POST', body: {idToken, csrfToken: csrfToken.value}});
    console.log("5");
    await auth.signOut();

    // Signed in
    await router.push({path: '/my/shop'});
  }
  catch (firebaseSignInError) {
    const errorCode = firebaseSignInError.code;
    const errorMessage = firebaseSignInError.message;
    console.log(firebaseSignInError);
    // this.$toast.error("登入失敗", {position: "top"});
  }
}

</script>

<style scoped>

</style>