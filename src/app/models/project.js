const mongoose = require('../../database/index');

const bcrypt = require('bcryptjs');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    tashs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tash',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;