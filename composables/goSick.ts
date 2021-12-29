import type {Ref} from 'vue';
export const inc = (counter: Ref<number>) => () => counter.value++;
export const dec = (counter: Ref<number>) => () => counter.value--;

const counter = ref(0);
export default function () {
    return {
        counter: readonly(counter),
        inc: inc(counter),
        dec: dec(counter),
    };
}