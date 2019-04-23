<template>
  <div v-if="this.$auth.profile">
    <b-breadcrumb>
      <b-breadcrumb-item to="/app/dashboard">
        <span class="fi flaticon-home"></span>
      </b-breadcrumb-item>
      <b-breadcrumb-item active>Profile</b-breadcrumb-item>
    </b-breadcrumb>
    <h1 class="page-title">
      <span class="fw-semi-bold">Profile</span>
    </h1>

    <Widget>
      <div class="widget-top-overflow text-white">
        <div class="height-150 overflow-hidden">
          <img class="img-fluid" src="../../assets/profile.png" alt="...">
        </div>
        <a href="#" class="btn btn-outline btn-sm mb-2">
          <i class="fa fa-twitter mr-2"/>
          Follow
        </a>
      </div>
      <b-row>
        <b-col md="5" xs="12" class="text-center">
          <div class="profileContactContainer">
            <span class="thumb-xl mb-3">
              <img class="profileAvatar rounded-circle" :src="this.$auth.profile.picture" alt="...">
            </span>
            <h5 class="fw-normal">
              <span class="fw-semi-bold">{{this.$auth.profile.nickname}}</span>
            </h5>
            <p>{{this.$auth.profile.email}}</p>

            <div>
              <ul class="profileContacts mt-sm">
                <li>
                  <i class="fa fa-lg fa-phone fa-fw mr-2"/>
                  <a href="#">+375 29 555-55-55</a>
                </li>
                <li>
                  <i class="fa fa-lg fa-envelope fa-fw mr-2"/>
                  <a href="#">{{this.$auth.profile.email}}</a>
                </li>
                <li>
                  <i class="fa fa-lg fa-map-marker fa-fw mr-2"/>
                  <a href="#">Minsk, Belarus</a>
                </li>
              </ul>
            </div>
          </div>
        </b-col>
        <b-col md="7" xs="12">
          <UserBankAuthPage/>
        </b-col>
      </b-row>
    </Widget>
  </div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import UserBankAuthPage from "./UserBankAuth";

export default {
  name: "Profile",
  components: { Widget, UserBankAuthPage }
};
</script>

<style src="./Profile.scss" lang="scss" scoped />
