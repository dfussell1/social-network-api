const { User, Thought } = require('../models');

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
            .populate('thoughts')
            .populate('friends')
            .select('-__v');
        
        if (!user) {
            return res.status(404).json({ message: 'No user with that ID!' });
        }

        res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createUser(req, res) {
        try {
            const newUser = await User.create(req.body);
            res.status(200).json({ newUser, message: 'New user created!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async updateUser(req, res) {
        try {
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message:'No user with that ID!' });
            }

            res.status(200).json({ updatedUser, message: 'User updated!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteUser(req, res) {
        try {
            const deletedUser = await User.findOneAndRemove({ _id: req.params.userId });

            if (!deletedUser) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }

            await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });

            res.status(200).json({ deletedUser, message: 'The user and their thoughts have been deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async addFriend (req, res) {
        try {
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.body } },
                { runValidators: true, new: true }
            );

            if (!friend) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }

            res.status(200).json({ friend, message: 'New friend added!'});
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deletedFriend (req, res) {
        try {
            const friend = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendsId } },
                { runValidators: true, new: true }
            );

            if (!friend) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }

            res.status(200).json({ friend, message: 'Friend deleted!'})
        } catch (err) {
            res.status(500).json(err);
        }
    },
};