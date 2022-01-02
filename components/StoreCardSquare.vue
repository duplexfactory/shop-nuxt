<script setup>
// Dummy data.
const storeName = 'caseonlyy';
const lastActiveDate = new Date();
const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth()}/${lastActiveDate.getFullYear()}`;
const description = 'description';
</script>

<template>
  <div class="border rounded-md grid grid-cols-2">
    <div class="p-4 col-span-1">
      <div class="bg-gray-300 rounded-full" style="aspect-ratio: 1; height: 80px;">

      </div>

      <div class="mt-2 font-semibold text-lg">{{ storeName }}</div>
      <div class="text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>

      <div class="mt-4 text-sm text-gray-500 flex flex-row">
        <div class="text-center" style="flex: 1;">
          <div>Followers</div>
          <div>1,000</div>
        </div>
        <div class="bg-gray-300 mx-2" style="width: 1px;"></div>
        <div class="text-center" style="flex: 1;">
          <div>Posts</div>
          <div>1,000</div>
        </div>
      </div>

      <div class="mt-2">
        <tag v-for="i in [1, 2, 3]"
             :key="i.toString()"
             class="mr-2 mt-2"
             title="Tag 1"></tag>
      </div>

      <button class="mt-4 text-white text-md bg-pink-400 px-6 py-2 rounded-md">進入店鋪</button>

    </div>

    <div class="col-span-1">
      <div class="bg-gray-300" style="aspect-ratio: 1;"></div>
      <div class="flex flex-row">
        <div class="bg-red-300" style="aspect-ratio: 1; flex: 1;"></div>
        <div class="bg-green-300" style="aspect-ratio: 1; flex: 1;"></div>
      </div>
    </div>
  </div>
</template>

