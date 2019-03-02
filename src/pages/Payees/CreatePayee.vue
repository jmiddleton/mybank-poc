<template>
<div>
    <b-breadcrumb>
      <b-breadcrumb-item>Home</b-breadcrumb-item>
      <b-breadcrumb-item>Manage Payess</b-breadcrumb-item>
      <b-breadcrumb-item active v-if="payeeId === 'new'">Create Payes</b-breadcrumb-item>
      <b-breadcrumb-item active v-else>Update Payes</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 v-if="payeeId === 'new'" class="page-title">Create Payee</h1>
    <h1 v-else class="page-title">Update Payee</h1>
    <b-row>
      <b-col xs="12" md="6">
        <Widget
          title="" customHeader refresh settings>
            <div class="panel-body">
                <form>
                <vue-form-generator :schema="schema" :model="model" :options="formOptions">
                </vue-form-generator>
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
import Widget from '@/components/Widget/Widget';
import axios from 'axios';

const { Messenger } = window;

export default {
  components: { 
    Widget
  },
  data () {
    return {
      payeeId:'',
      model: {
        payeeType: 'CER'
      },
      schema: {
        groups: [
          {
            legend: 'Payee Details',
            fields: [
              {
                type: 'input',
                inputType: 'text',
                label: 'Name',
                model: 'name',
                id: 'user_name',
                placeholder: 'Your name',
                featured: true,
                required: true
              },
              {
                type: 'input',
                inputType: 'text',
                label: 'Description',
                model: 'description',
                id: 'description',
                placeholder: 'Description',
                featured: true,
                required: false
              },
              {
                type: 'input',
                inputType: 'text',
                label: 'BSB',
                model: 'BSB',
                id: 'BSB',
                placeholder: 'Bsb',
                featured: true,
                required: true,
                validator: 'string'
              },
              {
                type: 'input',
                inputType: 'text',
                label: 'Account Number',
                model: 'accountNumber',
                id: 'accountNumber',
                placeholder: 'Account number',
                featured: true,
                required: true,
                validator: 'string'
              },
              {
                type: 'select',
                label: 'Payee Type',
                model: 'payeeType',
                values: ['PRT', 'CER', 'OTH']
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
      locationClasses: 'messenger-fixed messenger-on-bottom messenger-on-right'
    }
  },
  created(){
    this.payeeId = this.$route.params.payeeId;
    if(this.payeeId != 'new'){
      axios.get('https://5a2u1vztie.execute-api.ap-southeast-2.amazonaws.com/dev/payees/'+ this.payeeId)
        .then(r => r.data)
        .then(payee => {
          if(typeof payee === 'object'){
            this.model = payee;
          }else{
            this.model = {};
            this.payeeId= 'new';
            Messenger().post({
              extraClasses: this.locationClasses,
              message: 'Payee not found',
              theme: 'air'
            });
          }
        }).catch(function (error) {
          this.model = {};
          this.payeeId= 'new';
        });
    }
  },
  methods: {
      submit(){
        if(this.payeeId != 'new'){
          this.$store.dispatch('payees/updatePayee', this.model);
        }else{
          this.payeeId= Math.random().toString(36).substr(2, 15);
          this.model.payeeId= this.payeeId;
          this.$store.dispatch('payees/createPayee', this.model);
        }
        
        Messenger().post({
          extraClasses: this.locationClasses,
          message: this.model.name + ' created successfully!!!',
          type: 'success'
        });
      }
  }
}
</script>
