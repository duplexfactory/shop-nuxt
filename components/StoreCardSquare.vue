<script setup>
// Dummy data.
const storeName = 'caseonlyy';
const lastActiveDate = new Date();
const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth() + 1}/${lastActiveDate.getFullYear()}`;
const description = 'description';
</script>

<template>
  <div class="border rounded-md grid grid-cols-2">
    <div class="p-4 col-span-1">

      <div class="flex flex-row items-center">
        <div class="bg-gray-300 rounded-full" style="aspect-ratio: 1; height: 60px;"></div>

        <div class="ml-2 overflow-hidden">
          <div class="font-semibold text-lg truncate">{{ storeName }}</div>
          <div class="text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>
        </div>

      </div>


      <div class="mt-2 2xl:mt-4 text-sm text-gray-500 flex flex-row">
        <div class="text-center" style="flex: 1;">
          <div>粉絲</div>
          <div>1,000</div>
        </div>
        <div class="bg-gray-300 mx-2" style="width: 1px;"></div>
        <div class="text-center" style="flex: 1;">
          <div>貼文</div>
          <div>1,000</div>
        </div>
      </div>

      <div class="mt-1 2xl:mt-2" style="overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; /* number of lines to show */ -webkit-box-orient: vertical; font-size: 0;">
        <tag v-for="i in [1, 2, 3, 4, 5]"
             :key="i.toString()"
             class="mr-1 2xl:mr-2 mt-1 2xl:mt-2 px-1 py-0.5 2xl:px-2 2xl:py-1"
             title="Tag 1"></tag>
      </div>

      <button class="mt-2 2xl:mt-4 btn">進入店鋪</button>

    </div>

    <div class="col-span-1">
      <div class="bg-gray-300" style="aspect-ratio: 1;"></div>
      <div class="block lg:flex flex-row">
        <div class="bg-red-300" style="aspect-ratio: 1; flex: 1;"></div>
        <div class="bg-green-300" style="aspect-ratio: 1; flex: 1;"></div>
      </div>
    </div>
  </div>
</template>

