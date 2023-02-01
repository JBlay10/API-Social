const { User, Thought } = require('../models');

module.exports = {
    
    getThoughts(req, res) {
        Thought.findAll()
        .then((thoughts) => res.json(thoughts))
        .catch((err) => {
            console.log(err)
            res.status(500).json(err)
        })
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .then((thought) => 
            !thought
            ? res.status(404).json({ message: 'Thought not found' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id }},
                { new: true }
            )
        })
        .then((user) => 
        !user
        ? res.status(404).json({ message: 'Thought was created but no user found' })
        : res.json({ message: 'Thought successfully created!' })
        )
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
            ? res.status(404).json({ message: 'Thought not found' })
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err))
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) => {
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' })
            }

            return User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: {thoughts: req.params.thoughtId } },
                { new: true }
            )
        })
        .then((user) => 
            !user
            ? res.status(404).json({ message: 'User not found'})
            : res.json({ message: 'Thought was deleted' })
        )
        .catch((err) => res.status(500).json(err))
    }
};