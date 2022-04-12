<template>
  <div>
    <div class="info-group">
      <div class="md:text-xl font-bold">
        帳戶
      </div>

      <div class="table">
        <div class="table-row">
          <div class="table-cell pr-2 pt-2">
            用戶名
          </div>
          <div class="table-cell pt-2">
            <input class="text-input-primary w-full" type="text" placeholder="用戶名"/>
          </div>
        </div>
      </div>
      <button @click="" class="mt-4 btn btn-primary">儲存</button>
    </div>
    <div class="info-group">
      <div class="md:text-xl font-bold">
        變更密碼
      </div>

      <div class="table">
        <div class="table-row">
          <div class="table-cell pr-2 pt-2">
            當前密碼
          </div>
          <div class="table-cell pt-2">
            <input class="text-input-primary w-full" type="password" placeholder="當前密碼"/>
          </div>
        </div>
        <div class="table-row">
          <div class="table-cell pr-2 pt-2">
            新密碼
          </div>
          <div class="table-cell pt-2">
            <input class="text-input-primary w-full" type="password" placeholder="新密碼"/>
          </div>
        </div>
        <div class="table-row">
          <div class="table-cell pr-2 pt-2">
            重新輸入新密碼
          </div>
          <div class="table-cell pt-2">
            <input class="text-input-primary w-full" type="password" placeholder="重新輸入新密碼"/>
          </div>
        </div>
      </div>
      <button @click="" class="mt-4 btn btn-primary">儲存</button>
    </div>
  </div>
</template>

<script steup lang="ts">

const verifiedPage = true;

</script>

<style scoped>

.info-group {
  @apply bg-white rounded-md border p-4 mb-4;
}


</style>