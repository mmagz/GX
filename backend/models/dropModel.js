import mongoose from "mongoose";

const dropSchema = new mongoose.Schema({
    dropCode: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    season: { type: String, required: true },
    date: { type: String, required: true },
    bannerUrl: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['ACTIVE', 'SOLD_OUT', 'ARCHIVED'], 
        default: 'ACTIVE' 
    },
    isCurrent: { type: Boolean, default: false },
    productCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    archivedAt: { type: Date }
}, {
    timestamps: true
});

// Ensure only one drop can be current at a time
dropSchema.pre('save', async function(next) {
    if (this.isCurrent && this.isModified('isCurrent')) {
        await this.constructor.updateMany(
            { _id: { $ne: this._id } },
            { $set: { isCurrent: false } }
        );
    }
    next();
});

const dropModel = mongoose.models.drop || mongoose.model("drop", dropSchema);

export default dropModel;
