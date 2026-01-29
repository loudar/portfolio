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

## Understanding listeners

To successfully understand what features I'd need to build, I took multiple approaches:

1. Look at what features exist on the most popular platforms
2. How people listen to music (e.g. in the background while working, actively to enjoy a specific album, on concerts, etc.)
3. What makes people use their preferred music platform instead of others

Because I'm also a person that listens to a lot of music myself, I also have a lot of opinions.
Nevertheless, it is important to decouple from those a bit to make a service that is truly usable by a broader audience.

Taking a [course from Google about UI/UX](https://www.coursera.org/professional-certificates/google-ux-design) has surprisingly actually taught me this more in-depth, despite my lack of motivation to go through the course.
The material is sometimes very repetitive, but it's worth it to learn some fundamental concepts about how to design usable software.

## Understanding artists

The struggles of artists are plenty – some already mentioned above.
If we ignore all the struggles that go into making art in the first place, like learning an instrument, how to write a song or [impostor syndrome](https://en.wikipedia.org/wiki/Impostor_syndrome), there are more challenges waiting after a piece of distributable audio has been created.

### 1. Distribution

To make sure that everyone can listen to your music, you have to distribute it to all platforms. 
Typically, there are two ways you can do this: With a label or independent.
No matter which option you choose, the process is the same, it might just be someone else doing the work for you (e.g. someone at the record label).

To have your music on Spotify for example, you'd enter all the necessary metadata and upload the final master and artwork to a distribution service.
They then look at your release and review it, usually accepting that after a couple of days (or sometimes a couple of weeks, depends on the distributor and how much they have to review).

This wasn't everything, though: Maybe you want to have your music on Bandcamp?
Either your label or you have to upload everything again there so people can buy it because distributors don't send music to Bandcamp.

In some cases, distributors also don't cover platforms like Soundcloud, so you have to upload it separately there as well.

### 2. Marketing

TODO

### 3. Community

TODO

## Required Features

In my opinion, the music platform ecosystem has similar problems like the movie / series streaming ecosystem:
Too many different services lead to
- higher costs for users if they want access to all content
- a worse experience for artists because it's more work to distribute to all platforms
- different sets of features, so users don't know what to expect from each platform
- switching is challenging because your amassed library does not cleanly transfer to another platform

And even though there are [efforts](https://www.bbc.com/news/articles/cr4wyy3xq5vo) being made, it is not enough to really change the core problem of the industry:
Art is not seen with the same respect in our society that other jobs are.
Of course, it's different from being a doctor saving lives. 
However, if we don't have art to bring us together through shared cultural experiences and ways of building community, we will just die alone and hating everyone that doesn't share every single opinion we have.

## Accepting from distributors

If you want to get music from a distribution service like [Symphonic](https://symphonic.com/) for example, you have do implement the [DDEX standard](https://ddex.net/).
The problem here is that the examples are "meh" at best and communicating with distributors without having an established presence as a music platform is not easy because their interest is in reaching as many listeners as possible.
A small and up-and-coming platform with a couple hundred users will not be of much interest here.
