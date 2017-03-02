# punwave-slack-notifier

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]

> Code friendly notifier to send messages to Slack channel via webhook

## Install

```
$ npm install --save punwave-slack-notifier
```

## Usage

```js
const SlackNotifier = require('punwave-slack-notifier')

const notifier = new SlackNotifier(WEBHOOK_URI)

notifier.send({
  text: 'This is a line of text.\nAnd this is another one.'
}, (err, response) => {
  if (err) console.error(err)
  console.log(response)
})
```

## API

### notifier.send(options, callback)

Send message to Slack channel.

#### Options

For setting `attachement` of message, Please see [Slack API documentation](https://api.slack.com/docs/message-attachments) for reference.

#### options.text

If you want to display JavaScript object information or JSON (JavaScript Object Notation) format string for notification, you can pass `{ text: [{ title: TITLE, code: CODE  }] }` into options to display code blocks.

#### options.attachements

It used for customized your notifications.

If your pass `{ attachements: [] }` for options, it will override default settings.

---

### notifier.success(options, callback)

Send message that indicates a successful or positive action to Slack channel.

---

### notifier.warning(options, callback)

Send message that indicates a warning that might need attention to Slack channel.

---

### notifier.danger(options, callback)

Send message that indicates a dangerous or potentially negative action to Slack channel.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/punwave-slack-notifier.svg
[npm-url]: https://npmjs.org/package/punwave-slack-notifier
[travis-image]: https://img.shields.io/travis/punwave/punwave-slack-notifier.svg
[travis-url]: https://travis-ci.org/punwave/punwave-slack-notifier
[codecov-image]: https://img.shields.io/codecov/c/github/punwave/punwave-slack-notifier.svg
[codecov-url]: https://codecov.io/gh/punwave/punwave-slack-notifier
