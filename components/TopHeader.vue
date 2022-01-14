
<template>
  <div>
    <div class="container mx-auto pt-5 pb-4 flex items-center justify-between">
      <!-- left -->
      <div class="flex items-center flex-1">
        <div class="mr-4">LOGO HERE</div>
        <input class="border py-2 px-4 text-md flex-1" style="max-width: 300px;" placeholder="商店 或 產品 名稱" type="search" autocomplete="off" id="search" name="search" />
        <button class="border border-pink-400 btn-primary !rounded-none">搜尋</button>
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
