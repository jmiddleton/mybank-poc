<template>
  <div>
    <b-breadcrumb>
      <b-breadcrumb-item to="/app/dashboard">
        <span class="fi flaticon-home"></span>
      </b-breadcrumb-item>
      <b-breadcrumb-item to="/app/payees">Manage Payess</b-breadcrumb-item>
      <b-breadcrumb-item active v-if="payeeId === 'new'">Create Payes</b-breadcrumb-item>
      <b-breadcrumb-item active v-else>Update Payes</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 v-if="payeeId === 'new'" class="page-title">Create Payee</h1>
    <h1 v-else class="page-title">Update Payee</h1>
    <b-row>
      <b-col xs="12" md="6">
        <Widget title customHeader refresh settings>
          <div class="panel-body">
            <form>
              <vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
              <b-button variant="success" class="mr-xs" size="sm" v-on:click="submit()">Save</b-button>
            </form>
          </div>
        </Widget>
      </b-col>
      <b-col xs="12" md="6"></b-col>
    </b-row>
  </div>
</template>
<script>
import Widget from "@/components/Widget/Widget";
import axios from "axios";
import "imports-loader?$=jquery,this=>window!messenger/build/js/messenger"; // eslint-disable-line

const { Messenger } = window;

export default {
  components: {
    Widget
  },
  data() {
    return {
      payeeId: "",
      model: {},
      schema: {
        groups: [
          {
            legend: "Payee Details",
            fields: [
              {
                type: "input",
                inputType: "text",
                label: "Name",
                model: "nickname",
                id: "nickname",
                placeholder: "Your name",
                featured: true,
                required: true
              },
              {
                type: "input",
                inputType: "text",
                label: "Description",
                model: "description",
                id: "description",
                placeholder: "Description",
                featured: true,
                required: false
              },
              {
                type: "select",
                label: "Payee Type",
                model: "type",
                values: ["DOMESTIC", "INTERNATIONAL", "BILLER"],
                onChanged: function(model, newVal) {
                  if (newVal) {
                    model.payeeUType = newVal.toLowerCase();
                    if (model.payeeUType === "domestic") {
                      model.domestic = {};
                      model.domestic.payeeAccountUType = "account";
                      delete model.biller;
                    } else if (model.payeeUType === "biller") {
                      model.biller = {};
                      delete model.domestic;
                    }
                  }
                }
              },
              {
                type: "select",
                label: "Payee Type",
                model: "payeeUType"
              }
            ]
          },
          {
            legend: "",
            fields: [
              {
                type: "input",
                inputType: "text",
                label: "Account Name",
                model: "domestic.account.accountName",
                id: "accountName",
                placeholder: "Account name",
                featured: true,
                required: true,
                validator: "string",
                visible: function(model) {
                  return model && model.type == "DOMESTIC";
                }
              },
              {
                type: "input",
                inputType: "text",
                label: "BSB",
                model: "domestic.account.bsb",
                id: "bsb",
                placeholder: "Bsb",
                featured: true,
                required: true,
                validator: "string",
                visible: function(model) {
                  return model && model.type == "DOMESTIC";
                }
              },
              {
                type: "input",
                inputType: "text",
                label: "Account Number",
                model: "domestic.account.accountNumber",
                id: "accountNumber",
                placeholder: "Account number",
                featured: true,
                required: true,
                validator: "string",
                visible: function(model) {
                  return model && model.type == "DOMESTIC";
                }
              }
            ]
          },
          {
            legend: "",
            fields: [
              {
                type: "input",
                inputType: "text",
                label: "Biller Code",
                model: "biller.billerCode",
                id: "billerCode",
                placeholder: "Biller code",
                featured: true,
                required: true,
                validator: "string",
                visible: function(model) {
                  return model && model.type == "BILLER";
                }
              },
              {
                type: "input",
                inputType: "text",
                label: "CRN",
                model: "biller.crn",
                id: "crn",
                placeholder: "CRN",
                featured: true,
                required: true,
                validator: "string",
                visible: function(model) {
                  return model && model.type == "BILLER";
                }
              },
              {
                type: "input",
                inputType: "text",
                label: "Biller Name",
                model: "biller.billerName",
                id: "billerName",
                placeholder: "Biller name",
                featured: true,
                required: true,
                validator: "string",
                visible: function(model) {
                  return model && model.type == "BILLER";
                }
              }
            ]
          }
        ]
      },

      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateAsync: true
      },
      locationClasses: "messenger-fixed messenger-on-bottom messenger-on-right"
    };
  },
  created() {
    this.payeeId = this.$route.params.payeeId;
    if (this.payeeId != "new") {
      axios
        .get("/payees/" + this.payeeId)
        .then(r => r.data)
        .then(payee => {
          if (typeof payee === "object") {
            this.model = payee;
          } else {
            this.model = {};
            this.payeeId = "new";
            Messenger().post({
              extraClasses: this.locationClasses,
              message: "Payee not found",
              theme: "air"
            });
          }
        })
        .catch(function() {
          this.model = {};
          this.payeeId = "new";
        });
    }
  },
  methods: {
    submit() {
      if (this.payeeId != "new") {
        this.$store.dispatch("payees/updatePayee", this.model);
      } else {
        this.payeeId = Math.random()
          .toString(36)
          .substr(2, 15);
        this.model.payeeId = this.payeeId;
        this.$store.dispatch("payees/createPayee", this.model);
      }

      Messenger().post({
        extraClasses: this.locationClasses,
        message: this.model.nickname + " created successfully!!!",
        type: "success"
      });
    }
  }
};
</script>
