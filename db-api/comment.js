const { Types: { ObjectId } } = require('mongoose')
// const { merge } = require('lodash/object')
const Comment = require('../models/comment')
// const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')
const dbUser = require('./user')

// Create comment
exports.create = async function create (comment) {
  return (new Comment(comment)).save()
}

exports.get = function get (query, expose) {
  return Comment
    .findOne(query).populate('user', dbUser.exposeAll(expose))
}

exports.count = function count (query) {
  return Comment.countDocuments(query)
}
exports.countContributors = async function countContributors (query) {
  let contributors = []
  return Comment.find(query)
    .then(async (comments) => {
      // Found?
      if (!comments) throw errors.ErrNotFound('Error retrieving comments')
      // Do stuff
      await Promise.all(comments.map(async (comment) => {
        if (!contributors.includes(comment.user.toString())) contributors.push(comment.user.toString())
      }))
      return contributors.length
    })
}

exports.getAll = function getAll (query, expose) {
  return Comment
    .find(query).populate('user', dbUser.exposeAll(expose))
}

exports.resolve = function resolve (query) {
  return Comment.findOne(query)
    .then((_comment) => {
      // Found?
      if (!_comment) throw errors.ErrNotFound('Comment to update not found')
      // Do stuff
      _comment.resolved = true
      // Save!
      return _comment.save()
    })
}
exports.reply = function reply (query, reply) {
  return Comment.findOne(query)
    .then((_comment) => {
      // Found?
      if (!_comment) throw errors.ErrNotFound('Comment to update not found')
      // Do stuff
      _comment.reply = reply
      // Save!
      return _comment.save()
    })
}

exports.updateDecorations = async function updateDecorations (version, decorations) {
  let query = {
    version: version,
    resolved: false,
    field: 'articles'
  }
  let decorationsMap = {}
  decorations.forEach((deco) => {
    decorationsMap[deco.mark.data.id] = deco
  })
  let decorationsIds = Object.keys(decorationsMap)
  return Comment.find(query)
    .then(async (comments) => {
      // Found?
      if (!comments) throw errors.ErrNotFound('Error retrieving comments')
      // Do stuff
      console.log(query)
      await Promise.all(comments.map(async (comment) => {
        console.log(decorationsIds.includes(comment._id.toString()))
        if (decorationsIds.includes(comment._id.toString())) {
          comment.decoration.anchor = decorationsMap[comment._id].anchor
          comment.decoration.focus = decorationsMap[comment._id].focus
          comment.markModified('decoration')
        } else {
          comment.resolved = true
        }
        return comment.save()
      }))
      // Save!
    })

    // Remove customForm
}

exports.remove = async function remove (id) {
  return Comment.findOne({ _id: id })
    .then((Comment) => {
      if (!Comment) throw ErrNotFound('Comment to remove not found')
      return Comment.remove()
    })
}
