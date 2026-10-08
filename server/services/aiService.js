const DEFAULT_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta";

const DEFAULT_MODEL = "gemini-3.5-flash-lite";

/*
|--------------------------------------------------------------------------
| OUTPUT TYPE
|--------------------------------------------------------------------------
*/

const normalizeOutputType = (type) => {
  if (type === "short-book") {
    return "story";
  }

  if (["story", "poetry", "magazine"].includes(type)) {
    return type;
  }

  return "story";
};

/*
|--------------------------------------------------------------------------
| LANGUAGE
|--------------------------------------------------------------------------
*/

const normalizeLanguage = (language) => {
  if (
    String(language || "")
      .trim()
      .toLowerCase() === "hindi"
  ) {
    return "Hindi";
  }

  return "English";
};

/*
|--------------------------------------------------------------------------
| SAFE JSON PARSER
|--------------------------------------------------------------------------
*/

const safeJsonParse = (text) => {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(/\{[\s\S]*\}/);

    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {
        return null;
      }
    }

    return null;
  }
};

/*
|--------------------------------------------------------------------------
| CLEAN TEXT
|--------------------------------------------------------------------------
*/

const cleanText = (value) => {
  if (!value) return "";

  return String(value)
    .replace(/\r/g, "")
    .trim();
};

/*
|--------------------------------------------------------------------------
| STEP 1 — UNDERSTAND THE MEMORY
|--------------------------------------------------------------------------
*/

const buildMemoryAnalysisPrompt = ({
  title,
  date,
  location,
  people,
  description,
}) => {
  return `
You are a Memory Understanding AI.

Your job is NOT to rewrite the memory.

First understand the user's raw memory deeply so another creative AI can
later turn it into a beautiful Story Book, Poetry piece or Magazine.

Analyze only what the user actually provided.

IMPORTANT:
- Do not invent major events.
- Do not invent people.
- Do not invent places.
- Do not invent dates.
- Do not invent conversations.
- If something is unknown, leave it empty.
- You may identify emotional possibilities, but clearly base them on the input.
- Preserve the user's facts.
- Detect chronology whenever possible.
- Identify relationships between people.
- Identify emotional changes.
- Identify important objects, places and moments.
- Identify possible visual/photo opportunities.

Return ONLY valid JSON.

JSON structure:

{
  "memoryTitle": "",
  "coreTheme": "",
  "tone": "",
  "emotionalArc": "",

  "confirmedFacts": [],

  "people": [
    {
      "name": "",
      "role": "",
      "relationship": ""
    }
  ],

  "places": [],

  "events": [
    {
      "order": 1,
      "event": "",
      "importance": ""
    }
  ],

  "timeline": [],

  "keyMoments": [],

  "emotions": [],

  "relationshipDynamics": [],

  "sensoryDetailsProvidedByUser": [],

  "importantObjectsOrSymbols": [],

  "potentialCreativeAngles": [],

  "possibleChapterIdeas": [],

  "photoContextHints": [],

  "closingEmotion": ""
}

USER MEMORY

Title: ${title || ""}

Date: ${date || "Not provided"}

Location: ${location || "Not provided"}

People:
${(people || []).join(", ") || "Not provided"}

Description:
${description || ""}
`;
};

/*
|--------------------------------------------------------------------------
| STORY BOOK PROMPT
|--------------------------------------------------------------------------
*/

const buildStoryPrompt = (
  analysis,
  language = "English"
) => {
  return `
You are an expert personal memoir writer and digital memory-book
creative director.

Transform the structured memory below into a genuinely written Story Book.

This must feel like a real human-written personal story, NOT like a
summary and NOT like the user's raw text with a few words changed.

LANGUAGE REQUIREMENT:

The selected language is: ${language}

IMPORTANT:
- Generate the ENTIRE Story Book in ${language}.
- If the selected language is Hindi, write naturally in Hindi using
  Devanagari script.
- Do NOT write the main story in English when Hindi is selected.
- Chapter titles must also be in ${language}.
- Subtitles must also be in ${language}.
- Quotes must also be in ${language}.
- Final reflection must also be in ${language}.
- Closing quote must also be in ${language}.
- Do not mix English into the main content when Hindi is selected.
- Proper names, places, brand names and unavoidable technical terms may
  remain in their natural form.

The story should have:

- A meaningful title.
- A beautiful opening.
- Natural narrative progression.
- Beginning.
- Development.
- Emotional high point.
- Meaningful ending.
- Emotional transitions.
- Imagery and sensory writing where appropriate.
- Natural dialogue ONLY when dialogue is explicitly provided or can be
  safely presented as a non-verbatim remembered feeling.
- Never fabricate exact conversations.
- Strong emotional connection.
- A final reflection.

CHAPTER RULE:

Choose automatically:

1. If the memory is short:
   Use one continuous story or 2-3 sections.

2. If the memory contains multiple meaningful events:
   Create 3-7 meaningful chapters.

3. Never create chapters just to increase length.

4. Chapter titles should represent actual events or emotional phases.

5. Do NOT put the entire story into one chapter.

PHOTO DESIGN:

Suggest intelligent photo placement.

Do not assume a photo exists.

Return ONLY valid JSON.

{
  "type": "story",
  "title": "",
  "subtitle": "",
  "openingLine": "",
  "storyMode": "short-story | full-story | chapter-book",
  "visualStyle": "",
  "coverConcept": "",

  "chapters": [
    {
      "chapterNumber": 1,
      "title": "",
      "subtitle": "",
      "openingLine": "",
      "content": "",
      "quote": "",
      "photoLayout": "hero | split | collage | polaroid | cinematic | timeline | none",
      "photoSuggestion": "",
      "illustrationPrompt": ""
    }
  ],

  "finalReflection": "",
  "closingQuote": "",

  "photoStrategy": {
    "preferredLayouts": [],
    "featuredPhotoSuggestion": "",
    "galleryStyle": ""
  }
}

STRUCTURED MEMORY:
${JSON.stringify(analysis, null, 2)}
`;
};

/*
|--------------------------------------------------------------------------
| POETRY PROMPT
|--------------------------------------------------------------------------
*/

const buildPoetryPrompt = (
  analysis,
  language = "English"
) => {
  return `
You are an expert poet and emotional writing AI.

Turn the structured personal memory into a REAL POEM.

LANGUAGE REQUIREMENT:

The selected language is: ${language}

IMPORTANT:
- Generate the ENTIRE poem in ${language}.
- If Hindi is selected, write naturally in Hindi using Devanagari script.
- The title must be in ${language}.
- The subtitle must be in ${language}.
- The poem must be completely in ${language}.
- Featured line must be in ${language}.
- Closing note must be in ${language}.
- Do NOT convert Hindi poetry into English-style sentences.
- Do NOT mix English into the main poem when Hindi is selected.
- Proper names and places may remain in their natural form.

IMPORTANT:

The result must genuinely feel like poetry.

DO NOT:
- Rewrite the memory as a normal story.
- Break a paragraph into short lines and call it poetry.
- Add random English sentences.
- Use generic motivational quotes.
- Repeat the same sentence structure.
- Add events that were not provided.

Instead use:
- Imagery.
- Metaphor.
- Symbolism.
- Rhythm.
- Stanzas.
- Emotional progression.
- Meaningful repetition when appropriate.
- Silence/pauses through spacing.
- Specific details from the memory.
- A distinctive poetic voice.

Choose the most suitable poetry style automatically.

Possible styles:
- Free verse
- Nostalgic
- Romantic
- Friendship
- Coming-of-age
- Reflective
- Cinematic
- Bittersweet
- Celebration
- Gratitude

Return ONLY valid JSON.

{
  "type": "poetry",
  "title": "",
  "subtitle": "",
  "poetryStyle": "",
  "mood": "",
  "visualStyle": "",
  "coverConcept": "",

  "poem": "",

  "featuredLine": "",

  "closingNote": "",

  "photoStrategy": {
    "preferredLayouts": [],
    "featuredPhotoSuggestion": "",
    "galleryStyle": ""
  }
}

STRUCTURED MEMORY:
${JSON.stringify(analysis, null, 2)}
`;
};

/*
|--------------------------------------------------------------------------
| MAGAZINE PROMPT
|--------------------------------------------------------------------------
*/

const buildMagazinePrompt = (
  analysis,
  language = "English"
) => {
  return `
You are a creative magazine editor, visual storyteller and memory-book
designer.

Transform the structured personal memory into a COMPLETE DIGITAL
MEMORY MAGAZINE EXPERIENCE.

It must NOT look like a normal article.

Think like a premium personal magazine.

LANGUAGE REQUIREMENT:

The selected language is: ${language}

IMPORTANT:
- Generate the ENTIRE magazine content in ${language}.
- If Hindi is selected, write naturally in Hindi using Devanagari script.
- Cover headline must be in ${language}.
- Cover tagline must be in ${language}.
- Editor's note must be in ${language}.
- Main story must be in ${language}.
- Highlights must be in ${language}.
- People section must be in ${language}.
- Photo captions must be in ${language}.
- Timeline text must be in ${language}.
- Pull quote must be in ${language}.
- Little details must be in ${language}.
- Closing note must be in ${language}.
- Do NOT mix English into the main content when Hindi is selected.
- Proper names, places and unavoidable brand names may remain natural.

Possible sections:

- Cover
- Cover headline
- Cover tagline
- Editor's note
- Main story
- Memory highlights
- People section
- Photo story
- Timeline
- Pull quote
- Little details
- Closing note

Only include sections that genuinely fit the memory.

Do not invent information.

The magazine should feel:
- editorial
- personal
- cinematic
- visually rich
- emotionally meaningful

Use different writing styles for different sections.

For example:
- Cover = short and powerful.
- Editorial = personal and reflective.
- Main story = narrative.
- Highlights = concise.
- Timeline = factual.
- Pull quote = memorable.
- Closing = emotional.

Return ONLY valid JSON.

{
  "type": "magazine",

  "title": "",
  "coverHeadline": "",
  "coverTagline": "",
  "coverConcept": "",
  "visualStyle": "",

  "editorNote": {
    "heading": "",
    "content": ""
  },

  "mainStory": {
    "heading": "",
    "subheading": "",
    "content": ""
  },

  "highlights": [
    {
      "label": "",
      "value": ""
    }
  ],

  "peopleSection": {
    "heading": "",
    "intro": "",
    "people": [
      {
        "name": "",
        "role": "",
        "description": ""
      }
    ]
  },

  "photoStory": {
    "heading": "",
    "intro": "",
    "photoIdeas": [
      {
        "caption": "",
        "layout": "hero | split | collage | polaroid | cinematic | timeline"
      }
    ]
  },

  "timeline": [
    {
      "label": "",
      "description": ""
    }
  ],

  "pullQuote": "",

  "littleDetails": [],

  "closingNote": {
    "heading": "",
    "content": ""
  }
}

STRUCTURED MEMORY:
${JSON.stringify(analysis, null, 2)}
`;
};

/*
|--------------------------------------------------------------------------
| AI CALL — GEMINI
|--------------------------------------------------------------------------
*/

const callAI = async ({
  system,
  prompt,
  temperature = 0.8,
}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add your Gemini API key to server/.env."
    );
  }

  const baseUrl = (
    process.env.GEMINI_BASE_URL ||
    DEFAULT_BASE_URL
  ).replace(/\/$/, "");

  const model =
    process.env.GEMINI_MODEL ||
    DEFAULT_MODEL;

  const response = await fetch(
    `${baseUrl}/models/${model}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: system,
            },
          ],
        },

        contents: [
          {
            role: "user",

            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        generationConfig: {
          temperature,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Gemini provider error (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  const content =
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("")
      .trim();

  if (!content) {
    const finishReason =
      data?.candidates?.[0]?.finishReason ||
      "unknown";

    throw new Error(
      `Gemini returned an empty response. Finish reason: ${finishReason}`
    );
  }

  return content;
};

/*
|--------------------------------------------------------------------------
| FALLBACK TEXT
|--------------------------------------------------------------------------
*/

const createFallback = ({
  title,
  description,
  outputType,
  language = "English",
}) => {
  const isHindi =
    normalizeLanguage(language) === "Hindi";

  /*
  |--------------------------------------------------------------------------
  | HINDI POETRY FALLBACK
  |--------------------------------------------------------------------------
  */

  if (
    outputType === "poetry" &&
    isHindi
  ) {
    return {
      type: "poetry",

      title:
        title || "एक याद",

      subtitle:
        "एक पल, जो याद बन गया",

      poetryStyle:
        "मुक्त छंद",

      mood:
        "भावुक और स्मृतिमय",

      visualStyle:
        "Dreamy Memory",

      coverConcept:
        "याद से जुड़ी सबसे भावुक तस्वीर को मुख्य कवर के रूप में रखें।",

      poem:
        description ||
        "कुछ पल बीत जाते हैं,\nलेकिन उनकी यादें\nहमारे भीतर रह जाती हैं।",

      featuredLine:
        "कुछ यादें तस्वीरों में नहीं,\nदिल में बस जाती हैं।",

      closingNote:
        "यह पल बीत गया,\nपर इसकी याद हमेशा साथ रहेगी।",

      photoStrategy: {
        preferredLayouts: [
          "hero",
          "polaroid",
        ],

        featuredPhotoSuggestion:
          "सबसे भावुक तस्वीर को मुख्य तस्वीर के रूप में रखें।",

        galleryStyle:
          "Soft scrapbook",
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ENGLISH POETRY FALLBACK
  |--------------------------------------------------------------------------
  */

  if (outputType === "poetry") {
    return {
      type: "poetry",

      title:
        title || "A Memory",

      subtitle:
        "A moment that stayed",

      poetryStyle:
        "Free Verse",

      mood:
        "Reflective",

      visualStyle:
        "Dreamy Memory",

      coverConcept:
        "A quiet visual representation of the memory.",

      poem:
        description ||
        "Some moments pass,\nbut their memories\nstay with us.",

      featuredLine:
        "Some memories live beyond the moment.",

      closingNote:
        "The moment passed, but the memory stayed.",

      photoStrategy: {
        preferredLayouts: [
          "hero",
          "polaroid",
        ],

        featuredPhotoSuggestion:
          "Use the most emotionally meaningful photograph as the hero image.",

        galleryStyle:
          "Soft scrapbook",
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | HINDI MAGAZINE FALLBACK
  |--------------------------------------------------------------------------
  */

  if (
    outputType === "magazine" &&
    isHindi
  ) {
    return {
      type: "magazine",

      title:
        title || "मेरी याद",

      coverHeadline:
        title || "एक यादगार पल",

      coverTagline:
        "एक पल, एक एहसास, एक कहानी।",

      coverConcept:
        "सबसे खूबसूरत तस्वीर को मैगज़ीन कवर पर रखें।",

      visualStyle:
        "Personal Editorial",

      editorNote: {
        heading:
          "संपादक की बात",

        content:
          "हर याद के कुछ छोटे-छोटे पल समय के साथ और भी खास हो जाते हैं।",
      },

      mainStory: {
        heading:
          title || "याद के पीछे की कहानी",

        subheading:
          "एक पल जिसने अपनी जगह बना ली",

        content:
          description ||
          "हर याद अपने साथ एक कहानी लेकर आती है।",
      },

      highlights: [],

      peopleSection: {
        heading:
          "इस याद के लोग",

        intro: "",

        people: [],
      },

      photoStory: {
        heading:
          "तस्वीरों के ज़रिए",

        intro:
          "इस याद से जुड़े खास पलों की तस्वीरें।",

        photoIdeas: [],
      },

      timeline: [],

      pullQuote:
        "कुछ पल समय के साथ यादों में बदल जाते हैं।",

      littleDetails: [],

      closingNote: {
        heading:
          "जब फिर पीछे मुड़कर देखेंगे",

        content:
          "पल बीत गया, लेकिन उसकी याद हमारे साथ रह गई।",
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ENGLISH MAGAZINE FALLBACK
  |--------------------------------------------------------------------------
  */

  if (outputType === "magazine") {
    return {
      type: "magazine",

      title,

      coverHeadline:
        title,

      coverTagline:
        "A moment, a feeling, a story worth remembering.",

      coverConcept:
        "Use the strongest photograph as the magazine cover.",

      visualStyle:
        "Personal Editorial",

      editorNote: {
        heading:
          "Editor's Note",

        content:
          "Every memory has details that become more valuable with time.",
      },

      mainStory: {
        heading:
          title,

        subheading:
          "The story behind the memory",

        content:
          description,
      },

      highlights: [],

      peopleSection: {
        heading:
          "The People",

        intro: "",

        people: [],
      },

      photoStory: {
        heading:
          "Through the Photos",

        intro:
          "A visual collection of moments from this memory.",

        photoIdeas: [],
      },

      timeline: [],

      pullQuote:
        "Some moments become part of us.",

      littleDetails: [],

      closingNote: {
        heading:
          "Until We Look Back Again",

        content:
          "The moment passed, but the memory stayed.",
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | HINDI STORY FALLBACK
  |--------------------------------------------------------------------------
  */

  if (
    outputType === "story" &&
    isHindi
  ) {
    return {
      type: "story",

      title:
        title || "एक यादगार कहानी",

      subtitle:
        "एक याद, जिसे संभालकर रखना है",

      openingLine:
        "कुछ पल इसलिए खास बन जाते हैं क्योंकि वे हमारे दिल में जगह बना लेते हैं।",

      storyMode:
        "short-story",

      visualStyle:
        "Cinematic Memory",

      coverConcept:
        "सबसे भावुक तस्वीर को कहानी के कवर पर रखें।",

      chapters: [
        {
          chapterNumber: 1,

          title:
            title || "वह याद",

          subtitle:
            "एक खास पल",

          openingLine:
            "कुछ पल बीत जाते हैं, लेकिन उनकी यादें हमारे साथ रहती हैं।",

          content:
            description ||
            "यह वह याद है जिसे समय के साथ और भी खास महसूस किया जाता है।",

          quote:
            "पल बीत जाते हैं, यादें नहीं।",

          photoLayout:
            "hero",

          photoSuggestion:
            "सबसे महत्वपूर्ण तस्वीर को शुरुआती दृश्य के रूप में रखें।",

          illustrationPrompt:
            "इस याद से प्रेरित एक गर्मजोशी भरी cinematic illustration बनाएं।",
        },
      ],

      finalReflection:
        "पीछे मुड़कर देखने पर समझ आता है कि कुछ छोटे पल हमारी जिंदगी का बड़ा हिस्सा बन जाते हैं।",

      closingQuote:
        "कुछ यादें तस्वीरों से कहीं ज्यादा होती हैं।",

      photoStrategy: {
        preferredLayouts: [
          "hero",
          "cinematic",
          "polaroid",
        ],

        featuredPhotoSuggestion:
          "सबसे भावुक तस्वीर को मुख्य तस्वीर बनाएं।",

        galleryStyle:
          "Cinematic scrapbook",
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | ENGLISH STORY FALLBACK
  |--------------------------------------------------------------------------
  */

  return {
    type: "story",

    title,

    subtitle:
      "A memory worth keeping",

    openingLine:
      "Some moments become stories simply because they mattered.",

    storyMode:
      "short-story",

    visualStyle:
      "Cinematic Memory",

    coverConcept:
      "Use the strongest photograph as a full-page cover.",

    chapters: [
      {
        chapterNumber: 1,

        title,

        subtitle: "",

        openingLine:
          "Some moments become stories simply because they mattered.",

        content:
          description,

        quote:
          "The moment ended, but the memory remained.",

        photoLayout:
          "hero",

        photoSuggestion:
          "Use the most meaningful photograph as the opening image.",

        illustrationPrompt:
          "Create a warm cinematic illustration inspired by the memory.",
      },
    ],

    finalReflection:
      "Looking back, the most meaningful part of a memory is often how it made us feel.",

    closingQuote:
      "Some memories deserve more than a place in the gallery.",

    photoStrategy: {
      preferredLayouts: [
        "hero",
        "cinematic",
        "polaroid",
      ],

      featuredPhotoSuggestion:
        "Use the strongest emotional photograph as the hero image.",

      galleryStyle:
        "Cinematic scrapbook",
    },
  };
};

/*
|--------------------------------------------------------------------------
| FORMAT OUTPUT
|--------------------------------------------------------------------------
*/

const buildResult = (type, data) => {
  if (!data) {
    throw new Error(
      "AI returned an invalid structured response."
    );
  }

  const normalizedType =
    normalizeOutputType(type);

  let content = "";

  if (normalizedType === "story") {
    content = [
      data.openingLine,

      ...(data.chapters || []).map(
        (chapter) =>
          `## ${chapter.title}\n\n${chapter.content}`
      ),

      data.finalReflection,

      data.closingQuote,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (normalizedType === "poetry") {
    content = [
      data.poem,

      data.closingNote,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (normalizedType === "magazine") {
    content = [
      `# ${data.coverHeadline || data.title}`,

      data.coverTagline,

      data.editorNote
        ? `## ${data.editorNote.heading}\n\n${data.editorNote.content}`
        : "",

      data.mainStory
        ? `## ${data.mainStory.heading}\n\n${data.mainStory.content}`
        : "",

      data.pullQuote
        ? `> ${data.pullQuote}`
        : "",

      data.closingNote
        ? `## ${data.closingNote.heading}\n\n${data.closingNote.content}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return {
    title:
      data.title ||
      data.coverHeadline ||
      "My Memory",

    content: cleanText(content),

    data,
  };
};

/*
|--------------------------------------------------------------------------
| MAIN GENERATION FLOW
|--------------------------------------------------------------------------
*/

exports.generateMemory = async (payload) => {
  const outputType =
    normalizeOutputType(
      payload.outputType
    );

  const language =
    normalizeLanguage(
      payload.language
    );

  /*
  |--------------------------------------------------------------------------
  | STEP 1 — UNDERSTAND MEMORY
  |--------------------------------------------------------------------------
  */

  const analysisResponse =
    await callAI({
      system:
        "You are a precise memory-analysis AI. Return only valid JSON.",

      prompt:
        buildMemoryAnalysisPrompt(
          payload
        ),

      temperature: 0.25,
    });

  const analysis =
    safeJsonParse(
      analysisResponse
    );

  if (!analysis) {
    throw new Error(
      "AI memory analysis returned invalid JSON."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | STEP 2 — CREATIVE GENERATION
  |--------------------------------------------------------------------------
  */

  let creativePrompt;
  let temperature;

  if (outputType === "poetry") {
    creativePrompt =
      buildPoetryPrompt(
        analysis,
        language
      );

    temperature = 1.0;
  } else if (
    outputType === "magazine"
  ) {
    creativePrompt =
      buildMagazinePrompt(
        analysis,
        language
      );

    temperature = 0.95;
  } else {
    creativePrompt =
      buildStoryPrompt(
        analysis,
        language
      );

    temperature = 0.9;
  }

  const creativeResponse =
    await callAI({
      system:
        "You are an expert creative memory writer and visual storytelling AI. Return only valid JSON.",

      prompt:
        creativePrompt,

      temperature,
    });

  let creativeData =
    safeJsonParse(
      creativeResponse
    );

  /*
  |--------------------------------------------------------------------------
  | FALLBACK
  |--------------------------------------------------------------------------
  */

  if (!creativeData) {
    creativeData =
      createFallback({
        title:
          payload.title,

        description:
          payload.description,

        outputType,

        language,
      });
  }

  /*
  |--------------------------------------------------------------------------
  | FINAL RESULT
  |--------------------------------------------------------------------------
  */

  return buildResult(
    outputType,
    creativeData
  );
};