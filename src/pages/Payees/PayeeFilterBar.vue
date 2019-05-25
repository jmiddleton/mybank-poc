<template>
  <div class="filter-bar ui basic segment grid">
    <div class="mb-xs">
      <b-input-group>
        <input
          class="mb-xs"
          size="16"
          type="text"
          v-model="filterText"
          @keyup.enter="doFilter"
          placeholder="name or description"
        >
        <b-input-group-append>
          <b-button class="mb-xs" variant="danger" @click="doFilter">
            <i class="fa fa-search"/>
          </b-button>
        </b-input-group-append>&nbsp;
        <b-button-group class="mr-2">
          &nbsp;
          <b-button
            variant="default"
            class="mb-xs"
            @click="doFilterByType('DOMESTIC', 0)"
            :class="{ active: checkByType[0] }"
          >Domestic</b-button>
          <b-button
            variant="default"
            class="mb-xs"
            @click="doFilterByType('BILLER', 1)"
            :class="{ active: checkByType[1] }"
          >Bpay</b-button>
          <b-button
            variant="default"
            class="mb-xs"
            @click="doFilterByType('INTERNATIONAL', 2)"
            :class="{ active: checkByType[2] }"
          >International</b-button>
        </b-button-group>&nbsp;
        <b-button variant="success" class="mb-xs float-right" @click="createPayee()">Create</b-button>
      </b-input-group>
    </div>
  </div>
</template>

  <script>
import Vue from "vue";
export default {
  name: "payee-filter-bar",
  data() {
    return {
      filterText: "",
      checkByType: [false, false, false, true]
    };
  },
  methods: {
    createPayee() {
      this.$router.push({ path: "/app/payees/new" });
    },
    doFilter() {
      this.$events.fire("filter-set", this.filterText);
    },
    doFilterByType(type, index) {
      for (var i = 0; i < this.checkByType.length; i++) {
        if (i != index) {
          this.checkByType[i] = false;
        }
      }
      Vue.set(this.checkByType, index, !this.checkByType[index]);
      this.$events.fire("filter-by-type", this.checkByType[index] ? type : undefined);
    }
  }
};
</script>