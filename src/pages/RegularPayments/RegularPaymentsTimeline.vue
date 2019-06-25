<template>
  <Widget :title="'<h5>Upcoming Payments</h5>'" customHeader>
    <light-timeline :items="scheduledItems"/>
  </Widget>
</template>

<script>
import Vue from "vue";
import Widget from "@/components/Widget/Widget";
import LightTimeline from "vue-light-timeline";
import moment from "moment";
import { mapState } from "vuex";

Vue.use(LightTimeline);

export default {
  name: "RegularPaymentsTimeline",
  props: {
    options: { default: () => ({}) }
  },
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

        let header = "";
        let to = "";
        let from = "";
        let scheduleEnd = "";
        const tos = s.paymentSet.to;
        const utype = tos.toUType;

        if (utype === "domestic") {
          if (tos.domestic.payeeAccountUType === "account") {
            const account = tos.domestic.account;
            header =
              "<h6 class='mb-0 value6'>" +
              account.accountName +
              " &nbsp;&nbsp;";
            header += "<span class='btn btn-xs mr-1 btn-success float-right'>";
            header += "$ " + s.paymentSet.amount;
            header += "</span></h6>";

            from = "<h6 class='value6'>From Account</h6>";

            to += "<h6 class='value6'>To " + account.accountName + "</h6>";
            to += "<p>" + account.bsb + " - " + account.accountNumber + "</p>";
          }
        } else if (utype === "biller") {
          const biller = tos.biller;
          header =
            "<h6 class='mb-0 value6'>" + biller.billerName + " &nbsp;&nbsp;";
          header += "<span class='btn btn-xs mr-1 btn-success float-right'>";
          header += "$ " + s.paymentSet.amount;
          header += "</span></h6>";

          from = "<h6 class='value6'>From Account</h6>";

          to += "<h6 class='value6'>To " + biller.billerName + "</h6>";
          to += "<p>" + biller.billerCode + " - " + biller.crn + "</p>";
        }

        let nextPaymentMoment;
        let fromNow = "";
        if (s.recurrence.recurrenceUType === "intervalSchedule") {
          nextPaymentMoment = moment(s.recurrence.nextPaymentDate);
          fromNow =
            "<small><span class='glyphicon glyphicon-time'></span> Scheduled " +
            nextPaymentMoment.fromNow() +
            "</small>";

          scheduleEnd += "<p><h6 class='value6'>Schedule End</h6>";
          scheduleEnd +=
            moment(s.recurrence.intervalSchedule.finalPaymentDate).format(
              "DD MMM YYYY"
            ) + "</p>";
        }

        const timeline = {
          tag: nextPaymentMoment ? nextPaymentMoment.format("DD MMM") : "",
          htmlMode: true,
          content:
            `<h5 class="title">` +
            header +
            `<small>` +
            s.payeeReference +
            `</small><br/>` +
            fromNow +
            `<small><a data-toggle="collapse" class="float-right" role="button" href="#" 
            onClick="showDetails('` +
            index +
            `');" 
            aria-expanded="false" aria-controls="` +
            index +
            `">
            Details</a></small>
            </h5>
            <div id="` +
            index +
            `" class="collapse widgetBody widget-body">` +
            `<div class="container">
              <div class="row">
                <div class="col">` +
            from +
            scheduleEnd +
            `</div>
                <div class="col">` +
            to +
            `</div>
              </div>
             </div>
            </div>`
        };
        this.scheduledItems.push(timeline);
      }
    },
    init() {
      this.$store.dispatch("accounts/loadScheduledPayments");
    }
  },
  computed: {
    ...mapState("accounts", ["scheduledPayments"])
  },
  mounted() {
    this.init();
  },
  watch: {
    scheduledPayments(newValue) {
      this.processScheduledPayments(newValue);
    }
  }
};

window.showDetails = function(id) {
  const div = document.getElementById(id);
  div.classList.toggle("show");
};
</script>

<style src="./RegularPayments.scss" lang="scss" scoped />
