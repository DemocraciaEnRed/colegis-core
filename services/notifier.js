const axios = require('axios')
const { NOTIFIER_URL } = require('../config')
const log = require('./logger')

const http = axios.create()

exports.sendCommentNotification = async (notificationType, commentId) => {
  let payload = {
    type: notificationType,
    comment: commentId
  }
  http.post(`${NOTIFIER_URL}/send-email`, payload).then((response) => {
    log.info(response.data.message, payload)
  }).catch((error) => {
    log.error('ERROR Sending Email', {
      meta: payload,
      message: error.message,
      data: error.response.data
    })
  })
}

exports.sendNewCommentNotification = async (notificationType, commentId) => {
  let payload = {
    type: notificationType,
    comment: commentId
  }
  http.post(`${NOTIFIER_URL}/comment-new`, payload).then((response) => {
    log.info(response.data.message, payload)
  }).catch((error) => {
    log.error('ERROR Sending Email', {
      meta: payload,
      message: error.message,
      data: error.response.data
    })
  })
}

exports.setDocumentClosesNotification = async (documentId, closingDate) => {
  let payload = {
    id: documentId,
    closingDate
  }
  await http.post(`${NOTIFIER_URL}/set-document-closes`, payload).then((response) => {
    log.info(response.data.message, payload)
  }).catch((error) => {
    log.error('ERROR Setting document closes event', {
      error: error.message,
      meta: payload,
      data: error.response && error.response.data
    })
  })
}

exports.sendDocumentPublishedNotification = async (documentId) => {
  let payload = {
    documentId
  }
  await http.post(`${NOTIFIER_URL}/document-published`, payload).then((response) => {
    log.info(response && response.data && response.data.message, payload)
  }).catch((error) => {
    log.error('ERROR Sending Email', {
      meta: payload,
      message: error.message,
      data: error.response && error.response.data
    })
  })
}
