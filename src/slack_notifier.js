import Slack from 'slack-node'
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
    const attachment = {
      fallback: options.fallback,
      color: options.color,
      pretext: options.pretext,
      author_name: options.author_name,
      author_link: options.author_link,
      author_icon: options.author_icon,
      title: options.title,
      title_link: options.title_link,
      text: (Array.isArray(options.text)) ? options.text.map(data => this._createCodeBlock(data.title, data.code)).join('') : options.text,
      mrkdwn_in: (Array.isArray(options.text)) ? ['text'] : options.mrkdwn_in,
      image_url: options.image_url,
      thumb_url: options.thumb_url,
      footer: 'punwave-slack-notifier',
      footer_icon: options.footer_icon,
      ts: parseInt(Date.now() / 1000)
    }

    const settings = { attachments: [attachment] }
    const config = (options.attachments) ? options : settings

    return this.slack.webhook(config, callback)
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

  _createCodeBlock (title = '', code = '') {
    if (isEmpty(code)) return ''
    code = (typeof code === 'string') ? code.trim() : JSON.stringify(code, null, 2)
    const tripleBackticks = '```'
    return `_${title}_${tripleBackticks}${code}${tripleBackticks}\n`
  }
}

export default Notifier
