const mongoose = require('mongoose');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 200,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxLength: 200,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
  },
  authorEmail: {
    type: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  sanitizedHtml: {
    type: String,
    required: true,
  },
});

articleSchema.pre('validate', function (next) {
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
