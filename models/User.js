const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true, 
            // trimmed and set to lowercase for email validation
            trim: true, 
            lowercase: true,
            // grabbed from stack overflow, validates email 
            validate: {
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email"
            },
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    },
);

// this creates a virtual called "friendCount" that gets the length of the user's friends
userSchema
    .virtual('friendCount')
    .get(function () {
        return `Friends: ${this.friends.length}`;
});

const User = model('user', userSchema);

module.exports = User; 