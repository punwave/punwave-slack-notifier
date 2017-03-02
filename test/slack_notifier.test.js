import { expect } from 'chai'
import sinon from 'sinon'
import Slack from 'slack-node'
import SlackNotifier from '../src/slack_notifier'

/* eslint-disable no-unused-expressions */

describe('SlackNotifier', () => {
  const spy = sinon.spy(Slack.prototype, 'webhook')

  beforeEach(() => {
    spy.reset()
  })

  describe('#constructor', () => {
    it('should be instantiated', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      expect(notifier).to.be.an.instanceof(SlackNotifier)
    })

    it('should throw error if missing webhookUri', () => {
      expect(() => new SlackNotifier()).to.throw(Error)
    })

    it('should throw error if webhookUri not a string', () => {
      expect(() => new SlackNotifier(false)).to.throw(Error)
    })
  })

  describe('#send()', () => {
    it('should send message to slack channel', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      notifier.send({ text: [{ title: 'test', code: 'ok' }] })
      expect(spy.calledOnce).to.be.true
    })

    it('should override default settings for customized messages', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      const message = { title: 'title', text: 'test', attachments: [] }
      notifier.send(message)
      expect(spy.calledOnce).to.be.true
      expect(spy.args[0][0]).to.eql(message)
    })
  })

  describe('#success()', () => {
    it('should send success type message to slack channel', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      notifier.success({ text: [{ title: 'test', code: 'success' }] })
      expect(spy.calledOnce).to.be.true
      expect(spy.args[0][0].attachments[0]).to.have.property('color', 'good')
    })
  })

  describe('#warn()', () => {
    it('should send warning type message to slack channel', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      notifier.warning({ text: [{ title: 'test', code: 'warning' }] })
      expect(spy.calledOnce).to.be.true
      expect(spy.args[0][0].attachments[0]).to.have.property('color', 'warning')
    })
  })

  describe('#danger()', () => {
    it('should send danger type message to slack channel', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      notifier.danger({ text: [{ title: 'test', code: 'danger' }] })
      expect(spy.calledOnce).to.be.true
      expect(spy.args[0][0].attachments[0]).to.have.property('color', 'danger')
    })
  })
})
