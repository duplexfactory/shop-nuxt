<template>
    <div class="container mx-auto">
        <div v-if="valid === true">
            <h1 class="mt-8 text-xl md:text-2xl font-bold">
                重設密碼
            </h1>
            <input v-model="password" class="mt-4 block text-input-primary" type="password" name="password"
                   placeholder="新密碼">
            <input v-model="rePassword" class="mt-4 block text-input-primary" type="password" name="re-password"
                   placeholder="確認密碼">
            <div lass="mt-2 text-red-300" v-if="error">{{ error }}</div>
            <button @click="confirm" class="mt-4 btn btn-primary">設定新密碼</button>
        </div>
        <div v-else-if="valid === false">
            <h1 class="mt-8 text-xl text-gray-700">
                連結已失效，請重新接收密碼重設電郵
            </h1>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ActionCodeOperation, checkActionCode, getAuth} from "firebase/auth";

    import {throwError} from "#app";
    import {confirmPasswordReset} from "@firebase/auth";

    const route = useRoute();
    const password = ref("");
    const rePassword = ref("");
    const error = ref("");
    const valid = ref(null);

    function err() {
        const error = new Error();
        (error as any).statusCode = 404;
        throwError(error)
    }

    function guard(cond: boolean) {
        if (cond) err();
    }

    const oobCode = route.query.oobCode as string;
    guard(!oobCode);

    // const {operation} = await checkActionCode(getAuth(), oobCode);
    // guard(operation !== ActionCodeOperation.PASSWORD_RESET);

    onMounted(async () => {
        try {
            const {operation} = await checkActionCode(getAuth(), oobCode);
            guard(operation !== ActionCodeOperation.PASSWORD_RESET);
            valid.value = true
        } catch {
            valid.value = false
        }
    })

    async function confirm() {
        if (password.value.length < 6) {
            error.value = "密碼最少為6位"
            return;
        }
        if (password.value !== rePassword.value) {
            error.value = "確認密碼不符"
            return;
        }

        try {
            await confirmPasswordReset(getAuth(), oobCode, password.value)
            await useRouter().replace("/auth/reset-password-done")
        } catch {
            valid.value = false
        }
    }

</script>

<style scoped>

</style>
