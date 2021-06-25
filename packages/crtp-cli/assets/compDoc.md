## componentName 组件名

<!-- 概览 -->
当前组件的概述。当前组件的概述。当前组件的概述。

<!-- 用例 -->
<!-- 以input为例展示用例 -->
### 基本用法

:::demo 通过`props`控制xxx
```html
<ca-input
    v-model="baseValue"
    :type="'text'"
    class="hi"
    :style="reactiveObj.style"
    @mouseenter="mouseenterHander"
    @mouseleave="mouseoutHander"
/>

<script>
    import {defineComponent, ref, reactive} from 'vue'
    export default defineComponent ({
        setup() {
            let baseValue = ref('3');
            let reactiveObj = reactive({
                blur: false,
                focus: false,
                change: '<init>',
                input: '<init>',
                clear: 0,
                pressEnter: 0,
                passwordVisible: 0,
                style: { color: 'red' },
            });
            let mouseenterHander = () => {
                console.log('mouseenterHander');
            };
            let mouseoutHander = () => {
                console.log('mouseoutHander');
            };
            return {
                baseValue,
                reactiveObj,
                mouseenterHander,
                mouseoutHander,
                // input: ref('')
            }
        }
    })
</script>
```
:::

### 前缀 & 后缀

:::demo 通过`#prepend`/`#append`设置前缀、后缀的内容。
```html
<ca-input v-model="baseValue">
    <template #prepend>
        <span>Http://</span>
    </template>
    <template #append>
        <span>.com</span>
    </template>
</ca-input>

<script>
    import {defineComponent, ref, reactive} from 'vue'
    export default defineComponent ({
        setup() {
            let baseValue = ref('3');
            return {
                baseValue,
            }
        }
    })
</script>
```
:::

### 事件

:::demo 该组件提供了7种事件：`focus` / `blur` / `change` / `input` / `select` / `keyup` / `keydown`
```html
<div class="block">
    <ca-input-number
        v-model="baseValue"
        :size="'large'"
        @focus="focusHandler"
        @blur="blurHandler"
        @change="changeHandler"
        @input="inputHandler"
        @select="selectHandler"
        @keyup="keyupHandler"
        @keydown="keydownHandler"
    />
</div>
<p>focus: {{focusRef}}</p>
<p>blur: {{blurRef}}</p>
<p>当前的值：{{currentValueRef}}，原来的值: {{prevValueRef}}</p>
<p>input: {{inputRef}}</p>
<p>select: {{selectRef}}</p>
<p>keyup: {{keyupRef}}</p>
<p>keydown: {{keydownRef}}</p>

<script>
    import {defineComponent, ref} from 'vue'
    export default defineComponent ({
        setup() {
            let baseValue = ref('3');
            let focusRef = ref(0);
            let blurRef = ref(0);
            let prevValueRef = ref('<init>')
            let currentValueRef = ref('<init>')
            let inputRef = ref('<init>');
            let selectRef = ref(0);
            let keyupRef = ref(0);
            let keydownRef = ref(0);
            let focusHandler = () => {
                focusRef.value++
            }
            let blurHandler = () => {
                blurRef.value++
            }
            let changeHandler = (currentValue, oldValue) => {
                console.log('changeHandler', currentValue, oldValue)
                // changeHandler.value++
                currentValueRef.value = currentValue
                prevValueRef.value = oldValue
            }
            let inputHandler = (value) => {
                console.log('inputHandler', value)
                inputRef.value = value
            }
            let selectHandler = (event) => {
                console.log('selectHandler')
                selectRef.value++
            }
            let keyupHandler = () => {
                console.log('keyupHandler')
                keyupRef.value++
            }
            let keydownHandler = () => {
                console.log('keydownHandler')
                keydownRef.value++
            }
            return {
                baseValue,
                focusRef,
                blurRef,
                prevValueRef,
                currentValueRef,
                inputRef,
                selectRef,
                keyupRef,
                keydownRef,
                focusHandler,
                blurHandler,
                changeHandler,
                inputHandler,
                selectHandler,
                keyupHandler,
                keydownHandler,
            }
        }
    })
</script>
```
:::

### 方法

:::demo 该组件提供了三个方法：'focus' / 'select' / 'blur'
```html
<div class="block">
    <ca-button @click="clickFocusHandler">focus</ca-button>
    <ca-button @click="selectFocusHandler">select</ca-button>
    <ca-button @click="blurFocusHandler">blur</ca-button>
</div>
<div class="block">
    <ca-input-number
        v-model="baseValue"
        ref="inputNumberRef"
    />
</div>
<div class="block">
    <ca-input-number
        v-model="baseValue"
        :size="'small'"
    />
</div>

<script>
    import {defineComponent, ref} from 'vue'
    export default defineComponent ({
        setup() {
            let baseValue = ref('3');
            let inputNumberRef = ref()
            let clickFocusHandler = () => {
                inputNumberRef.value.focus()
            }
            let selectFocusHandler = () => {
                inputNumberRef.value.select()
            }
            let blurFocusHandler = () => {
                inputNumberRef.value.blur()
            }
            return {
                baseValue,
                inputNumberRef,
                clickFocusHandler,
                selectFocusHandler,
                blurFocusHandler,
            }
        }
    })
</script>
```
:::

<!-- 属性 -->
### Attributes

|参数|说明|类型|枚举值|默认值|
|-|-|-|-|-|
|v-model|设置绑定值|string|-|''|
|key|description|type|-|''|

<!-- 方法 -->
### Methods

|方法名|说明|参数|返回值|
|-|-|-|-|
|blue|移除焦点|-|-|


<!-- 事件 -->
### Events

|事件名|说明|回调参数|
|-|-|-|
|input|输入时触发|改变后的值|

<!-- 插槽 -->
### Slots

|名称|说明|
|-|-|
|default|滑块区的内容|






<!--
可能会用到。

:::warning
警告内容。警告内容。警告内容。
:::

:::tip
提示内容。提示内容。提示内容。
:::
 -->
