const Event = require('../models/Event');
const User = require('../models/User');

const resolvers = {

Query: {

getEvents: async (_, { limit = 10, skip = 0, title }) => {

let filter = {};

if (title) {
filter.title = { $regex: title, $options: "i" };
}

const events = await Event.find(filter)
.populate("creator")
.limit(limit)
.skip(skip);

return events;

}

},

Mutation: {

addEvent: async (_, { input }, { user }) => {

if (!user) {
throw new Error("Unauthorized");
}

const event = new Event({
title: input.title,
description: input.description,
date: input.date,
creator: user.id
});

await event.save();

return event;

}

}

};

module.exports = resolvers;