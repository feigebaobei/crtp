<template>
  <div
    :class="[CaBaseCars, ...$attrs.class]"
    :style="$attrs.style"
  >CaBaseCars</div>
</template>

<script lang="ts">
// 工具方法
import { defineComponent, onMounted, computed, ref } from "vue";
// 组件
// import CaInputNumber from '../../InputNumber/src/index.vue';
// 验证
// type/interface
// 配置项
// 指令
// 数据

export default defineComponent({
  name: "CaBaseCars",
  // components: {
    //     CaInputNumber,
  // },
  // directives
  // inheritAttrs: false,
  props: {
    key: {
      type: String,
      default: "",
    },
  },
  // emits: ['blur'],
  setup(props, ctx) {
    // inject
    // variable
    // ref
    let elementRef = ref();
    // computed
    // methods
    // provide
    // evnet fn
    // watch
    // lifeCircle
    onMounted(() => {
      console.log("mounted");
    });
    return {
      // variable
      // ref
      elementRef,
      // computed
      // methods
      // evnet fn
    };
  },
});
</script>

<style lang="scss" src="./index.scss"></style>
