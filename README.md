# Daily Bible Verse Bot for Telex

## Overview

The Daily Bible Verse Bot is an interval integration for the Telex platform ([telex.im](https://telex.im)) that automatically posts Bible verses to Telex channels at scheduled intervals. This integration allows users to receive daily spiritual inspiration with customizable verse sources and translations.

## Features

- **Scheduled Delivery**: Automatically sends verses at configured times.
- **Customizable Sources**: Select verses from specific books (Psalms, Proverbs, Gospels) or themes (Hope, Comfort, Wisdom).
- **Multiple Translations**: Support for various Bible translations (KJV, NIV, ESV, etc.).
- **Formatted Messages**: Clean, readable message format with emoji and markdown formatting.

## Technical Architecture

The integration is built using:

- **NestJS framework** for the backend service.
- **Bible API** for fetching verse content from `https://bible-api.com/`
- **Telex Webhook API** for delivering messages to channels.

## Configuration Options

Users can configure the following settings:

- **Delivery Schedule**: Set specific times for verse delivery.
- **Verse Source**: Choose from:
  - **Books**: Psalms, Proverbs, Gospels.
  - **Themes**: Hope, Comfort, Wisdom, Random.
- **Translation**: Select preferred Bible translation ['NIV', 'ESV', 'KJV', 'NLT']

## Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Telex account with webhook credentials

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/olugbenga1/telex-bible-verse-bot.git
   cd telex-bible-verse-bot

   ```

2. Install dependencies

```bash
  npm install
```

#### Usage

Once installed and configured, the bot will automatically post verses to the configured Telex channel at the scheduled intervals.

#### Example Message

```
📖 *Daily Bible Verse* 📖

"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."

*John 3:16*
```

### Development

#### Running Tests

```bash
npm run test
```

### How It Works

1. The scheduler triggers at configured intervals.
1. The service selects an appropriate verse based on user's configuration settings.
1. The verse is fetched from the Bible API.
1. The message is formatted with appropriate styling.
1. The formatted message is sent to the configured Telex channel via webhook.
# telex-bible-verse-bot
