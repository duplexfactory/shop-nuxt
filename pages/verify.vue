<template>
    <div>
        <section>
          <div class="container mx-auto">
            <div class="md:grid grid-cols-2 gap-8">
              <div class="col-span-1">
                <h1 class="text-4xl md:text-5xl font-bold ">
                  認證IG shop
                </h1>
                <h2 class="text-xl md:text-2xl font-bold mt-4">
                  輕鬆IG shop創業
                </h2>

                <div class="mt-8">
                  <div>
                    已開設IG shop，可惜不夠客戶。。。
                  </div>
                  <div class="mt-4">
                    客戶在Instagram上很難搜尋你的商品、亦很難得知商店的可信性，<b>導致流失大量客戶</b>。
                  </div>
                  <div class="mt-4">
                    所以此平台採用了電商平台設計、為IG shop自動分類、搭配評分及核實系統。讓你的商店能夠<b>更清晰、可信、準確地展示給你的目標客戶</b>。
                  </div>
                </div>

                <div class="flex items-center mt-8">
                  <button @click="scrollToVerify" class="btn btn-primary">立即免費認證</button>
                  <span class="mx-4">或</span>
                  <button @click="scrollToPoints">了解更多</button>
                </div>

              </div>

              <img class="mt-8 md:mt-0" src="~assets/images/ig_shop.jpg"/>

            </div>
          </div>
        </section>

        <section ref="pointsSection">
          <div class="container mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div v-for="point in points" class="col-span-1 rounded bg-white md:text-center p-4">
                <div class="text-pink-400 text-2xl font-semibold">{{point.title}}</div>
                <!--                <div class="mt-4">{{point.subtitle}}</div>-->
                <div class="mt-4 text-sm">{{point.content}}</div>
              </div>
            </div>
          </div>
        </section>


        <section ref="verifySection">
          <div class="container mx-auto">
            <h2 class="text-4xl md:text-5xl font-bold text-center">
              簡單兩步認證
            </h2>

            <div class="mt-8 grid grid-cols-1 md:grid-cols-11">
              <div class="col-span-3 flex flex-col items-center">
                <i class="spr-edit text-4xl"></i>
                <div class="verify-step-text">
                  1. 註冊Shoperuse帳戶
                </div>
              </div>
              <div class="col-span-1 py-4 flex items-center justify-center text-4xl">
                <i class="md:hidden spr-angle-down"></i>
                <i class="hidden md:inline-block spr-angle-right"></i>
              </div>
              <div class="col-span-3 flex flex-col items-center">
                <i class="spr-link text-4xl"></i>
                <div class="verify-step-text">
                  2. 登入後連結IG帳戶
                </div>
              </div>
              <div class="col-span-1 py-4 flex items-center justify-center text-4xl">
                <i class="md:hidden spr-angle-down"></i>
                <i class="hidden md:inline-block spr-angle-right"></i>
              </div>
              <div class="col-span-3 flex flex-col items-center">
                <i class="spr-ok text-4xl"></i>
                <div class="verify-step-text">
                  完成認證
                </div>
              </div>
            </div>

            <div class="md:grid grid-cols-2 gap-16 mt-16">
              <div class="col-span-1 font-light bg-white md:order-2">
                <div class="text-4xl md:text-5xl font-bold ">
                  立即認證
                </div>
                <div class="mt-8 text-gray-600 text-xl md:text-2xl">
                  <ul>
                    <li v-for="feature in features" :key="feature" class="mt-2 flex">
                      <span class="font-bold mr-4 block">✓</span>{{ feature }}
                    </li>
                  </ul>
                </div>

              </div>
              <div class="col-span-1 bg-gray-100 mt-8 md:mt-0 md:order-1">
                <div class="bg-white rounded-md border p-8">
                  <h2 class="text-xl md:text-2xl font-bold">
                    註冊
                  </h2>
                  <button @click="fbLogin" class="mt-4 btn text-white w-full" style="background: #4267b2;">
                    <i class="spr-facebook-squared mr-2"></i>以Facebook註冊
                  </button>
                  <div class="my-4 flex items-center">
                    <hr class="flex-1"/>
                    <span class="text-gray-500">或</span>
                    <hr class="flex-1"/>
                  </div>
                  <input v-model="email" class="mt-4 block w-full text-input-primary" type="text" name="email" placeholder="電郵">
                  <input v-model="password" class="mt-4 block w-full text-input-primary" type="password" name="password" placeholder="密碼">
                  <input v-model="confirmPassword" @keyup.enter="register" class="mt-4 block w-full text-input-primary" type="password" name="reenter-password" placeholder="重新輸入密碼">
                  <button :disabled="isRegisterLoading" @click="register" class="mt-4 btn btn-primary">立即註冊</button>
                  <div class="mt-4 text-gray-400">註冊即代表你已同意Shoperuse的<nuxt-link class="hover:underline" to="/privacy-policy">《私隱條款》</nuxt-link></div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </div>
</template>

<script lang="ts" setup>

import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import useFbLogin from "~/composables/useFbLogin";
const nuxt = useNuxtApp();

// Meta
useMeta(computed(() => {
  const title = `認證 IG Shop | IG Shop 推薦及評論平台 | Shoperuse`;
  const metaDescription = "立即於Shoperuse免費認證你IG Shop以增加客戶及曝光。Shoperuse已整理及分類超過3000間香港的IG Shop，令買家輕鬆搜尋、瀏覽、發掘大眾推薦的IG Shop，立即了解！";
  return {
    title,
    meta: [
      {name: "description", hid: "description", content: metaDescription},
      {property: "og:title", hid: "og:title", content: title},
      {property: "og:description", hid: "og:description", content: metaDescription}
    ]
  }
}));

const verifySection = ref(null);
function scrollToVerify() {
  if (verifySection.value !== null) {
    // Use el.scrollIntoView() to instantly scroll to the element
    verifySection.value.scrollIntoView({behavior: 'smooth'});
  }
}

const pointsSection = ref(null);
function scrollToPoints() {
  if (pointsSection.value !== null) {
    pointsSection.value.scrollIntoView({behavior: 'smooth'});
  }
}

const features = [
  '完全免費',
  '註冊後只需透過Instagram登入來連結，無需其他設置',
  '隨意修改商店資料',

  // '只需透過Instagram登入，無需額外設置',

  // '拓展客源',
  // '可認證IG shop商業登記，提高可信性',
  //
];

const points = [
  // {title: "拓展客源", subtitle: "更好的展示方式", content: "我們採用了比IG更類似電商平台的設計，而且為各商店分類。讓你的商店能夠更清晰、準確地展示給你的目標客戶。"},
  // {title: "提高可信性", subtitle: "商業登記核實", content: "認證你的商店後，你更可以上載商業登記副本。經核實後可以獲得認證標記，讓客戶可以更放心在你的商店消費。"},
  // {title: "更改資料", subtitle: "修改分類、描述", content: "假如你認爲你的商店分類或你IG上的描述不適合此平台，認證後你將可以隨意修改。"},

  {title: "拓展客源", subtitle: "更好的展示方式", content: "我們採用了比IG更類似電商平台的設計，並為各商店分類。讓你的商店能更清晰、準確地展示給你的目標客戶。"},
  {title: "展示IG資訊", subtitle: "商業登記核實", content: "認證後，我們將在Shoperuse上展示你在IG的簡介、頭像等資訊，讓用戶可以更清楚了解你的商店。"},
  {title: "更改資料", subtitle: "修改分類、描述", content: "假如你認爲Shoperuse上你的商店分類或資料有任何錯誤，認證後你將可以隨意修改。"},
]

// Register
const isRegisterLoading = ref(false);
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
async function register() {
  if (email.value == "" || password.value == "" || confirmPassword.value == "") {
    nuxt.$toast.error("請填寫所有欄位！");
    return;
  }

  if (password.value.length < 6) {
    nuxt.$toast.error("密碼長度最少為6！");
    return;
  }

  if (password.value !== confirmPassword.value) {
    nuxt.$toast.error("請確保兩次輸入的密碼一致！");
    return;
  }

  try {
    isRegisterLoading.value = true;

    (await $fetch('/api/auth/register', { method: 'POST', body: { email: email.value, password: password.value }}));

    nuxt.$toast.success("成功註冊！");

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);

      // Signed in
      const user = userCredential.user;
      // $router.push({path: '/my/shop'});

      isRegisterLoading.value = false;
    }
    catch (firebaseSignInError) {
      const errorCode = firebaseSignInError.code;
      const errorMessage = firebaseSignInError.message;
      nuxt.$toast.error("登入失敗");

      isRegisterLoading.value = false;
    }
  }
  catch(e) {
    nuxt.$toast.error("電郵已被使用！");

    isRegisterLoading.value = false;
  }

}

// Facebook login
const {
  fbLogin
} = useFbLogin()

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

</script>

<style scoped>

    section {
        @apply py-16;
    }

    section:nth-child(even) {
        @apply bg-gray-100;
    }

    .verify-step-text {
        @apply mt-4 text-gray-700 text-xl md:text-2xl font-bold text-center;
    }

</style>
