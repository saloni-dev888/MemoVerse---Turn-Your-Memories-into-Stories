const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_MODEL = "gpt-4o-mini";

const normalizeOutputType = (type) => {
  if (type === "short-book") {
    return "story";
  }

  if (["story", "poetry", "magazine"].includes(type)) {
    return type;
  }

  return "story";
};

const safeJsonParse = (text) => {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (_) {
    // Try extracting JSON from markdown/code fences
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

const buildStoryPrompt = (analysis) => {
  return `
You are an expert personal memoir writer and digital memory-book
creative director.

Transform the structured memory below into a genuinely written Story Book.

This must feel like a real human-written personal story, NOT like a
summary and NOT like the user's raw text with a few words changed.

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
  safely presented as a non-verbatim remembered feeling. Never fabricate
  exact conversations.
- Strong emotional connection.
- A final reflection.

CHAPTER RULE:

Choose automatically:

1. If the memory is short:
   Use one continuous story or 2-3 sections.

2. If the memory contains multiple meaningful events:
   Create 3-7 meaningful chapters.

3. Never create chapters just to increase length.

4. Chapter titles should represent actual events/emotional phases.

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

const buildPoetryPrompt = (analysis) => {
  return `
You are an expert poet and emotional writing AI.

Turn the structured personal memory into a REAL POEM.

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

const buildMagazinePrompt = (analysis) => {
  return `
You are a creative magazine editor, visual storyteller and memory-book
designer.

Transform the structured personal memory into a COMPLETE DIGITAL
MEMORY MAGAZINE EXPERIENCE.

It must NOT look like a normal article.

Think like a premium personal magazine.

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
| AI CALL
|--------------------------------------------------------------------------
*/

const callAI = async ({
  system,
  prompt,
  temperature = 0.8,
}) => {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "AI_API_KEY is missing. Add your OpenAI API key to server/.env."
    );
  }

  const baseUrl = (
    process.env.AI_BASE_URL || DEFAULT_BASE_URL
  ).replace(/\/$/, "");

  const model =
    process.env.AI_MODEL || DEFAULT_MODEL;

  const response = await fetch(
    `${baseUrl}/chat/completions`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },

      body: JSON.stringify({
        model,

        temperature,

        messages: [
          {
            role: "system",
            content: system,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `AI provider error (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  const content =
    data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      "AI provider returned an empty response."
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
}) => {
  if (outputType === "poetry") {
    return {
      type: "poetry",
      title,
      subtitle: "A memory written in moments",
      poetryStyle: "Free Verse",
      mood: "Reflective",

      visualStyle: "Dreamy Memory",
      coverConcept:
        "A quiet visual representation of the memory.",

      poem: description,

      featuredLine:
        "Some memories stay long after the moment is gone.",

      closingNote:
        "A memory worth keeping close.",

      photoStrategy: {
        preferredLayouts: ["hero", "polaroid"],
        featuredPhotoSuggestion:
          "Use the most emotionally meaningful photograph as the hero image.",
        galleryStyle: "Soft scrapbook",
      },
    };
  }

  if (outputType === "magazine") {
    return {
      type: "magazine",
      title,

      coverHeadline: title,

      coverTagline:
        "A moment, a feeling, a story worth remembering.",

      coverConcept:
        "Use the strongest photograph as the magazine cover.",

      visualStyle: "Personal Editorial",

      editorNote: {
        heading: "Editor's Note",
        content:
          "Every memory has details that become more valuable with time.",
      },

      mainStory: {
        heading: title,
        subheading: "The story behind the memory",
        content: description,
      },

      highlights: [],

      peopleSection: {
        heading: "The People",
        intro: "",
        people: [],
      },

      photoStory: {
        heading: "Through the Photos",
        intro:
          "A visual collection of moments from this memory.",
        photoIdeas: [],
      },

      timeline: [],

      pullQuote:
        "Some moments become part of us.",

      littleDetails: [],

      closingNote: {
        heading: "Until We Look Back Again",
        content:
          "The moment passed, but the memory stayed.",
      },
    };
  }

  return {
    type: "story",
    title,
    subtitle: "A memory worth keeping",

    openingLine:
      "Some moments become stories simply because they mattered.",

    storyMode: "short-story",

    visualStyle: "Cinematic Memory",

    coverConcept:
      "Use the strongest photograph as a full-page cover.",

    chapters: [
      {
        chapterNumber: 1,
        title,
        subtitle: "",
        openingLine:
          "Some moments become stories simply because they mattered.",

        content: description,

        quote:
          "The moment ended, but the memory remained.",

        photoLayout: "hero",

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

      galleryStyle: "Cinematic scrapbook",
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

  /*
    Keep a readable text representation as well.
    This provides backward compatibility with the existing
    generatedContent field.
  */

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

    content,

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
    normalizeOutputType(payload.outputType);

  /*
    STEP 1:
    Understand the raw memory.
  */

  const analysisResponse = await callAI({
    system:
      "You are a precise memory-analysis AI. Return only valid JSON.",

    prompt:
      buildMemoryAnalysisPrompt(payload),

    temperature: 0.25,
  });

  const analysis =
    safeJsonParse(analysisResponse);

  if (!analysis) {
    throw new Error(
      "AI memory analysis returned invalid JSON."
    );
  }

  /*
    STEP 2:
    Generate according to selected format.
  */

  let creativePrompt;
  let temperature;

  if (outputType === "poetry") {
    creativePrompt =
      buildPoetryPrompt(analysis);

    temperature = 1.0;
  } else if (outputType === "magazine") {
    creativePrompt =
      buildMagazinePrompt(analysis);

    temperature = 0.95;
  } else {
    creativePrompt =
      buildStoryPrompt(analysis);

    temperature = 0.9;
  }

  const creativeResponse = await callAI({
    system:
      "You are an expert creative memory writer and visual storytelling AI. Return only valid JSON.",

    prompt: creativePrompt,

    temperature,
  });

  let creativeData =
    safeJsonParse(creativeResponse);

  /*
    If JSON parsing fails, use a safe fallback
    instead of crashing the complete memory.
  */

  if (!creativeData) {
    creativeData = createFallback({
      title: payload.title,
      description: payload.description,
      outputType,
    });
  }

  return buildResult(
    outputType,
    creativeData
  );
};