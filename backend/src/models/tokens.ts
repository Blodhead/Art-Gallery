import mongoose from 'mongoose'

const Schema = mongoose.Schema;

let TokenSchema = new Schema({
    username: { type: String, required: true },
    token: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

export default mongoose.model("Token", TokenSchema, "tokens");
