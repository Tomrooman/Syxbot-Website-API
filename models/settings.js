import mongoose from 'mongoose';
import dateFormat from 'dateformat';

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    guildId: String,
    notif: {
        current: String,
        added: String,
        removed: String,
        radio: String
    },
    audio: {
        volume: Number
    },
    createdAt: {
        iso: {
            type: Date,
            default: Date.now()
        },
        formatted: {
            type: String,
            default: dateFormat(Date.now(), 'dd/mm/yyyy HH:MM:ss')
        }
    },
    updatedAt: {
        iso: {
            type: Date,
            default: Date.now()
        },
        formatted: {
            type: String,
            default: dateFormat(Date.now(), 'dd/mm/yyyy HH:MM:ss')
        }
    }
}, {
    versionKey: false
});

settingsSchema.pre('save', function (next) {
    this.updatedAt.iso = Date.now();
    this.updatedAt.formatted = dateFormat(Date.now(), 'dd/mm/yyyy HH:MM:ss');
    next();
});

settingsSchema.statics.get = (guildId) => {
    if (!guildId) {
        return false;
    }
    const Settings = mongoose.model('Settings', settingsSchema);
    return Settings.findOne({
        guildId: guildId
    })
        .then(settings => {
            if (settings) {
                return settings;
            }
            return false;
        });
};

export default mongoose.model('Settings', settingsSchema);