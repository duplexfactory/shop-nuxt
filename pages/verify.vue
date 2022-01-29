<template>
    <div>
        <section>
            <div class="md:grid grid-cols-2 gap-8">
                <div class="col-span-1">
                    <h1 class="text-4xl md:text-5xl font-bold text-blue">
                        認證IG shop
                    </h1>
                    <h2 class="text-xl md:text-2xl font-bold mt-4">
                        一鍵IG shop創業
                    </h2>

                    <div class="mt-8">
                        <div>
                            已開設IG shop，可惜不夠客戶。。。
                        </div>
                        <div class="mt-2">
                            而客戶在Instagram上很難搜尋你的商品、亦很難得知商店的可信性，<b>導致流失大量客戶</b>。
                        </div>
                    </div>


                    <div class="flex items-center mt-16">
                        <button class="btn btn-primary">立即免費認證</button>
                        <span class="mx-4">或</span>
                        <button>了解更多</button>
                    </div>

                </div>

                <!--<div class="mt-4 md:mt-0 col-span-1 font-light">-->
                    <!--<div class="text-xl md:text-2xl">-->
                        <!--<ul>-->
                            <!--<li v-for="feature in features" :key="feature" class="mt-2 flex">-->
                                <!--<span class="text-blue font-bold mr-4 block">✓</span>{{ feature }}-->
                            <!--</li>-->
                        <!--</ul>-->
                    <!--</div>-->
                <!--</div>-->

                <img src="~assets/images/ig_shop.jpg"/>



            </div>
        </section>

        <section>
            <div class="md:grid grid-cols-2 gap-8">
                <div class="col-span-1">
                    <!--<div class="text-4xl md:text-5xl font-bold text-blue">-->
                        <!--認證商店-->
                    <!--</div>-->
                    <!--<h2 class="text-xl md:text-2xl font-bold mt-4">-->
                        <!--一鍵IG shop創業-->
                    <!--</h2>-->
                    <!--<button class="btn btn-primary mt-16">-->
                        <!--立即免費認證-->
                    <!--</button>-->
                </div>

                <div class="mt-4 md:mt-0 col-span-1 font-light">
                    <h2 class="text-4xl md:text-5xl font-bold text-blue">
                        怎樣認證？
                    </h2>
                    <h3 class="text-xl md:text-2xl font-bold mt-4">
                        只需透過Instagram登入便可立即認證
                    </h3>

                </div>
            </div>
        </section>

        <section>
            <div class="md:grid grid-cols-2 gap-8">
                <div class="col-span-1">
                    <div class="text-4xl md:text-5xl font-bold text-blue">
                        認證商店
                    </div>
                    <h2 class="text-xl md:text-2xl font-bold mt-4">
                        一鍵IG shop創業
                    </h2>
                    <button class="btn btn-primary mt-16">
                        立即免費認證
                    </button>
                </div>

                <div class="mt-4 md:mt-0 col-span-1 font-light">
                    <div class="text-xl md:text-2xl">
                        <ul>
                            <li v-for="feature in features" :key="feature" class="mt-2 flex">
                                <span class="text-blue font-bold mr-4 block">✓</span>{{ feature }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!--<button @click="scrollToForm" class="flex md:hidden btn rounded-full justify-center items-center text-xl bg-blue text-white p-2 mt-8"-->
                <!--style="width: 50px; height: 50px;">-->
                <!--<i class="arrow down"></i>-->
                <!--</button>-->
            </div>
        </section>
    </div>
</template>

<script lang="ts">
    export default {
        data(): { features: string[] } {
            return {
                features: [
                    '拓展客源',
                    '可認證IG shop商業登記，提高可信性',
                    '修改商店描述',
                    '完全免費'
                ]
            }
        }
    }
</script>

<style scoped>

    section {
        @apply container mx-auto py-16;
    }

    section:nth-child(even) {
        @apply bg-gray-100;
    }

</style>
