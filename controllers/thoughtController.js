const { User, Thought } = require('../models');

module.exports = {
    // gets all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.status(200).json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // gets a single thought by its 'thoughtId'
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID!' });
            }

            res.status(200).json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // creates a thought
    async createThought(req, res) {
        try {
            const newThought = await Thought.create(req.body);

            res.status(200).json({ newThought, message: 'Thought created!' });
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // updates a thought by its 'thoughtId'
    async updateThought(req, res) {
        try {
            const updatedThought = await Thought.findByIdAndUpdate(
                // updates values from req.body
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!updatedThought) {
                return res.status(404).json({ message: 'No thought with that ID!' });
            }

            res.status(200).json({ updatedThought, message: 'Thought updated! '});
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // deletes a thought
    async deleteThought(req, res) {
        try {
            const deletedThought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought with that ID!' });
            }

            res.status(200).json({ deletedThought, message: 'Thought deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // creates a reaction to a thought
    async createReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                // pushes reaction to 'reactions' array
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                {runValidators: true, new: true }
            );

            if (!reaction) {
                return res.status(404).json({ message: 'No thought with that ID!' });
            }

            res.status(200).json({ reaction, message: 'Reaction added!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // deletes a reaction from a thought
    async deleteReaction(req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                // pulls reaction from thought's 'reactions' array
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if(!reaction) {
                return res.status(404).json({ message: 'No reaction with that ID!' });
            }

            res.status(200).json({ reaction, message: 'Reaction deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
};  