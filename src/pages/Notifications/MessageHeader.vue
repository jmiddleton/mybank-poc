<template>
  <div class="messageHeader">
    <h3>{{title}}</h3>
    <div class="messageHeaderLine mt-lg mb-lg">
      <div class="messageFrom">
        <div class="messageFromInfo">
          <span>
            <strong>{{name}}</strong>
            <span class="text-muted fw-thin ml-xs">
              &lt;{{email}}&gt;
            </span>
          </span>
          <span class="text-muted">to {{to}}</span>
        </div>
      </div>
      <div class="messageHeaderDate">
        {{date}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MessageHeader',
  props: ['title', 'name', 'email', 'to', 'date'],
};
</script>
