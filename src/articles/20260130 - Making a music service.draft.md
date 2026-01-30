# Making a music service

The music industry is a disaster in a way:
- Music labels making predatory deals with the artists [>1](https://www.okayplayer.com/a-brief-history-of-the-predatory-record-deal/385171) [>2](https://www.whiskeyriff.com/2025/10/08/aaron-watson-calls-record-label-contracts-that-require-an-artist-to-get-50-million-streams-toilet-paper/)
- Distribution platforms provide a shitty experience for artists [>3](https://x.com/leastfavorite_/status/1644942711512858626) [>4](https://x.com/tylerscruggs/status/2013740370731978882) [>5](https://x.com/TrapsNTrees/status/2016507852584620437) [>6](https://x.com/blackxkarma/status/2016224210457100329) [>7](https://x.com/TreCartel/status/2015133467323875824)
- AI artists with millions of listeners [>8](https://voi.id/en/amp/554741) [>9](https://www.theguardian.com/technology/2025/jul/14/an-ai-generated-band-got-1m-plays-on-spotify-now-music-insiders-say-listeners-should-be-warned) [>10](https://mashable.com/article/spotify-smart-shuffle-ai-music)

### Subcategory Spotify

It is actually somewhat surprising how many scandals a company can have within the span of a couple years, so I've decided to list every Spotify-related problem separately:
- Spotify pushing artists to make profit-oriented music [>11](https://www.theguardian.com/commentisfree/2025/mar/09/spotify-algorithm-artists-music-musicians-money-songs-playlists)
- Spotify founder Daniel Ek funding a defense startup with $700 million [>12](https://www.cnbc.com/2025/06/17/spotifys-daniel-ek-leads-investment-in-defense-startup-helsing.html)
- Spotify launching an AI DJ that nobody has asked for [>13](https://www.bgr.com/tech/spotifys-ai-dj-will-talk-to-you-while-it-plays-your-favorite-songs/) [>14](https://x.com/kitten_beloved/status/1782456830050144678) [>15](https://x.com/zachbdunn/status/1720126876805697901)
- Spotify not paying artists for a track if it doesn't reach 1000 streams [>16](https://www.musicinafrica.net/magazine/spotifys-1000-stream-threshold-criticised-southeast-european-indie-labels)

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

### 3. Community

Given the state of the currently available and established platforms, it is hard to build a community digitally.
You can have fans in dozens of different places, and it's basically impossible to bring them together.

SoundCloud, YouTube and Bandcamp all have an advantage over the others here because you're able to directly interact with the artist.
Buying music on bandcamp is so much more likely to be seen by the artist and responded to than buying it on iTunes, for example (let alone just streaming it).
SoundCloud and YouTube let you comment on the music, which deepens the possible relationship artists and fans can build over time.

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

TODO: dive into pro rata / actual fair pay comparison

## Accepting from distributors

If you want to get music from a distribution service like [Symphonic](https://symphonic.com/) for example, you have do implement the [DDEX standard](https://ddex.net/).
The problem here is that the examples are "meh" at best and communicating with distributors without having an established presence as a music platform is not easy because their interest is in reaching as many listeners as possible.
A small and up-and-coming platform with a couple hundred users will not be of much interest here.
