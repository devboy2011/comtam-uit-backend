'use strict'
const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Session'
const COLLECTION_NAME = 'sessions'

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sessionToken: {
        type: String,
        required: true,
        unique: true,
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d', // Automatically delete after 30 days
    },
    expiresAt: {
        type: Date,
        required: true,
        default: function() {
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        }
    }
});

// Index for automatic expiration of sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model(DOCUMENT_NAME, sessionSchema);