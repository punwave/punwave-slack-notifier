import { expect } from 'chai'
import sinon from 'sinon'
import Slack from 'slack-node'
import SlackNotifier from '../src/slack_notifier'

/* eslint-disable no-unused-expressions */

describe('SlackNotifier', () => {
  let webhookStub

  beforeEach(() => {
    webhookStub = sinon.stub(Slack.prototype, 'webhook')
  })

  afterEach(() => {
    webhookStub.restore()
  })

  describe('#constructor', () => {
    it('should be instantiated', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      expect(notifier).to.be.an.instanceof(SlackNotifier)
    })

    it('should throw error if missing webhookURL', () => {
      expect(() => new SlackNotifier()).to.throw(Error)
    })

    it('should throw error if webhookURL not a string', () => {
      expect(() => new SlackNotifier(false)).to.throw(TypeError)
    })

    it('should throw error if options not an object', () => {
      expect(() => new SlackNotifier('https://hooks.slack.com/services/TOKEN', false)).to.throw(TypeError)
    })
  })

  describe('#send()', () => {
    it('should send message to slack channel with promise return', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      notifier.send({ text: [{ title: 'test', code: 'ok' }] })
      expect(webhookStub.calledOnce).to.be.true
    })

    it('should send message to slack channel with callback function', () => {
      webhookStub.yields(null, {})
      const callback = sinon.spy()
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      notifier.send({ text: [{ title: 'test', code: 'ok' }] }, callback)
      expect(webhookStub.calledOnce).to.be.true
      expect(callback.calledOnce).to.be.true
    })

    it('should override default settings for customized messages', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      const message = { title: 'title', text: 'test', attachments: [] }
      notifier.send(message)
      expect(webhookStub.calledOnce).to.be.true
      expect(webhookStub.args[0][0]).to.eql(message)
    })

    it('should throw error if callback not a function', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      const message = { title: 'title', text: 'test', attachments: [] }
      expect(() => notifier.send(message, false)).to.throw(TypeError)
    })
  })

  describe('#success()', () => {
    it('should send success type message to slack channel', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      notifier.success({ text: [{ title: 'test', code: 'success' }] })
      expect(webhookStub.calledOnce).to.be.true
      expect(webhookStub.args[0][0].attachments[0]).to.have.property('color', 'good')
    })
  })

  describe('#warn()', () => {
    it('should send warning type message to slack channel', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      notifier.warning({ text: [{ title: 'test', code: 'warning' }] })
      expect(webhookStub.calledOnce).to.be.true
      expect(webhookStub.args[0][0].attachments[0]).to.have.property('color', 'warning')
    })
  })

  describe('#danger()', () => {
    it('should send danger type message to slack channel', () => {
      const notifier = new SlackNotifier('https://hooks.slack.com/services/TOKEN')
      notifier.danger({ text: [{ title: 'test', code: 'danger' }] })
      expect(webhookStub.calledOnce).to.be.true
      expect(webhookStub.args[0][0].attachments[0]).to.have.property('color', 'danger')
    })
  })
})
