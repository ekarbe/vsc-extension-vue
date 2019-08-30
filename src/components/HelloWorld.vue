<template>
  <div>
    <div>Hello World</div>
    <button @click="show = true; count++">Click me</button>
    <div v-show="show">{{count}}</div>
  </div>
</template>

<script>
// Small example to show that it works
export default {
  name: "HelloWorld",
  data() {
    return {
      show: false,
      count: 0
    };
  }
};
</script>
