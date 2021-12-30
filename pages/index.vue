<script setup>
const header = ref('Nuxt 3 starter template')
const { counter } = goSick();

const storeName = 'caseonlyy';

const res = await useFetch(`/api/shop?id=${storeName}`);
console.log(res.data.value);

// let res = await fetch(`https://www.instagram.com/${storeName}/?__a=1`);
// res = await res.text();
// const data = JSON.parse(res);

// const lastActiveDate = new Date(res.data.value.lastActive);
const lastActiveDate = new Date(); // Dummy
const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth()}/${lastActiveDate.getFullYear()}`;

// const description = res.data.value.description;
const description = 'description'; // Dummy


</script>

<template>
  <div>
    <h1 class="rounded-md bg-green-200 text-xl text-green-700 font-bold">
      {{ header }}
      {{ counter }}
      with <a href="https://vueuse.org/" target="_blank">VueUse</a> and <a href="https://windicss.org/" target="_blank">Windi CSS</a>.
    </h1>
    <p>
      Edit <strong>layouts/default.vue</strong> and <strong>windi.config.js</strong>.
    </p>
    <nuxt-link to="/hello">HEEEEEE</nuxt-link>



    <div class="container mx-auto">
      <div>
        Store Card Square
        <div>

          <div class="flex flex-row border">
            <div class="mr-4 bg-gray-500 rounded">
              Image Here
            </div>
            <div>
              <div class="font-semibold text-lg">Store name</div>
              <div class="mt-1 text-gray-500">Followers 1,000</div>
              <div class="mt-2 flex flex-row">
                <div v-for="i in [1, 2, 3]" :key="i.toString()" class="text-white text-sm bg-pink-400 px-2 py-1 rounded-lg mr-2">Tag 1</div>
              </div>
            </div>
          </div>
        </div>

        Store Card Rectangle
        <div class="border rounded-xl p-4 flex flex-row">
          <div class="mr-4">
            <div class="bg-gray-300 rounded-full" style="aspect-ratio: 1; height: 80px;">

            </div>

            <div class="mt-2 font-semibold text-lg">{{ storeName }}</div>

            <div class="mt-2 text-sm text-gray-500 flex flex-row">
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

            <div class="mt-4">
              <div v-for="i in [1, 2, 3]"
                   :key="i.toString()"
                   class="inline text-white text-xs bg-pink-400 px-2 py-1 rounded-lg mr-2">
                Tag 1
              </div>
            </div>
            <div class="mt-2 text-gray-500 text-xs">Last active {{ lastActive }}</div>

          </div>
          <div class="">
            <div class="text-gray-500">Tag line</div>
            <div class="mt-2 text-gray-500">{{ description }}</div>
            <div class="flex flex-row mt-2">
              <div v-for="i in [1, 2, 3]" :key="i.toString()" class="bg-gray-300 mr-2" style="aspect-ratio: 1; height: 100px;"></div>
            </div>
          </div>

        </div>

      </div>
    </div>


  </div>
</template>

