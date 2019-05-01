<template>
  <div class="jumbotron">
    <h1 class="display-5">Thank you for choosing MyBank!!!</h1>

    <div>
      <p class="lead">
        <span class="thumb-lg">
          <img :src="require('../../assets/link.png')" alt="...">
        </span>
        To get started click on Add button to add one or more accounts from your bank.
        After you have chosen the accounts and confirmed consent, your accounts as well as balance, 
        direct debits and transactions will be added into MyBank.
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: "NoAccountMessage"
};
</script>