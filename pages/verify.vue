<template>
    <div>
        <section>
          <div class="container mx-auto">
            <div class="md:grid grid-cols-2 gap-8">
              <div class="col-span-1">
                <h1 class="text-4xl md:text-5xl font-bold ">
                  認證IG shop
                </h1>
                <h2 class="text-xl md:text-2xl font-bold mt-4">
                  輕鬆IG shop創業
                </h2>

                <div class="mt-8">
                  <div>
                    已開設IG shop，可惜不夠客戶。。。
                  </div>
                  <div class="mt-4">
                    客戶在Instagram上很難搜尋你的商品、亦很難得知商店的可信性，<b>導致流失大量客戶</b>。
                  </div>
                  <div class="mt-4">
                    所以此平台採用了電商平台設計、為IG shop自動分類、搭配評分及核實系統。讓你的商店能夠<b>更清晰、可信、準確地展示給你的目標客戶</b>。
                  </div>
                </div>

                <div class="flex items-center mt-8">
                  <button class="btn btn-primary">立即免費認證</button>
                  <span class="mx-4">或</span>
                  <button>了解更多</button>
                </div>

              </div>

              <img src="~assets/images/ig_shop.jpg"/>

            </div>
          </div>
        </section>

        <section>
          <div class="container mx-auto">
            <div class="grid grid-cols-3 gap-8">
              <div v-for="point in points" class="col-span-1 rounded bg-white text-center p-4">
                <div class="text-pink-400 text-2xl font-semibold">{{point.title}}</div>
                <!--                <div class="mt-4">{{point.subtitle}}</div>-->
                <div class="mt-4 text-sm">{{point.content}}</div>
              </div>
            </div>
          </div>
        </section>


        <section>
          <div class="container mx-auto">
            <h2 class="text-4xl md:text-5xl font-bold text-center">
              輕鬆兩步認證
            </h2>

            <div class="mt-4 flex items-center justify-center">
              <div class="text-xl md:text-2xl font-bold">
                1. 註冊Shoperuse帳戶
              </div>
              <i class="spr-angle-right text-4xl"></i>
              <div class="text-xl md:text-2xl font-bold">
                2. 登入後連結IG帳戶
              </div>
              <i class="spr-angle-right text-4xl"></i>
              <div class="text-xl md:text-2xl font-bold">
                完成認證
              </div>
            </div>

            <div class="md:grid grid-cols-2 gap-16 mt-16">
              <div class="col-span-1 bg-gray-100">
                <div class="bg-white rounded-md border p-8">
                  <h2 class="text-xl md:text-2xl font-bold">
                    註冊
                  </h2>
                  <input class="mt-4 block w-full text-input-primary" type="text" name="username" placeholder="用戶名">
                  <input class="mt-4 block w-full text-input-primary" type="password" name="password" placeholder="密碼">
                  <button class="mt-4 btn btn-primary">立即註冊</button>
                </div>
              </div>

              <div class="mt-4 md:mt-0 col-span-1 font-light bg-white">
                <div class="text-4xl md:text-5xl font-bold ">
                  立即認證
                </div>
                <div class="mt-8 text-xl md:text-2xl">
                  <ul>
                    <li v-for="feature in features" :key="feature" class="mt-2 flex">
                      <span class=" font-bold mr-4 block">✓</span>{{ feature }}
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </section>



        <!--<section>-->
            <!--<div class="md:grid grid-cols-2 gap-8">-->
                <!--<div class="col-span-1">-->
                    <!--<div class="text-4xl md:text-5xl font-bold ">-->
                        <!--認證商店-->
                    <!--</div>-->
                    <!--<h2 class="text-xl md:text-2xl font-bold mt-4">-->
                        <!--一鍵IG shop創業-->
                    <!--</h2>-->
                    <!--<button class="btn btn-primary mt-16">-->
                        <!--立即免費認證-->
                    <!--</button>-->
                <!--</div>-->

                <!--<div class="mt-4 md:mt-0 col-span-1 font-light">-->
                    <!--<div class="text-xl md:text-2xl">-->
                        <!--<ul>-->
                            <!--<li v-for="feature in features" :key="feature" class="mt-2 flex">-->
                                <!--<span class=" font-bold mr-4 block">✓</span>{{ feature }}-->
                            <!--</li>-->
                        <!--</ul>-->
                    <!--</div>-->
                <!--</div>-->

                <!--&lt;!&ndash;<button @click="scrollToForm" class="flex md:hidden btn rounded-full justify-center items-center text-xl bg-blue text-white p-2 mt-8"&ndash;&gt;-->
                <!--&lt;!&ndash;style="width: 50px; height: 50px;">&ndash;&gt;-->
                <!--&lt;!&ndash;<i class="arrow down"></i>&ndash;&gt;-->
                <!--&lt;!&ndash;</button>&ndash;&gt;-->
            <!--</div>-->
        <!--</section>-->
    </div>
</template>

<script lang="ts">
    export default {
        data(): { features: string[], points: {title: string, subtitle: string, content: string}[] } {
            return {
                features: [
                    '完全免費',
                    '註冊後只需透過Instagram登入來連結，無需其他設置',
                    '隨意修改商店資料',

                  // '只需透過Instagram登入，無需額外設置',

                    // '拓展客源',
                    // '可認證IG shop商業登記，提高可信性',
                    //
                ],
                points: [
                    // {title: "拓展客源", subtitle: "更好的展示方式", content: "我們採用了比IG更類似電商平台的設計，而且為各商店分類。讓你的商店能夠更清晰、準確地展示給你的目標客戶。"},
                    // {title: "提高可信性", subtitle: "商業登記核實", content: "認證你的商店後，你更可以上載商業登記副本。經核實後可以獲得認證標記，讓客戶可以更放心在你的商店消費。"},
                    // {title: "更改資料", subtitle: "修改分類、描述", content: "假如你認爲你的商店分類或你IG上的描述不適合此平台，認證後你將可以隨意修改。"},

                    {title: "拓展客源", subtitle: "更好的展示方式", content: "我們採用了比IG更類似電商平台的設計，而且為各商店分類。讓你的商店能夠更清晰、準確地展示給你的目標客戶。"},
                    {title: "展示IG資訊", subtitle: "商業登記核實", content: "認證你的商店後，我們將會在Shoperuse上展示你在IG的簡介等資訊，讓用戶可以更清楚了解你商店售賣的產品。。"},
                    {title: "更改資料", subtitle: "修改分類、描述", content: "假如你認爲Shoperuse上你的商店分類或資料有任何錯誤，認證後你將可以隨意修改。"},


                ]
            }
        }
    }
</script>

<style scoped>

    section {
        @apply py-16;
    }

    section:nth-child(even) {
        @apply bg-gray-100;
    }

</style>
