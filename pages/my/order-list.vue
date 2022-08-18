<template>
  <div>
    {{ orders }}
  </div>
</template>

<script lang="ts" setup>

const {
  getAuthHeader,
  headersToObject
} = useAuth()

const orders = ref([])

if (process.client) {
  const {
    data,
    pending,
    error
  } = await useLazyFetch("/api/order/list/shop", { headers: headersToObject(await getAuthHeader())})
  if (pending.value) {
    watch(data, () => {
      orders.value = data.value.orders
    })
  }
  else {
    orders.value = data.value.orders
  }
}


</script>

<style scoped>

</style>