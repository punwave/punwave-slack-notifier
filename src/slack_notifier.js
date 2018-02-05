import Slack from 'slack-node'
import isEmpty from 'lodash/isEmpty'

class Notifier {
  constructor (webhookURL, options) {
    if (typeof webhookURL === 'undefined') {
      throw new Error('Missing webhookURL.')
    }

    if (typeof webhookURL !== 'string') {
      throw new TypeError('Expected webhookURL to be a string.')
    }

    if (typeof options !== 'undefined' && typeof options !== 'object') {
      throw new TypeError('Expected options to be an object.')
    }

    this.slack = new Slack()
    this.slack.setWebhook(webhookURL)
    this.options = { attachment: { footer: 'punwave-slack-notifier' }, ...options }
  }

  /**
   * Send message via Slack Webhook.
   *
   * @param {object} options
   * @param {function} callback
   * @return {function}
   */
  send (options = {}, callback) {
    if (typeof callback !== 'undefined' && typeof callback !== 'function') {
      throw new TypeError('Expected callback to be a function.')
    }

    const attachment = {
      ...this.options.attachment,
      ...options,
      text: (Array.isArray(options.text)) ? options.text.map(data => this._createCodeBlock(data.title, data.code)).join('') : options.text,
      mrkdwn_in: (Array.isArray(options.text)) ? ['text'] : options.mrkdwn_in,
      ts: parseInt(Date.now() / 1000)
    }
    const settings = { ...this.options, attachments: [attachment] }
    const config = (options.attachments) ? options : settings

    return new Promise((resolve, reject) => {
      this.slack.webhook(config, (err, res) => {
        if (err) return callback ? callback(err) : reject(err)
        return callback ? callback(null, res) : resolve(res)
      })
    })
  }

  /**
   * Send success message via Slack Webhook.
   *
   * @param {object} options
   * @param {function} callback
   * @return {function}
   */
  success (options = {}, callback) {
    options.color = 'good'
    return this.send(options, callback)
  }

  /**
   * Send warning message via Slack Webhook.
   *
   * @param {object} options
   * @param {function} callback
   * @return {function}
   */
  warning (options = {}, callback) {
    options.color = 'warning'
    return this.send(options, callback)
  }

  /**
   * Send danger message via Slack Webhook.
   *
   * @param {object} options
   * @param {function} callback
   * @return {function}
   */
  danger (options = {}, callback) {
    options.color = 'danger'
    return this.send(options, callback)
  }

  _createCodeBlock (title = '', code = '') {
    if (isEmpty(code)) return ''
    code = (typeof code === 'string') ? code.trim() : JSON.stringify(code, null, 2)
    const tripleBackticks = '```'
    return `_${title}_${tripleBackticks}${code}${tripleBackticks}\n`
  }
}

export default Notifier
