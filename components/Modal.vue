<template>
  <div class="modal-mask" @click="$emit('close')">

    <div v-if="$slots.container"
         class="w-full h-full flex items-center justify-center"
         @click.stop="">
      <slot name="container"></slot>
    </div>

    <div v-else class="px-0 sm:container mx-auto flex items-center h-full">

      <div class="modal-container" @click.stop="">

        <div class="modal-header">
          <slot name="header">
            <div class="w-full flex justify-end p-4">
              <button class="flex items-center" @click="$emit('close')">
                <i class="spr-cancel text-2xl"></i>
              </button>
            </div>
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            default body
          </slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <!--          <button class="modal-default-button" @click="$emit('close')">-->
            <!--            OK-->
            <!--          </button>-->
          </slot>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /*display: table;*/
}

.modal-wrapper {
  /*display: table-cell;*/
  /*vertical-align: middle;*/
}

.modal-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

.modal-container {
  /*width: 80%;*/
  height: 100%;
  max-height: 100%;
  overflow: auto;
  /*margin: 0px auto;*/
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  font-family: Helvetica, Arial, sans-serif;
  /*@apply mx-auto;*/
  /*@apply flex-1;*/
}

@screen sm {
  .modal-container {
    max-height: 80%;
    height: auto;
  }
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

/*.modal-body {*/
/*  margin: 20px 0;*/
/*}*/

.modal-default-button {
  display: block;
  margin-top: 1rem;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
