
<template>
  <div>
    <div class="sm:container mx-auto px-4 sm:px-0 py-4 sm:py-5 flex items-center justify-between">
      <!-- left -->
      <div class="flex items-center flex-1">

        <button @click="$emit('toggleDrawer')">
          Drawer
        </button>

        <div class="mr-4">LOGO HERE</div>

        <button class="sm:hidden border py-2 pl-4 pr-8 text-sm text-gray-400">
          商店 或 貼文
        </button>
        <div class="hidden sm:block">
          <input class="border py-2 px-4 text-md flex-1" style="max-width: 300px;" placeholder="商店 或 貼文" type="search" autocomplete="off" id="search" name="search" />
          <button class="border border-pink-400 btn-primary !rounded-none">搜尋</button>
        </div>

      </div>

      <!-- right -->
      <div class="hidden md:block">
        <button class="btn-outline">認證我的商店</button>
      </div>
    </div>
    <!--<div id="nav" class="container">nav</div>-->
  </div>

</template>

<script setup>
</script>
