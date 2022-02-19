const Message = require("../models/Message.js");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

module.exports = {
  Mutation: {
    createMessage: async (_, { messageInput: { text, username } }) => {
      const newMessage = new Message({
        text,
        createdBy: username,
      });
      const res = await newMessage.save();

      console.log(res);

      pubsub.publish("MESSAGE_CREATED", {
        messageCreated: {
          text,
          createdBy: username,
        },
      });
      return {
        id: res.id,
        ...res._doc,
      };
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator("MESSAGE_CREATED"),
    },
  },
  Query: {
    message: (_, { ID }) => Message.findById(ID),
  },
};
