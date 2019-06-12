<template>
  <div>
    <h2 v-if="payeeId === 'new'" class="page-title">Create Payee</h2>
    <h2 v-else class="page-title">Update Payee</h2>
    <b-row>
      <b-col xs="12" md="6">
        <Widget title customHeader refresh settings>
          <div class="panel-body">
            <form>
              <vue-form-generator :schema="schema" :model="model" :options="formOptions"></vue-form-generator>
              <b-button variant="success" class="mr-xs" v-on:click="submit()">Save</b-button>
              <b-button variant="success" class="mr-xs" v-on:click="backToPayeeList()">Back</b-button>
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
            this.$notify({
              group: "payees",
              type: "warn",
              title: "Payee",
              text: "Payee not found"
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

      this.$notify({
        group: "payees",
        type: "success",
        title: "Payee",
        text: this.model.nickname + " created successfully!!!"
      });
    },
    backToPayeeList() {
      this.$router.push({ path: "/app/payees" });
    }
  }
};
</script>
