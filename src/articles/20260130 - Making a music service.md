# Making a music service

The music industry is a disaster in a way:
- Music labels making predatory deals with the artists [>1](https://www.okayplayer.com/a-brief-history-of-the-predatory-record-deal/385171) [>2](https://www.whiskeyriff.com/2025/10/08/aaron-watson-calls-record-label-contracts-that-require-an-artist-to-get-50-million-streams-toilet-paper/)
- Distribution platforms provide a shitty experience for artists [>3](https://x.com/leastfavorite_/status/1644942711512858626) [>4](https://x.com/tylerscruggs/status/2013740370731978882) [>5](https://x.com/TrapsNTrees/status/2016507852584620437) [>6](https://x.com/blackxkarma/status/2016224210457100329) [>7](https://x.com/TreCartel/status/2015133467323875824)
- AI artists with millions of listeners [>8](https://voi.id/en/amp/554741) [>9](https://www.theguardian.com/technology/2025/jul/14/an-ai-generated-band-got-1m-plays-on-spotify-now-music-insiders-say-listeners-should-be-warned) [>10](https://mashable.com/article/spotify-smart-shuffle-ai-music)

### Subcategory Spotify

It is actually somewhat surprising how many scandals a company can have within the span of a couple of years, so I've decided to list every Spotify-related problem separately:
- Spotify pushing artists to make profit-oriented music [>11](https://www.theguardian.com/commentisfree/2025/mar/09/spotify-algorithm-artists-music-musicians-money-songs-playlists)
- Spotify founder Daniel Ek funding a defense startup with $700 million [>12](https://www.cnbc.com/2025/06/17/spotifys-daniel-ek-leads-investment-in-defense-startup-helsing.html)
- Spotify launching an AI DJ that nobody has asked for [>13](https://www.bgr.com/tech/spotifys-ai-dj-will-talk-to-you-while-it-plays-your-favorite-songs/) [>14](https://x.com/kitten_beloved/status/1782456830050144678) [>15](https://x.com/zachbdunn/status/1720126876805697901)
- Spotify not paying artists for a track if it doesn't reach 1000 streams [>16](https://www.musicinafrica.net/magazine/spotifys-1000-stream-threshold-criticised-southeast-european-indie-labels)

## Why something new?

Even though the market feels very saturated and there are a lot of different platforms solving very different problems, the main thing missing is a combination of the benefits and transparency.
It should be clear how royalties are distributed and how the business operates.
And although I'm a fan of decentralized technologies and offline-first, music streaming is such a nice user experience that I wouldn't wanna give it up as a listener myself.
And unfortunately, it's just so much easier (especially for non-tech people) to use than setting up a media server yourself.

This is why I started building [Lyda](https://lyda.app) in 2021.
I've come a long way and thought this would be much easier at first.

Here are some of the things I've learned and observed through my experience with the music industry as both a listener and an [artist](https://trirecords.eu/artist/loudar) and why I'm making a certain choice for Lyda.

## Understanding listeners

To successfully understand what features I'd need to build, I took multiple approaches:

1. Look at what features exist on the most popular platforms
2. How people listen to music (e.g., in the background while working, actively to enjoy a specific album, on concerts, etc.)
3. What makes people use their preferred music platform instead of others

Because I'm also a person that listens to a lot of music myself, I also have a lot of opinions.
Nevertheless, it is important to decouple from those a bit to make a service that is truly usable by a broader audience.

Taking a [course from Google about UI/UX](https://www.coursera.org/professional-certificates/google-ux-design) has surprisingly actually taught me this more in-depth, despite my lack of motivation to go through the course.
The material is sometimes very repetitive, but it's worth it learning some fundamental concepts about how to design usable software.

## Understanding artists

The struggles of artists are plenty – some already mentioned above.
If we ignore all the struggles that go into making art in the first place, like learning an instrument, how to write a song or [impostor syndrome](https://en.wikipedia.org/wiki/Impostor_syndrome), there are more challenges waiting after a piece of distributable audio has been created.

### 1. Distribution

To make sure that everyone can listen to your music, you have to distribute it to all platforms. 
Typically, there are two ways you can do this: With a label or independent.
No matter which option you choose, the process is the same, it might just be someone else doing the work for you (e.g., someone at the record label).

To have your music on Spotify, for example, you'd enter all the necessary metadata and upload the final master and artwork to a distribution service.
They then look at your release and review it, usually accepting that after a couple of days (or sometimes a couple of weeks, depends on the distributor and how much they have to review).

This wasn't everything, though: Maybe you want to have your music on Bandcamp?
Either your label or you have to upload everything again there so people can buy it because distributors don't send music to Bandcamp.

In some cases, distributors also don't cover platforms like Soundcloud, so you have to upload it separately there as well.

That's why I'm creating ways on Lyda to efficiently import your existing discography or create new releases.
You can import a JSON with your metadata on the upload page and I'm planning to build an "Import discography" feature, at least for the metadata. 

### 2. Marketing

Once the music is available on platforms, most artists want as many people as possible to listen to it.
Not all artists want that, some are just happy if it's out and the process feels "completed".
To do music marketing, there is a variety of options available:

- Running ads (radio, YouTube, TV, etc.)
<u>--> very costly, thus not really an option for most artists</u>

- Filming short-form video (TikTok, Instagram Reels, YouTube Shorts, etc.)
<u>--> very time intensive because platforms reward regular posting more, can take up more time than actually making the music. Also requires a lot of effort to stand out</u>

- Making posts on social media generally and hope for virality or reposts (Short-text platforms like Bluesky/ATProto, Twitter, etc.)
<u>--> hard to reach outside your fan base if it's not video or audio as a medium, doesn't convert well into streams or music purchases</u>

- Music news outlets covering the release (npr, Rolling Stone, BBC Radio One, etc.)
<u>--> depends on building relationships specifically into these networks or luck that someone stumbles across your stuff, not reliable</u>

- Pitching your release for playlist inclusion (e.g., through Spotify's built-in tool)
<u>--> depends on the good will of someone you can't know, very unreliable unless you're already established</u>

- Real-life marketing (very broad term intentionally)
<u>--> you can tell people directly about it, hang up posters, play small live shows (if your music works for that) and build a community, which takes a long time to really be effective and is also time and energy-intensive</u> 

None of these are options that really let you focus on the music alone.

**Feed me more of the same**

A good way of solving this problem is a recommendation algorithm.
The problem with most recommendation algorithms is that they can only show you music similar to what you've already listened to.
They cannot reliably push you to discover new things of entirely different styles or genres unless they were made to do exactly that.

This is why Lyda has an explore page not based on what you listen to, but rather by randomness.
There are amazing artists everywhere, even if they're small, so they should be surfaced regularly.

### 3. Community

Given the state of the currently available and established platforms, it is hard to build a community digitally.
You can have fans in dozens of different places, and it's basically impossible to bring them together.

SoundCloud, YouTube and Bandcamp all have an advantage over the others here because you're able to directly interact with the artist.
Buying music on bandcamp is so much more likely to be seen by the artist and responded to than buying it on iTunes, for example (let alone just streaming it).
SoundCloud and YouTube let you comment on the music, which deepens the possible relationship artists and fans can build over time.

That's why Lyda has comments, reposts and a fine-grained notification system. I'll add more ways to make building communities easier in the long run.

## Required Features

In my opinion, the music platform ecosystem has similar problems like the movie / series streaming ecosystem:
Too many different services lead to
- higher costs for users if they want access to all content
- a worse experience for artists because it's more work to distribute to all platforms
- different sets of features, so users don't know what to expect from each platform
- switching is challenging because your amassed library does not cleanly transfer to another platform

TODO: dive into user experience, broken platforms etc

## Fair p(l)ay

As established in the problems section at the start of this article, musicians mostly aren't being paid fairly.
It is primarily big record labels and very established artists profiting off the industry.
And even though there are [efforts](https://www.bbc.com/news/articles/cr4wyy3xq5vo) being made, it is not enough to really change the core problem of the industry:

Art is not seen with the same respect in our society that other jobs are.
Of course, it's different from being a doctor saving lives. 
However, if we don't have art to bring us together through shared cultural experiences and ways of building community, we will just die alone and hating everyone that doesn't share every single opinion we have.
So, art should be appreciated, not just as in "art is great and I love to experience a lot of it in my life" but also "I love to pay for it because it teaches me things and makes me question things and teaches me things and it makes me feel things".

And because compensating artists fairly is important, a new music service should build this into its foundation and not treat it as an afterthought.
Bandcamp and other platforms encourage artists to set up a merch store, which I don't think is bad.
It just shouldn't be the thing you go to for money because the actual core experience (the music) isn't compensated properly.

### Fan-centric vs. pro rata

When it comes to streaming payouts, the current standard model is the [pro rata model](https://www.sounds.co/en/post/royalties-streaming-pro-rata-model).
For music streaming specifically, this means that if 10 people pay $10 a month, then the service takes its 30% and these 10 people stream songs 10,000 times, every stream is equally worth 0.7ct.
This might sound fair at first glance, but let's look at an example:

Not every person streams the same amount per month. Imagine Bob and Alice, both paying $10/m, summed up to $14/m after service cut.
If Bob listens 1000 times a month and Alice only 50 times, the artists Bob listens to would get money that Alice is paying, essentially subsidising Bob's streams.
Say Bob listened to only [Skrillex](https://en.wikipedia.org/wiki/Skrillex) and Alice only to [A.G. Cook](https://en.wikipedia.org/wiki/A._G._Cook), Skrillex would get **$13.33** and A.G. Cook would get **$0.66**.

Now if we had a fan-centric payment model, Skrillex would get **$7** and A.G. Cook would get **$7**.
Just because Alice listens less in general, that doesn't mean her money should go to what other people listen to, right?  

[Jack Stratton](https://en.wikipedia.org/wiki/Jack_Stratton_(musician)) from [Vulfpeck](https://en.wikipedia.org/wiki/Vulfpeck) explained this beautifully in [this video](https://www.youtube.com/watch?v=RJBwI3tAmio).
He urges Apple Music to only take a 10% cut and also switch to the fan-centric model.
It would benefit both labels and artists, as labels get more in general (bump from 70% to 90%) and especially artists would be getting money from the people that actually listen to them.

That's why I'm using the fan-centric payout for the music service I'm making. I can't make any guarantees on the service cut for the future, but for the start it'll be 10%.

## Accepting from distributors

If you want to get music from a distribution service like [Symphonic](https://symphonic.com/) for example, you have to implement the [DDEX standard](https://ddex.net/).
The problem here is that the examples are "meh" at best, and communicating with distributors without having an established presence as a music platform is not easy because their interest is in reaching as many listeners as possible.
A small and up-and-coming platform with a couple hundred users will not be of much interest here.
