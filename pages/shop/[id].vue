<script setup lang="ts">
    import IgPage from "../../models/IgPage";
    import IgMedia from "../../models/IgMedia";

    const {data} = await useFetch(`/api/shop`, {params: {id: useRoute().params.id}});
    const {page, medias} = data.value as { page: IgPage, medias: IgMedia[] }

    const {
        username,
        lastActivity,
        biography,
        followerCount,
        mediaCount,
        profilePicUrl
    } = page

    const lastActiveDate = new Date(lastActivity);
    const lastActive = `${lastActiveDate.getDate()}/${lastActiveDate.getMonth() + 1}/${lastActiveDate.getFullYear()}`;
    const description = biography;
</script>

<template>
    <div>
        <div class="container mx-auto">

            <div class="flex flex-row">

                <div class="rounded-full mr-8" style="aspect-ratio: 1; height: 120px;" :style="`background-image: url(${profilePicUrl});`"></div>

                <div>

                    <div>
                        <div class="font-semibold text-lg truncate">{{ username }}</div>
                        <div class="text-gray-400 font-light text-xs">最後活躍 {{ lastActive }}</div>
                    </div>


                    <div class="text-sm text-gray-500 flex flex-row">
                        <div class="text-center" style="flex: 1;">
                            <div>粉絲</div>
                            <div>{{ followerCount.toLocaleString() }}</div>
                        </div>
                        <div class="bg-gray-300 mx-2" style="width: 1px;"></div>
                        <div class="text-center" style="flex: 1;">
                            <div>貼文</div>
                            <div>{{ mediaCount.toLocaleString() }}</div>
                        </div>
                    </div>

                    <div class="mt-2 2xl:mt-4 text-sm text-gray-500">
                        <div>門市</div>
                        <div>旺角、銅鑼灣</div>
                    </div>
                    我知道


                </div>


            </div>

        </div>

    </div>
</template>
