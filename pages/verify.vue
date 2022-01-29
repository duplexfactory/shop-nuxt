<template>
    <div>
        <section class="container mx-auto py-24">
            <div class="md:grid grid-cols-2 gap-8">
                <div class="col-span-1">
                    <div class="text-4xl md:text-5xl font-bold text-blue">
                        認證商店
                    </div>
                    <div class="text-xl md:text-2xl font-bold mt-4">
                        123
                    </div>
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
                    '完全免費'
                ]
            }
        }
    }
</script>

<style scoped>

</style>
