<script setup>
    // Dummy data.
    const storeName = 'caseonlyy';
    const lastActiveDate = new Date();
    const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth() + 1}/${lastActiveDate.getFullYear()}`;
    const description = 'description';
</script>

<template>
    <div class="p-4 text-center">
        <div class="bg-gray-300 rounded-full mx-auto" style="aspect-ratio: 1; height: 100px;">
        </div>

        <div class="mt-2 font-semibold text-lg">{{ storeName }}</div>
        <div class="mt-2">
            <tag v-for="i in [1, 2, 3]"
                 :key="i.toString()"
                 class="mr-2"
                 title="Tag 1"></tag>
        </div>
        <button class="mt-4 btn-primary">探索</button>

    </div>
</template>
