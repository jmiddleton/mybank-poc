<template>
  <div class="filter-bar ui basic segment grid">
    <div class="ui form">
      <div class="inline field">
        <label>Search for:</label>
        <input
          type="text"
          v-model="filterText"
          @keyup.enter="doFilter"
          placeholder="name or description"
        >
        <b-button variant="success" class="mr-xs" size="sm" @click="doFilter">Go</b-button>

        <div class="float-right">
          <b-button variant="danger" class="mr-xs" size="sm" @click="createPayee()">Create</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

  <script>
export default {
  name: "payee-filter-bar",
  data() {
    return {
      filterText: ""
    };
  },
  methods: {
    createPayee() {
        this.$router.push({ path: "/app/payees/new" });
    },
    doFilter () {
      this.$events.fire('filter-set', this.filterText)
    }
  }
};
</script>