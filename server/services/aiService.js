const buildPrompt = ({ title, date, location, people, description, outputType }) => {
  const typeInstructions = {
    story: "Write a warm, vivid first-person memory story with a beginning, middle and emotional ending.",
    poetry: "Turn the memory into an emotional free-verse poem with a meaningful title.",
    magazine: "Create a magazine-style memory spread with a headline, subheading, sections, highlights and a closing note.",
    "short-book": "Create a short memory book with a title, dedication, 4-6 short chapters/sections and a final reflection."
  };

  return `
You are a creative memory-book writer.
Transform the user's real memory into the requested format.

Requested format: ${outputType}
Instruction: ${typeInstructions[outputType]}

Memory title: ${title}
Date: ${date || "Not provided"}
Location: ${location || "Not provided"}
People: ${(people || []).join(", ") || "Not provided"}

Memory:
${description}

Rules:
- Do not invent major real-world facts.
- Keep the user's people, places and emotions consistent.
- Make the result natural and personal.
- Use clear formatting.
`;
};

const demoGenerate = ({ title, description, outputType, location, people }) => {
  const peopleText = people?.length ? people.join(", ") : "the people around me";
  const place = location || "that place";

  if (outputType === "poetry") {
    return `${title}

Some moments arrive quietly,
then stay louder than years.

In ${place},
with ${peopleText},
ordinary minutes became
the kind of memories
we wish we could replay.

${description}

And maybe that is what a memory is—
not a photograph,
but a feeling
that refuses to fade.`;
  }

  if (outputType === "magazine") {
    return `# ${title}

## A Memory Worth Keeping

**Where:** ${place}
**With:** ${peopleText}

### The Moment
${description}

### Little Things We Remember
- The people who made it special
- The unexpected little details
- The feeling we carried home

### Closing Note
Some days end on the calendar, but never really end in our hearts.`;
  }

  if (outputType === "short-book") {
    return `# ${title}

## Dedication
For the people and little moments that made this chapter of life meaningful.

## Chapter 1 — The Beginning
${description}

## Chapter 2 — The People
${peopleText} were part of this memory, making the experience more personal and unforgettable.

## Chapter 3 — The Place
${place} became more than a location; it became part of the story.

## Chapter 4 — What Stayed
The event ended, but the emotions, conversations and small details remained.

## Final Reflection
Years later, this is the kind of memory that can still bring a smile.`;
  }

  return `# ${title}

It started as an ordinary memory, but ${place} became the backdrop for something worth remembering.

${description}

With ${peopleText}, the little details became important—the conversations, laughter, pauses and unexpected moments.

Looking back, the most valuable part was not simply what happened, but how it felt. This is why this memory deserves a page of its own.`;
};

exports.generateMemory = async (payload) => {
  if (!process.env.AI_API_KEY) return demoGenerate(payload);

  const base = (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const response = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL,
      temperature: 0.8,
      messages: [
        { role: "system", content: "You create emotionally authentic personal memory-book content." },
        { role: "user", content: buildPrompt(payload) }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI provider error: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No content generated.";
};
