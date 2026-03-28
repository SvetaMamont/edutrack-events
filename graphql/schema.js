const { gql } = require('apollo-server-express');

const typeDefs = gql`

type User {
  id: ID!
  name: String!
  email: String!
}

type Event {
  id: ID!
  title: String!
  description: String
  date: String
  creator: User
}

type Participant {
  id: ID!
  user: User
  event: Event
}

input AddEventInput {
  title: String!
  description: String
  date: String
}

type Query {
  getEvents(limit: Int, skip: Int, title: String): [Event]
}

type Mutation {
  addEvent(input: AddEventInput!): Event
}

`;

module.exports = typeDefs;