<template>
  <light-timeline :items="directDebitItems"/>
</template>

<script>
import Vue from "vue";
import LightTimeline from "vue-light-timeline";
import moment from "moment";
import { mapState } from "vuex";

Vue.use(LightTimeline);

export default {
  name: "DirectDebitsTimeline",
  props: {
    options: { default: () => ({}) }
  },
  data() {
    return {
      directDebitItems: []
    };
  },
  methods: {
    processDirectDebits(dd) {
      for (var index = 0; index < dd.directDebits.length; ++index) {
        let s = dd.directDebits[index];

        let header =
          "<h6 class='mb-0 value6'>" +
          s.authorisedEntity.description +
          " &nbsp;&nbsp;";
        header += "<span class='btn btn-xs mr-1 btn-success float-right'>";
        header += "$ " + s.lastDebitAmount;
        header += "</span></h6>";

        let lastDebitMoment = moment(s.lastDebitDateTime);

        const timeline = {
          tag: "Payment " + lastDebitMoment.format("DD MMM"),
          htmlMode: true,
          content:
            `<h5 class="title">` +
            header +
            `<small>Institution: ` +
            s.authorisedEntity.financialInstitution +
            `</small><br/>ABN ` +
            s.authorisedEntity.abn +
            `</div>
              </div>
             </div>
            </div>`
        };
        this.directDebitItems.push(timeline);
      }
    },
    init() {
      this.$store.dispatch("accounts/loadDirectDebits");
    }
  },
  computed: {
    ...mapState("accounts", ["directDebits"])
  },
  mounted() {
    this.init();
  },
  watch: {
    directDebits(newValue) {
      this.processDirectDebits(newValue);
    }
  }
};
</script>

<style src="./RegularPayments.scss" lang="scss" scoped />
