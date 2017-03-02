import Slack from 'slack-node'
import extend from 'lodash/extend'
import isEmpty from 'lodash/isEmpty'

class Notifier {
  constructor (webhookUri) {
    if (typeof webhookUri === 'undefined') {
      throw new Error('Missing webhookUri')
    }

    if (typeof webhookUri !== 'string') {
      throw new Error('Expected webhookUri to be a string')
    }

    this.slack = new Slack()
    this.slack.setWebhook(webhookUri)
  }

  /**
   * Send message via Slack Webhook.
   *
   * @param {object} options
   * @param {function} callback
   * @return {function}
   */
  send (options = {}, callback) {
    let { fallback, color, author_name, title, text } = options

    const attachment = extend({}, {
      fallback,
      color,
      author_name,
      title,
      text: text.map(data => this._createCodeBlock(data.title, data.code)).join(''),
      mrkdwn_in: ['text'],
      footer: 'punwave-slack-notifier',
      ts: parseInt(Date.now() / 1000)
    })

    return this.slack.webhook({ attachments: [attachment] }, callback)
  }

  /**
   * Send success message via Slack Webhook.
   *
   * @param {object} options
   * @param {function} callback
   * @return {function}
   */
  success (options = {}, callback = () => {}) {
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
  warning (options = {}, callback = () => {}) {
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
  danger (options = {}, callback = () => {}) {
    options.color = 'danger'
    return this.send(options, callback)
  }

  _createCodeBlock (title, code) {
    if (isEmpty(code)) return ''
    code = (typeof code === 'string') ? code.trim() : JSON.stringify(code, null, 2)
    const tripleBackticks = '```'
    return `_${title}_${tripleBackticks}${code}${tripleBackticks}\n`
  }
}

export default Notifier
