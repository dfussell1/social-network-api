const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String, 
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => new Date(createdAtVal).toLocaleString(),
        },
        username: {
            type: String, 
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            getters: true, 
            virtuals: true,
        },
        id: false,
    },
);

// creates a virtual called "reactionCount" that gets the length of the thought's reactions
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return `Reactions: ${this.reactions.length}`;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;