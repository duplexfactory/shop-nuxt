<script setup>
    // Dummy data.
    const storeName = 'caseonlyy';
    const lastActiveDate = new Date();
    const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth() + 1}/${lastActiveDate.getFullYear()}`;
    const description = 'description';
</script>

<template>
    <div class="container mx-auto pb-20">

        <div class="mt-10 text-xl">Components Showcase</div>

        <div class="mt-8 mb-4">Post Card</div>
        <div class="grid grid-cols-8">
            <div class="p-4 col-span-1">
                <div class="bg-gray-300 rounded-md" style="aspect-ratio: 1;"></div>
                <div class="mt-2">Post content long long long long long long long long long long long long long</div>
                <div class="mt-2 text-sm text-gray-500">{{ storeName }}</div>
                <button class="mt-4 text-white text-md bg-pink-400 px-6 py-2 rounded-md">探索</button>
            </div>
        </div>

        <div class="mt-8 mb-4">Store Card Simple</div>
        <div class="flex flex-row">
            <StoreCardSimple></StoreCardSimple>
        </div>

        <div class="mt-8 mb-4">Store Card Square</div>
        <div class="grid grid-cols-3">
            <div class="col-span-1">
                <StoreCardSquare></StoreCardSquare>
            </div>
        </div>

        <div class="mt-8 mb-4">Store Card Rectangle</div>
        <div class="border rounded-md p-4 flex flex-row">
            <div class="mr-4">
                <div class="bg-gray-300 rounded-full" style="aspect-ratio: 1; height: 80px;">

                </div>

                <div class="mt-2 font-semibold text-lg">{{ storeName }}</div>
                <div class="text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>

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

                <div class="mt-4 flex">
                    <tag v-for="i in [1, 2, 3]"
                         :key="i.toString()"
                         class="mr-2"
                         title="Tag 1"></tag>
                </div>

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
</template>
