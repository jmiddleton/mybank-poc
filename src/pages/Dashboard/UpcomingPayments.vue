<template>
  <Widget :title="'<h5>Upcoming Payments</h5>'" customHeader collapse close>
  <p
      class="fs-mini text-muted"
    >Your upcoming payments shows all the payments which are waiting to be processed, either today or on a future date.</p>

    <div class="categoriesList">
      <div
        :key="item.scheduledPaymentId"
        v-for="item in scheduledItems"
        class="list-group-item list-group list-group-md"
      >
        <span class="notificationIcon thumb-xs">
          <img :src="require('../../assets/stopwatch.png')" alt="...">
        </span>

        <p class="m-0 overflow-hidden">
          {{item.name}}
          <br>
          <span class="mr-1 float-right value6">$ {{item.amount}}</span>
          Ref: {{item.description}}
          <time class="help-block m-0">
            <span class="glyphicon glyphicon-time"></span>
            Scheduled {{item.time}}
          </time>
        </p>
      </div>
    </div>
  </Widget>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import moment from "moment";
import { mapState } from "vuex";

const mformat = "YYYY-MM";

export default {
  name: "UpcomingPayments",
  components: {
    Widget
  },
  data() {
    return {
      scheduledItems: []
    };
  },
  methods: {
    processScheduledPayments(scheduled) {
      for (var index = 0; index < scheduled.scheduledPayments.length; ++index) {
        let s = scheduled.scheduledPayments[index];

        let name = "";
        let amount = "";
        const tos = s.paymentSet.to;
        const utype = tos.toUType;

        if (utype === "domestic") {
          if (tos.domestic.payeeAccountUType === "account") {
            const account = tos.domestic.account;
            name = account.accountName;
            amount = s.paymentSet.amount;
          }
        } else if (utype === "biller") {
          const biller = tos.biller;
          name = biller.billerName;
          amount = s.paymentSet.amount;
        }

        let fromNow = "";
        if (s.recurrence.recurrenceUType === "intervalSchedule") {
          let nextPaymentMoment = moment(s.recurrence.nextPaymentDate);
          fromNow = nextPaymentMoment.fromNow();
        }

        this.scheduledItems.push({
          name: name,
          amount: amount,
          description: s.payeeReference,
          time: fromNow
        });
      }
    },
    init() {
      this.$store.dispatch("accounts/loadScheduledPayments");
    }
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState("accounts", ["scheduledPayments"])
  },
  watch: {
    scheduledPayments(newValue) {
      this.processScheduledPayments(newValue);
    }
  }
};
</script>

<style src="./Dashboard.scss" lang="scss" scoped/>
