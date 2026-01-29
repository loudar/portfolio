If you're interested in running this yourself, see the [related repository on GitHub](https://github.com/loudar/sentiment-analysis).

# Analyzing my Discord messages

I started using Discord in 2016. Although I've deleted a good amount of the messages I wrote since then, it's roughly 133000 of them and counting.

Recently, I had a spontaneous idea: What if I analyzed the sentiment of all of them and see how it changed over time?

## Acquiring the data

I first had to get my Discord messages somehow. Luckily, Discord offers a way of downloading your own user data, so that is what I used.
After requesting the archive, they sent a zip file a couple of hours later.

It contains the following folder structure:

- package.zip
    - README.txt
    - messages
      - index.json
      - c{channelid}
        - channel.json
        - messages.json

I was especially interested in the messages.json of every of the 954 channels. The format of the `messages.json` file looked like this:

```json
[
  {
    "ID": 123456789012345678,
    "Timestamp": "2017-08-08 19:49:21",
    "Contents": "heyyy",
    "Attachments": ""
  }
]
```

Because of the quite nested folder structure, I extracted only the `Timestamp` and `Contents` fields of every message into one giant `messages.json` in the root folder of the data package.
This way, it'd be easier to work through for processing.

## Inspecting the data

First, let's take a look at some general aspects of the data, like the count of messages per timeframe:

![Count](/img/blog-images/discord-sentiment/count.png "Count of messages per month")

As you can see, there are a lot of messages from the time the pandemic was fully going on and also in 2017, which was roughly my last year of school.

We can also look at the average length per messages and see that it's slowly increasing over time:

![Average length](/img/blog-images/discord-sentiment/averageLength.png "Average length of messages over time")

The average length also seems to be slightly lower during those very active periods. 

## Setting up services

Because my current employer has the benefit of getting 140€ worth of Microsoft Azure credits every month for free, I figured that'd be the easiest way of analyzing the data.
I wanted to do some sentiment analysis, so I set up an Azure Language service instance.

It had a rate limit of 5000 documents/texts I could analyze per minute, meaning it would definitely take a little while to finish.

## Sentiment analysis!

Sentiment analysis with Azure Language services gives you one of the following sentiments, which I mapped to integer values:

```json
{
    "positive": 1,
    "negative": -1,
    "mixed": 0,
    "neutral": 0
}
```

In addition, you get a `confidence` value for the chosen sentiment. By multiplying those two values, I had a rough direction for the sentiment of the message.
The downside here is that my messages mostly consist of phrases and not full sentences, making it hard to actually get the correct sentiment.

For example:

"this is sick!" would get interpreted as `negative`, because it contained the word "sick", even though the message is positive. 

After running all 133k messages through sentiment analysis, I noticed that not all of them had a non-zero score.
Of course, many are probably neutral or mixed, but I was sceptical.

## Language analysis!

Because I suspected that the sentiment analysis would work better if I provided it the correct language for each message, I ran all of those messages through language detection.
This was easy, because the Azure Language service supported this right out of the box.

You can see, english is by far my most used language on Discord, probably because I'm in a lot of online spaces and my real life friends are mostly german and not that active on Discord.

![Languages](/img/blog-images/discord-sentiment/languages.png "Language distribution")

## Final sentiment

After running through the entire sentiment analysis again, we can see the distribution of sentiment across all messages:

![Sentiments](/img/blog-images/discord-sentiment/sentiments.png "Sentiment distribution")

We now can also look at the average sentiment over time:

![Average sentiment](/img/blog-images/discord-sentiment/averageSentiment.png "Average sentiment over time")

As we can see, the average sentiment goes down during the time of the pandemic. I would say it's likely there's some correlation, but I'm too lazy to really dig into it. 

## Some fun graphs

Because I wanted to know which words I use really often, I split every message by spaces (and commas) and counted every one of them.

I threw out all counts for a lot of common words, like "I", "you", etc., so that only the interesting things like slang words or domain-specific words remain.

![Common words](/img/blog-images/discord-sentiment/mostCommonWords.png "Most common words")

If we take the top five of those, we can also see how often those were used over time:

![Common words over time](/img/blog-images/discord-sentiment/commonWordsTime.png "Top 5 most common words over time")

There would be a possibility here to make this graph relative to the amount of messages sent in that timeframe, but I'm also too lazy for that ;)

## Cost

Expensive, if I would've paid anything. Yes, I blew through the budget of my subscription, because Azure only updates the spending once a day :D

![Cost](/img/blog-images/discord-sentiment/cost.png "Cost of everything (289.85€)")

Hope you enjoyed this small experiment! Feel free to check out the [repo](https://github.com/loudar/sentiment-analysis) and try it for yourself. Just keep the cost in mind :p 