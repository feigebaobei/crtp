<template>
  <div>Progress</div>
  <demo-block title="基础使用">
    <template #description>
      <div>props: ["v-model", "maxlength=4", "clearable=true"]</div>
    </template>
    <div class="">
      <p>v-model:{{ baseValue }} @change="changeHandler"</p>
      <ca-progress />
    </div>
  </demo-block>
  <demo-block title="大小 & disabled">
    <template #description>
      <div>props: ["v-model", "maxlength=4", "clearable=true"]</div>
    </template>
    <div class="">
      <p>v-model:{{ baseValue }} @change="changeHandler"</p>
      <ca-progress :disabled="disabled" />
    </div>
  </demo-block>
  <demo-block title="原生属性">
    <template #description>
      <div>props: ["v-model", "maxlength=4", "clearable=true"]</div>
    </template>
    <div class="">
      <p>v-model:{{ baseValue }} @change="changeHandler"</p>
      <ca-progress id="progressId" />
      <!-- <p>dom中得到的原生属性 {{ progressOriginRef }}</p> -->
    </div>
  </demo-block>
  <demo-block title="事件 & 方法">
    <template #description>
      <div>props: ["v-model", "maxlength=4", "clearable=true"]</div>
    </template>
    <div class="">
      <p>v-model:{{ baseValue }} @change="changeHandler"</p>
      <ca-progress @blur="blurHandler" />
      <p>
        <button @click="focusTrigger">focus</button>
      </p>
      <ca-progress ref="progressRef" />
    </div>
  </demo-block>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import CaProgress from "../src/index.vue";
export default defineComponent({
  name: "CaProgressDemo",
  components: {
    CaProgress,
  },
  setup() {
    // onMounted(() => {
    //   // console.log('mounted');
    //   setTimeout(() => {/* */}, 0);
    // });
    // ref
    let progressRef = ref<HTMLElement>();
    let progressOriginRef = ref("");
    let disabled = ref(false);
    // event fn
    let blurHandler = (e: Event) => {
      console.log(e);
    };
    let focusTrigger = (e: Event) => {
      console.log(e);
    };
    // methods
    return {
      // ref
      progressRef,
      progressOriginRef,
      disabled,
      // event fn
      blurHandler,
      focusTrigger,
      // methods
    };
  },
});
</script>

<style lang="scss" scoped>

</style>