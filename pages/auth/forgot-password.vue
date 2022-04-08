<template>
    <div class="container mx-auto">
        <div v-if="!done">
            <h1 class="mt-8 text-xl md:text-2xl font-bold">
                重設密碼
            </h1>
            <div class="text-gray-700">請輸入您的帳戶電郵以重設密碼</div>
            <input v-model="email" class="mt-4 block text-input-primary" type="text" name="email"
                   placeholder="電郵">
            <button @click="confirm" class="mt-4 btn btn-primary" :disabled="disabled">確認</button>
            {{disabled.value}}
        </div>
        <div v-else>
            <h1 class="mt-8 text-xl text-gray-700">
                已發送至{{ email }}，請檢查電郵以重設密碼
            </h1>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {getAuth, sendPasswordResetEmail} from "firebase/auth";
    import {computed} from "@vue/reactivity";

    const email = ref("")
    const done = ref(false)

    const emailRegEx = /^\w([\.-]?\w)*@\w([\.-]?\w)*(\.\w{2,3})$/
    const disabled = computed(() => !emailRegEx.test(email.value))

    async function confirm() {
        await sendPasswordResetEmail(getAuth(), email.value)
        done.value = true
    }

</script>

<style scoped>

</style>
