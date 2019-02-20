<template>
  <div class="tables-basic">
    <b-breadcrumb>
      <b-breadcrumb-item>Home</b-breadcrumb-item>
      <b-breadcrumb-item active>Manage Payess</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title">Manage Payees</h1>
    <b-row>
      <b-col>
        <Widget
          title=""
          customHeader settings close
        >
          <div class="table-resposive">
            <table class="table">
              <thead>
                <tr>
                  <th class="hidden-sm-down">#</th>
                  <th>Name</th>
                  <th class="hidden-sm-down">BSB</th>
                  <th class="hidden-sm-down">Account</th>
                  <th class="hidden-sm-down">Payee Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in tableStyles" :key="row.id">
                  <td>{{row.id}}</td>
                  <td>
                    {{row.description}}
                    <div v-if="row.label">
                      <b-badge :variant="row.label.colorClass">{{row.label.text}}</b-badge>
                    </div>
                  </td>
                  <td>
                    <p class="mb-0">
                      <small>
                        <span class="fw-semi-bold">Type:</span>
                        <span class="text-muted">&nbsp; {{row.info.type}}</span>
                      </small>
                    </p>
                    <p>
                      <small>
                        <span class="fw-semi-bold">Dimensions:</span>
                        <span class="text-muted">&nbsp; {{row.info.dimensions}}</span>
                      </small>
                    </p>
                  </td>
                  <td class="text-semi-muted">
                    {{parseDate(row.date)}}
                  </td>
                  <td class="text-semi-muted">
                    {{row.size}}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="clearfix">
            <div class="float-right">
              <b-button variant="default" class="mr-xs" size="sm">Send to...</b-button>
              <b-dropdown variant="inverse" class="mr-xs" size="sm" text="Clear" right>
                <b-dropdown-item>Clear</b-dropdown-item>
                <b-dropdown-item>Move ...</b-dropdown-item>
                <b-dropdown-item>Something else here</b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item>Separated link</b-dropdown-item>
              </b-dropdown>
            </div>
          </div>
        </Widget>
      </b-col>
   </b-row>
  </div>
</template>

<script>
import $ from 'jquery';
import Vue from 'vue';
import Widget from '@/components/Widget/Widget';
import 'imports-loader?jQuery=jquery,this=>window!jquery-sparkline'; // eslint-disable-line

export default {
  name: 'Payees',
  components: { Widget },
  data() {
    return {
      tableStyles: [
        {
          id: 1,
          picture: require('../../assets/tables/1.jpg'), // eslint-disable-line global-require
          description: 'Palo Alto',
          info: {
            type: 'JPEG',
            dimensions: '200x150',
          },
          date: new Date('September 14, 2012'),
          size: '45.6 KB',
          progress: {
            percent: 29,
            colorClass: 'success',
          },
        },
        {
          id: 2,
          picture: require('../../assets/tables/2.jpg'), // eslint-disable-line global-require
          description: 'The Sky',
          info: {
            type: 'PSD',
            dimensions: '2400x1455',
          },
          date: new Date('November 14, 2012'),
          size: '15.3 MB',
          progress: {
            percent: 33,
            colorClass: 'warning',
          },
        },
        {
          id: 3,
          picture: require('../../assets/tables/3.jpg'), // eslint-disable-line global-require
          description: 'Down the road',
          label: {
            colorClass: 'danger',
            text: 'INFO!',
          },
          info: {
            type: 'JPEG',
            dimensions: '200x150',
          },
          date: new Date('September 14, 2012'),
          size: '49.0 KB',
          progress: {
            percent: 38,
            colorClass: 'inverse',
          },
        },
        {
          id: 4,
          picture: require('../../assets/tables/4.jpg'), // eslint-disable-line global-require
          description: 'The Edge',
          info: {
            type: 'PNG',
            dimensions: '210x160',
          },
          date: new Date('September 15, 2012'),
          size: '69.1 KB',
          progress: {
            percent: 17,
            colorClass: 'danger',
          },
        },
        {
          id: 5,
          picture: require('../../assets/tables/5.jpg'), // eslint-disable-line global-require
          description: 'Fortress',
          info: {
            type: 'JPEG',
            dimensions: '1452x1320',
          },
          date: new Date('October 1, 2012'),
          size: '2.3 MB',
          progress: {
            percent: 41,
            colorClass: 'primary',
          },
        },
      ],
      checkboxes1: [false, false, false, false],
      checkboxes2: [false, false, false, false, false, false],
      checkboxes3: [false, false, false, false, false, false],
    };
  },
  methods: {
    parseDate(date) {
      const dateSet = date.toDateString().split(' ');
      return `${date.toLocaleString('en-us', { month: 'long' })} ${dateSet[2]}, ${dateSet[3]}`;
    },
    checkAll(ev, checkbox) {
      const checkboxArr = (new Array(this[checkbox].length)).fill(ev.target.checked);
      Vue.set(this, checkbox, checkboxArr);
    },
    changeCheck(ev, checkbox, id) {
      this[checkbox][id] = ev.target.checked;
      if (!ev.target.checked) {
        this[checkbox][0] = false;
      }
    },
    getRandomData() {
      const result = [];

      for (let i = 0; i <= 8; i += 1) {
        result.push(Math.floor(Math.random() * 20) + 1);
      }

      return result;
    },
    initCharts() {
      const colors = ['#547fff', '#9964e3', '#f55d5d', '#ffc247', '#3abf94'];

      $.each($('.sparkline-chart'), (id, chart) => {
        $(chart).sparkline(this.getRandomData(), {
          type: 'bar',
          barColor: colors[Math.floor(Math.random() * colors.length)],
        });
      });
    },
  },
  mounted() {
    this.initCharts();
  },
};
</script>

<style src="./Payees.scss" lang="scss" scoped />
