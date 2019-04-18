<template>
  <Widget>
    <MessageHeader
      :title="message.theme"
      :name="message.from"
      :email="message.fromEmail"
      :to="message.to"
      :date="message.date"
    />
    <div v-html="message.content"></div>
    hello
  </Widget>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import MessageHeader from "./MessageHeader";

export default {
  name: "Message",
  components: { Widget, MessageHeader },
  props: ["message"]
};
</script>
