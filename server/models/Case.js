import mongoose from 'mongoose';

const suspectSubSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    motive: { type: String, required: true },
    alibi: { type: String, required: true },
  },
  { _id: false }
);

const clueSubSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    premise: { type: String, required: true },
    story: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium', required: true },
    suspects: [suspectSubSchema],
    clues: [clueSubSchema],
    hints: [String],
    culpritId: { type: String, required: true },
    solutionExplanation: { type: String, required: true },
    supportingEvidence: { type: mongoose.Schema.Types.Mixed, required: true },
    discoveredClueIds: { type: [String], default: [] },
    hintsUsed: { type: Number, default: 0 },
    accusationId: { type: String, default: null },
    finalScore: { type: Number, default: null },
    status: { type: String, enum: ['active', 'solved', 'failed'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Fallback in-memory store for when MongoDB Atlas URI is not yet configured
class InMemoryCaseStore {
  constructor() {
    this.cases = new Map();
  }

  async create(data) {
    const id = 'case_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const now = new Date();
    const doc = {
      _id: id,
      id,
      ...data,
      discoveredClueIds: data.discoveredClueIds || [],
      hintsUsed: data.hintsUsed || 0,
      accusationId: data.accusationId || null,
      finalScore: data.finalScore !== undefined ? data.finalScore : null,
      status: data.status || 'active',
      createdAt: now,
      updatedAt: now,
      save: async function () {
        this.updatedAt = new Date();
        return this;
      },
      toObject: function () {
        return { ...this };
      },
    };
    this.cases.set(id, doc);
    return doc;
  }

  async findById(id) {
    const item = this.cases.get(id);
    if (!item) return null;
    return item;
  }
}

export const inMemoryStore = new InMemoryCaseStore();

// Mongoose model
const MongooseCase = mongoose.models.Case || mongoose.model('Case', caseSchema);

// Hybrid Data Access Object: uses Mongoose if connected, else uses inMemoryStore (dev only)
export const CaseRepository = {
  isMongooseConnected() {
    return mongoose.connection.readyState === 1;
  },

  async create(data) {
    if (this.isMongooseConnected()) {
      return await MongooseCase.create(data);
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database Error: MongoDB Atlas connection is required for production persistence.');
    }

    console.warn('⚠️ [DEV ONLY] Saving case to in-memory fallback store.');
    return await inMemoryStore.create(data);
  },

  async findById(id) {
    if (this.isMongooseConnected()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const doc = await MongooseCase.findById(id);
        if (doc) return doc;
      }
    }

    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database Error: MongoDB Atlas connection is required for production persistence.');
    }

    return await inMemoryStore.findById(id);
  },
};

export default MongooseCase;
