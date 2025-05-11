# Harnessing AI to Gather Data on the Web: Is It Worth It?

## Imagine this scenario:

You are building a webapplication where you want to provide information to visitors of your website.
You don't have information about this subject so you have to rely on other sources on the internet. You want the information to be as consistent and accurate as possible. You looked around but were not able to find an external API that provides the data that you need. Still, there are more than enough sources available online that are there for the taking, right? You just need something to get it for you and mold it into a format that you can consume.

You can just use/build a website scraper like everyone else does. This is a popular method to get data from the web and has a proven track record. But they require knowledge about where to get the data and can be costly to maintain.

So what about AI? The way AI works, we won't have to tell it where to get the data, it can 'just' get it for you, right? And we won't have to worry about the structure of the data, we can just ask it to provide it into our preferred format.

Let's find out! In this post I will take you along a journey with me and try different approaches on how we could achieve this. With every approach, we will evaluate how it worked for us. For this pet project, let's say we want to build an webapplication where users can search for a ski lift in a ski resort and get details about this ski lift like the brand, capacity, etc.

### So how would that work?

We can define two major steps:

- Use AI to find the data for us on the web
- Use AI to transform the data into a suitable format that our application can consume

### Requirements & Criteria

- Data quality: The data should be consistent & accurate
- Cost: The solution should be cost efficient; you are prepared to pay for good, reliable data, but also you don't want to pay more than you need
- Robustness: The solution should be robust - you don't want to have to fix it whenever a data source changed or was removed.
- Practicality: How practical is this solution?

### Limitations, disclaimers

- There are many AI models out there (and more will come), each with their strenghts and weaknesses. For the sake of brevity we will use the chatGPT AI model in this post. Results may vary with other models, and you are free to try them out yourself :)
- Gathering information from other websites to use in your webapplication can have commercial and/or ethical challenges. If you plan to do this commercially, make sure that it is not illegal for you to use the information that you gathered.
- The pieces of code provided here are kept minimal for brevity.

It will be like a little adventure! We will try to solve the use case we started with. We will evaluate every step and see what we can do better. The mayor outtake here is to explore options, there is no 'right' or 'wrong' in this article.

## 1. Using AI to find the data for us on the web

### Asking ChatGPT Chat

Let's start simple. We want data. We'll just ask chatGPT Chat to get the data for us! Just to see how that would work.

The [ChatGPT Chat](https://chatgpt.com/) is a chatbox where you can talk directly with chatGPT. It provides an answer to any query that you give it. It's really accessible and easy to use, don't necessarily need an account. Just start typing. It sounds a bit like magic; It can get everything we need, we won't have to care where to look, right? We just need to make sure that chatGPT gives us what we actually want.

So, how would that look using the chatGPT chat? We would come up with a prompt something like this:

#### Prompting

```
You are a helpful assistant.
You will give use accurate, concise information about a ski lift in a ski resort, which we will provide at the end of this prompt.
You will find these ski lift details: name, lift type, manufacturer, operator, capacity(people/hour), duration(mins), occupancy(persons), construction(year), lift_elevation distance(meters), lift_distance(meters), ski_resort, source_urls
Provide only the data in a json object using the exact matching keys without markdown formatting, where source_urls should be an array of urls.
ski lift: Colomba in Val Cenis
```

Let's break it down

- We tell ChatGPT a bit about how it should act. This is necessary so chatGPT knows how to best answer our query. We tell it to act as a helpful assistent and what we expect it to return. This is called 'system prompting'.
- we will give it specific details to look for. This is necessary so we know exacly the data that chatGPT will provide so we can consume it in our application.
- we tell ChatGPT to provide the data in JSON format. We are not interested in anything else. This saves resources and makes it easy for us to consume the data.

So if we run the call, presto:

#### Result

```
{
  "name": "Colomba",
  "lift_type": "6-person high-speed detachable chairlift",
  "manufacturer": "Doppelmayr",
  "operator": "Val Cenis Ski Resort",
  "capacity": 2400,
  "duration": 3.83,
  "occupancy": 6,
  "construction": 2010,
  "lift_elevation": 159,
  "lift_distance": 1051,
  "ski_resort": "Val Cenis – Lanslevillard/Lanslebourg/Termignon",
  "source_urls": [
    "https://www.skidetails.com/ski-resort/val-cenis-lanslevillardlanslebourgtermignon/ski-lifts/l91126/"
  ]
}
```

And we have our data! Wow, that was surprisingly easy! Let's evaluate this step..

#### Evaluation

- Data: The data is reasonably consistent because we can prompt for the properties we want. But it is hard to tell if it's accurate without checking the data. We can chatGPT Chat to provide source urls to make this easier.
- Cost: There's a free tier, but expect to make costs to improve accuracy of the data and when your website grows.
- Robustness: This setup will probably always return all the properties you need in a form that you can consume in your web application.
- Practicality: It is not practical. There is no feasible way for your application to connect to the ChatGPT Chat. You won't be able to use this data in your website..

That was a promising start, right? It proved that ChatGPT Chat can gather the data for us and provide it in the form that we want. But there is a major catch:

`There is only a user interface for the ChatGPT Chat, there is no interface for our web application.`

Luckily, OpenAI provides a [ChatGPT API interface](https://openai.com/api/) for that. We'll explore this in the next step.

### Asking ChatGPT API

The ChatGPT API is an interface where you can interact with the ChatGPT interface programmatically. It accesses the same AI models and works similar enough, but there are important differences. More on that later.

To access it, you will _need_ an account and a API key. Also, in contrast to the Chat, it has no free tier but a pay-as-you-go model, charging you on the amount of tokens used.

It's relatively straightforward to communicate with the API service.
If you would want to do the same call as we did with the ChatGPT chat, it would look like this:

```
  const CHATGPT_API_KEY = `abc123`;
  const CHATGPT_API_URL = `https://api.openai.com/v1/chat/completions`;
  const prompt = `can you give me details about this ski lift: ${liftName} in resort: ${resort}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CHATGPT_API_KEY}`,
  };

  const body = JSON.stringify({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant.
        You will give use accurate, concise information about a ski lift in a ski resort, which we will provide at the end of this prompt.
        You will find these ski lift details: name, lift type, manufacturer, operator, capacity(people/hour), duration(mins), occupancy(persons), construction(year), lift_elevation distance(meters), lift_distance(meters), ski_resort, source_urls
        Provide only the data in a json object using the exact matching keys without markdown formatting, where source_urls should be an array of urls.`,
      },
      { role: "user", content: prompt },
    ],
  });

  const result = await fetch(CHATGPT_API_URL, {
    method: "POST",
    headers,
    body,
  });
```

Now let's break this one down:

- sending the API key in the header will authenticate us to ChatGPT and will make sure that ChatGPT knows who they can charge for this request.
- In the API, we can send messages to chatGPT with a role specified, this will tell chatGPT how to best process the input. This way we can prime the model with 'system input', we can do this by adding a property `role: system` to the message. This is called input formatting.
- The ChatGPT API offers additional options like model selection, temperature, maximum token usage and much more (we will not explore these in this post, but I encourage you to try them out sometime).

When prompted, The ChatGPT API would return something like this:

```
{
  id: 'chatcmpl-abc123',
  object: 'chat.completion',
  created: 1736778567,
  model: 'gpt-4o-mini-2024-07-18',
  choices: [
    {
      index: 0,
      message: {
        "data": {
            "name": "Colomba",
            "lift_type": "Chair lift",
            "manufacturer": "Poma",
            "operator": "Société des Remontées Mécaniques de Val Cenis",
            "capacity": 2000,
            "duration": 5,
            "occupancy": 4,
            "construction": 1998,
            "elevation": 350,
            "distance": 950,
            "ski_resort": "Val Cenis",
            "source_urls": [
              "https://www.skidetails.com/ski-lifts/val-cenis/colomba/"
            ]
        }
      }
    "isLoading": false,
    "error": null
      },
      logprobs: null,
      finish_reason: 'stop'
    }
  ],
  usage: {
    prompt_tokens: 205,
    completion_tokens: 149,
    total_tokens: 354,
    prompt_tokens_details: { cached_tokens: 0, audio_tokens: 0 },
    completion_tokens_details: {
      reasoning_tokens: 0,
      audio_tokens: 0,
      accepted_prediction_tokens: 0,
      rejected_prediction_tokens: 0
    }
  },
  service_tier: 'default',
  system_fingerprint: 'fp_abc123'
}
```

Let's investigate this response:

- It provides all kinds of metadata about the request, like the model used, the time of the request, an unique identifier etc. The things we care about now are the choices and usage object.
- In the `choices` object, it returns a json object with the data that we asked for. We can directly pass this into our application and use it however we want. Depending on your prompt, it can return one or more results.
- in the `usage` object, it will tell us something about the cost of this request. Every request that you do with the API will use tokens. There is a cost to pay for these tokens, depending on the AI model that you use. But how does this work?

##### Breakdown of costs

We can break down the tokens into three types:

- `prompt tokens` represent the number of tokens in the input. This is whatever we provide in our query.
- `completion tokens` represent the number of tokens used to generate the output. This is what ChatGPT needed to process the result
- `total tokens` represent the total number of tokens used (prompt + completion)

Additionally, the response shows breakdowns of both the prompt tokens and completion tokens. For the sake of brevity, I will not go over these details in this post, other than saying that these values can be used for optimizing your queries.

Depending on the model used, the price for this query would be:

- $0.00012015 (GPT-4o mini)
- $0.000708 (GPT 3.5)
- $0.01509 (GPT4)

Those seem like some random numbers and terms if you have never worked with them before, so let's go over them down below:

##### Breakdown of models

ChatGPT offers different models that you can use. Which model is the best for your use case depends on

- the reasoning capacity you need
- the cost that you are willing to make

Common ChatGPT models:

- GPT-4o mini: Low to Medium High-volume, low-cost tasks Most Cost-Effective
- GPT-3.5: Moderate Complexity Balanced tasks (good for general use) Moderately Cost-Effective
- GPT-4: High Complexity, Nuanced Tasks Advanced problem-solving, specialized tasks High Cost, High Accuracy

#### Differences between ChatGPT Chat and ChatGPT API

So that proves our case. It works a bit different, and this time costs are involved, but it proves that we can get the same data using the ChatGPT API as when we used the ChatGPT Chat. Or did we?

There is a problem with the response. Some of you may already have noticed it.
If you look carefully at the results, you will see that, while the properties are the same for both data entries, the data from the `ChatGPT API` is fundamentally different from the data that `ChatGPT Chat` provided.

```
const result_chatgpt_chat = {
  "name": "Colomba",
  "lift_type": "6-person high-speed detachable chairlift",
  "manufacturer": "Doppelmayr",
  "operator": "Val Cenis Ski Resort",
  "capacity": 2400,
  "duration": 3.83,
  "occupancy": 6,
  "construction": 2010,
  "lift_elevation": 159,
  "lift_distance": 1051,
  "ski_resort": "Val Cenis – Lanslevillard/Lanslebourg/Termignon",
  "source_urls": [
    "https://www.skidetails.com/ski-resort/val-cenis-lanslevillardlanslebourgtermignon/ski-lifts/l91126/"
  ]
}

const result_chatgpt_api = {
  "name": "Colomba",
  "lift_type": "Chair lift",
  "manufacturer": "Poma",
  "operator": "Société des Remontées Mécaniques de Val Cenis",
  "capacity": 2000,
  "duration": 5,
  "occupancy": 4,
  "construction": 1998,
  "elevation": 350,
  "distance": 950,
  "ski_resort": "Val Cenis",
  "source_urls": [
    "https://www.skidetails.com/ski-lifts/val-cenis/colomba/"
  ]
}
```

Wait.. what? How is this possible? Assuming that both use the same model, the same parameters and the same prompt, why is the response _so different_?

This bummed me at first. I just did not understand why this happened.
The first hint to what is really going on here can be found when looking at the source urls.

```
const resort_url_chat = `https://www.skidetails.com/ski-resort/val-cenis-lanslevillardlanslebourgtermignon/ski-lifts/l91126/`
const resort_url_api = `https://www.skidetails.com/ski-lifts/val-cenis/colomba/`
```

By looking at the source url, we see that they use the same website as a source, but they are very different in structure. Now it's possible that the maintainer of the website has some interesting thoughts about good SEO, but that is not the case here. One of these urls is incorrect, and that is the root of our problem. Which one do you think is the invalid one?

`It's the url that we got from the API.`

If the url is wrong it's likely that the other data is also wrong (I can tell you, that is the case..) It turns out that the reason behind this is straightforward, but it _is_ easy to miss!

`The ChatGPT API has no access to the internet.`

Unlike the ChatGPT Chat, the API can not browse webpages. Any information that the ChatGPT api provides _comes from the model_ or _is generated_. That explains why the data makes no sense at all.

`It's all generated.`

This is a really easy pitfall to get into, ChatGPT will not warn you in any way that the data might not be accurate, _even_ if we _explicitly_ ask for accurate data. If it can not find the data, it will just generate it and state it as factual data. This is known as _Hallucinating_.

`Note:` You can instruct ChatGPT what to do when it can't find factual data. For example, you can tell it to leave the field blank instead of making something up to fill the field. But even then it might (and will) still happen that it will return incorrect data instead of leaving the field blank.

##### Why is the ChatGPT API different?

Why does the ChatGPT API not have access to the internet? It seems a really convenient functionality to have for the ChatGPT API. We know it is possible, the ChatGPT Chat has it after all.

There are several reasons for this, but the most important one is `the cost`.
Web browsing can be seen as a wildcard. If you are looking for something on the internet, you will get results depending on `how accurate your search term is` and `what information is available on the web`. While ChatGPT is very capable finding information by browsing the web, it also charges you for any information it processes. And here's the catch: how much tokens will it need to find the data you're asking for? What if it needs to parse a page with 20k+ words to extract the 20 words that are relevant to you? What if it needs to process 5 different webpages from different websites and aggregate this information? The amount of tokens you'll be charged to get this information can stack up quickly. How much tokens are we willing to spend on a request? What if the token limit is reached? Can the code handle incomplete results? How can you guide ChatGPT how/where to look for the information?

As you can see, it is far from certain what information we can expect and at what cost if we depend on information found on the web. Also we would have to implement contingencies when we do not get the results we want.

#### Verdict

So where are we now?

- Data: We can't rely on the data at all. Because the API does not have access to the internet, it will fall back to it's LLM and hallucinate the results.
- Cost: There will be a small cost up to ~2 cents per request depending on the token and model usage
- Robustness: This setup will still probably return all the properties you need in a form that you can consume in your web application.
- Practicality: It is not practical. We don't have access to the internet, so we won't get any useful data.

This kind of blows our use case out of the water doesn't it? This was precisely the reason that we want to use AI: to get us the information we are looking for without all that hassle. If it can't access that information to start with, we're kind of dead in the water.

`So. This is it? Give up, pout a bit and move on?`

Maybe not.

We defined two major steps at the start of this post:

- Use AI to find the data for us on the web
- Use AI to transform the data into a suitable format that our application can consume

It turns out the first step is problematic:

- The ChatGPT Chat can get the information, but there is not programmatical interface
- The ChatGPT API has a programmatical interface, but has no connection to the internet

So using AI to find our data is not looking to be a viable option.

But we should still be able to satisfy step 2: to _process_ information and _present_ it into a usable format. ChatGPT is _really_ good at processing information and presenting it in a desirable format. How would that look when provide the information ourselves?

# 2. Using AI to transform the data into a suitable format that our application can consume

So let's get this one on the road. With ChatGPT out of the picture to find the data for us, we will have to rely on something else. There is a straightforward one that we use every day:

`Search engines`

Search engines are really good at finding results, but it won't necessarily be what you are looking for. It can provide results that companies want you to see (and pay the search engine for that privilege) or it will return results that match your query but do not contain all data you are looking for.

To get the data as accurate and complete as possible, it helps to identify a reliable source that you can use, which should provide all the data you need. Trust me, you don't want to bother with having to collect results from different sources.

## Getting the data

For this post, We'll use the `Brave search API`. There are other options out there, most search engines offer an API version. You will need to create an account and generate an API key to communicate with the search API. Most API's offer a free plan with rate limits (there are pricing plans if you need them).

Search Engines _need_ accurate input, if you give it a vague prompt it will provide vague results. So it's important to put some thought into the prompt that we give it.

We want accurate, concise results, so let's tell the API to prioritize our trusty ski data website `https://my-trusty-ski-data-website.com` for results.

It would look something like this:

```
const website = 'https://my-trusty-ski-data-website.com';
const resort = 'val cenis';
const liftName = 'colomba';
const SEARCH_API_KEY = `abc123`;
const SEARCH_API_URL = `https://api.search.brave.com/res/v1/web/search`;
const SEARCH_API_OPTIONS = {
  count: 1, // we are only interested in the first result
  result_filter: "web", // we only want web results
};

const headers = {
  headers: {
    Accept: "application/json",
    "X-subscription-token": SEARCH_API_KEY,
    "Accept-Encoding": "gzip",
    method: "GET",
  },
};

// encode SEARCH_API_OPTIONS so that we can use them as a querystring
const queryString = Object.entries(SEARCH_API_OPTIONS)
  .map(
    ([key, value]) =>
      `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  )
  .join("&");

const url = `${
  SEARCH_API_URL
}?q=site:${website}%20details%20${encodeURIComponent(
  resort
)}%20${encodeURIComponent(liftName)}&${queryString}`;

const response = await fetch(url, headers);
```

So what this piece of code does:

- It does a call to the brave search API, which will give us results related to our query
- We provide headers that make sure we provide the api key and the result format
- Additionally, we tweak the API so we ensure we only get a single web result
- Lastly, we will provide the API with the website we want to search, and the ski resort and lift name
- There is some stuff going on to make sure the data is properly urlencoded

This query will return one url with (hopefully) all the information we need! But there's never a guarantee that it returns a useful result. It's always important to tweak the search request to make it as reliable as you can.

When we access the url, we get an entire webpage. It should contain the data we need, but we will also get everything else, like the header, sidebar, footer, page scripts, inline styles, etc. We won't have a use for most of this, so we must extract the data we need somehow. Let's see how this would look using ChatGPT.

#### Processing the data

Like stated before, ChatGPT is good at doing this. But it takes prompt tokens for the data we put into it. So how much data are we talking about here? And what would it cost?

Let's work with some numbers:

- The average HTML size of a webpage nowadays is 50-100kb, excluding downloadable assets like media, css, javascript, etc. Let's be pessimistic ande take 100kb as the webpage size for this calculation.
- a 100kb file equals 100.000 bytes (actually it would be 102,400 bytes but let's say we like nice round numbers)
- 1 byte roughly equals 1 character
- 1 ChatGPT token equals 4 characters in english (or HTML-like text)

This would mean that we would need 100k / 4 = 25k tokes to feed the page into ChatGPT.

Pricewise, this would come down to
gpt-4: $0.75
gpt-4o-mini: $0.075

Autch.. that's a hefty price for just one request..

So we can use ChatGPT to extract the data we need from the website source code we found, but it's not exactly free. Also, there is only so much data that ChatGPT can processs at a time, because of something called the _context window_.

##### Sidenote: context window

Keep in mind that depending AI models have a context window limit. The ChatGPT API is stateless, so it won't retain the input between API calls. There are things you can do to get around this (ex. resending the input every query and/or choose a model that has a bigger context window) but it should be clear by now that it definitely pays off to get your input as concise as possible before providing it to ChatGPT.

Sending an entire page source into the ChatGPT API would not be my definition of concise..

So, what can we do to make the input smaller and more concise? A typical HTML page contains a lot of information that won't be useful for our use case:

- commented code
- html markup
- inline styles
- inline javascript
- assets

So let's to clean that up shall we!

We can use a scraper for this. Scrapers are really good at collecting data from webpages. They are typically used to get certain data like prices from webpages. They provide ways to select really specific parts of a webpage, but this can be unreliable as you will be dependent on the structure of the page and any changes that can happen whenever the maintainer of the websites pushes a change.

Now there are two ways we can approach this:

1. by extracting the exact data that we need using css selectors.
2. by removing everything we don't need

In this case, I would choose the second option as it is a more robust and reliable way to reduce the size of our input without risking changes in the input breaking our scraper. We will use Cheerio for this post, but there are many, many options out there.

It would look something like this:

```
import * as cheerio from "cheerio";

const URL = `https://url-with-data`;

const $ = await cheerio.fromURL(url);

$("script, style").remove(); // remove all scripts, styles
const rawText = $("body").text(); // get all text from the page
const data = rawText.replace(/\s+/g, " ").trim(); // remove all unnecessary whitespaces
```

This will give us all the text on the webpage, bar anything else.
This will smash down the text size by 90% or even more. In our example, that would mean that we would have 10kb of text instead of 100kb.

pricewise, this would come to:
GPT-4: $0.06
GPT-40-mini: $0.0003

.. which are pretty reasonable nunbers and could be improved further by cleaning the input more. But it will probably make the input less robust as you will have to have to traverse page structure.

At this point you might start to realize that we are taking more and more out of the hands of ChatGPT. It kind of feels like we're reinventing the wheel and falling back to the common practices, like substituting AI with a search API and a scraper..

### So what does this mean?

What I took away from this is the following:

- We can search the web for data (although ChatGPT API itself can't provide it for us)
- We can extract the details we are looking from (ChatGPT API can do this for us, but it's cheaper to do it ourselves)
- We can feed these details into the ChatGPT API, which will analyse the data and transform it into a usable form (this is where ChatGPT really helps us)
- AI is really powerful. It can do astonishing stuff. But it is definitely not a silver bullet / solution for everything.
- It does have some important limitations that can make or break your use case, like the context window and having no access to the internet.
- AI is not cheap. You probably know that AI consumes a lot of power to do what it does, so make sure that you get the max out of that processing power.

### Conclusion

With what I learned from doing this post, I would not use AI for data retrieval. Right now the ChatGPT API does not have access to the internet (although some other [LMMs](https://docs.perplexity.ai/faq/faq#is-the-internet-data-access-provided-by-the-api-identical-to-that-of-perplexitys-web-interface) might). Still, it can be costly to get that information depending on how hard AI has to work to get all relevant information.

I do see benefits of using AI to transform unfiltered data into structured data that can be consumed inside your application, but you still need to take the effort to optimize this input to save costs.

## Other considerations

Right now, there is probably nothing as fast-paced and changing as AI, with new possibilities and opportunities peeking behind the corner every day. It might be that the conclusion I make here changes in the near future. It could even be today.

There are already options out there that might even be worth looking into right now.

### Asking Agentic AI (this could potentially do the job, but it will take time to yield results and is probably overkill for this use case)

### Self-hosting/training your AI (bit purchasing/using hardware you own might not necessarily be cheaper)

### Use a solution like roborabbit.com
