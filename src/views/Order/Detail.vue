<template>
  <div class>1111</div>
</template>

<script>
import { Order } from "@/api/index";
export default {
  name: "OrderDetail",
  data() {
    return {
      orderId: "",
    };
  },
  created() {
    this.orderId = this.$route.params.id;
    this.init();
  },
  methods: {
    async init() {
      await Order.detail({ orderId: this.orderId });
    },
  },
};
</script>

<style>
</style>