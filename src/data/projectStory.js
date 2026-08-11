/** Long-form narrative for the institutional memory project. */

export const STORY_META = {
  eyebrow: "Case study · Narrative",
  title: "The Story",
  subtitle: "How this project unfolded",
  dek: "The long-form narrative behind the Portfolio Brief — written the way I'd tell it to another designer over coffee.",
  thesis:
    "Reducing organizational knowledge loss in fast-growing startups.",
};

export const STORY_SECTIONS = [
  {
    id: "boring-idea",
    label: "The boring idea",
    blocks: [
      {
        type: "lead",
        text: "Knowledge transfer for small startups. Onboarding a new employee. Handing over when someone leaves.",
      },
      { type: "p", text: "See? Boring." },
      {
        type: "p",
        text: "But I couldn't shake one question.",
      },
      {
        type: "pull",
        text: "When a designer quits a startup, what actually walks out the door with them?",
      },
      {
        type: "p",
        text: "I started listing it. Design decisions. Figma files nobody else can navigate. Hidden shortcuts. Customer context. Slack threads. And the classic: “ask X, they'll know.”",
      },
      {
        type: "p",
        text: "Then I replaced “designer” with “engineer” in my head.",
      },
      { type: "punch", text: "Worse. Much worse." },
      {
        type: "p",
        text: "Every startup with 10 to 30 people goes through this. And suddenly the idea didn't look like documentation anymore.",
      },
      {
        type: "insight",
        text: "It looked like a company slowly forgetting how it works.",
      },
      {
        type: "p",
        text: "That reframe changed everything for me. This wasn't an HR feature. It was an organizational problem. A founder problem.",
      },
      {
        type: "p",
        text: "But I still assumed I knew what the fix was. Better documentation, right?",
      },
      {
        type: "punch",
        text: "Wrong. And the research is what broke that assumption.",
      },
    ],
  },
  {
    id: "the-pattern",
    label: "The pattern I couldn't ignore",
    blocks: [
      {
        type: "lead",
        text: "When I dug into how people at small startups actually find information, one behavior kept showing up.",
      },
      {
        type: "pull",
        text: "Nobody searches the docs first.",
      },
      {
        type: "p",
        text: "They message a person. They know exactly who has the answer. They just have no idea where it's written down. If it's written down at all.",
      },
      {
        type: "p",
        text: "At first I read that as laziness. Then it kept repeating, and I had to take it seriously.",
      },
      {
        type: "insight",
        text: "People trust colleagues more than documentation — not because they're impatient, but because docs go stale, and everyone knows it. Asking a person gets you an answer that's true today.",
      },
      {
        type: "p",
        text: "So the knowledge wasn't missing. It was just stored in people instead of systems.",
      },
      {
        type: "p",
        text: "That raised an uncomfortable question. If everyone knows docs go stale, why does every team keep trying to write more of them?",
      },
    ],
  },
  {
    id: "documentation-dies",
    label: "Where good intentions die",
    tocLabel: "Documentation dies",
    blocks: [
      {
        type: "lead",
        text: "Documentation is where good intentions go to die. Here's the cycle I kept seeing.",
      },
      {
        type: "steps",
        items: [
          "Something breaks. Someone says “we should document this.”",
          "A wiki gets set up. Everyone writes enthusiastically for two weeks.",
          "Product work gets urgent. Documentation quietly stops.",
        ],
      },
      {
        type: "p",
        text: "Nobody owns its quality. Writing it feels like work with no immediate reward. Shipping always wins.",
      },
      {
        type: "insight",
        text: "Documentation fails because it relies on manual effort. Full stop. It's not a discipline problem you can fix with reminders. The whole model is fighting how startups actually work.",
      },
      {
        type: "p",
        text: "That's when the question flipped in my head.",
      },
      {
        type: "contrast",
        before: "How do we get people to document more?",
        after: "What if they never had to?",
      },
      {
        type: "p",
        text: "I'll come back to that. Because first, I found the moments where all of this quietly explodes.",
      },
    ],
  },
  {
    id: "two-moments",
    label: "The two moments everything breaks",
    tocLabel: "Two breaking moments",
    blocks: [
      {
        type: "lead",
        text: "Day to day, a startup can run on tribal knowledge just fine. Everyone interrupts everyone. It's fast. It works.",
      },
      {
        type: "p",
        text: "Until one of two things happens.",
      },
      {
        type: "moment",
        title: "Someone joins",
        points: [
          "Every manager onboards differently.",
          "The new hire gets a pile of documents with no sense of what matters.",
          "They ask the same questions every previous hire asked.",
          "They learn what to do long before they understand why.",
          "They hesitate to keep asking “basic” questions — so they quietly struggle instead.",
        ],
        closer: "The tools get learned fast. The context takes forever.",
      },
      {
        type: "moment",
        title: "Someone leaves",
        points: [
          "The damage is invisible until it's too late.",
          "The resignation letter arrives, and the team discovers how much was never written down.",
          "The handover covers tasks, not reasoning.",
          "There's no structured way to pull out the tacit stuff.",
          "Quality depends entirely on how generous the departing person feels.",
        ],
        closer:
          "Teams realize what knowledge they lost only after the person is gone.",
      },
      {
        type: "insight",
        text: "I thought onboarding was broken. Actually, onboarding was just exposing a deeper issue. Joining and leaving aren't the problem — they're the moments the problem becomes visible.",
      },
      {
        type: "punch",
        text: "The problem itself runs all the time. Quietly.",
      },
    ],
  },
  {
    id: "decisions-disappear",
    label: "Where decisions go to disappear",
    tocLabel: "Decisions disappear",
    blocks: [
      {
        type: "lead",
        text: "Here's the part that connected everything for me.",
      },
      {
        type: "pull",
        text: "Teams remember what they decided. They forget why.",
      },
      {
        type: "p",
        text: "Meeting notes rarely capture outcomes. The reasoning behind rejected ideas is almost never preserved. So old debates come back, again and again, because nobody can point to why the question was settled the first time.",
      },
      {
        type: "p",
        text: "And searching doesn't save you. Information is scattered across Slack, Notion, Google Docs, GitHub, Linear, email. People search two or three tools, give up, and interrupt a teammate. Sometimes they rebuild something that already exists because they couldn't find the original.",
      },
      {
        type: "p",
        text: "Even when search works, it returns documents. Not answers. You get ten files and the job of reading them.",
      },
      {
        type: "insight",
        text: "The knowledge exists. Retrieval is what's broken.",
      },
      {
        type: "p",
        text: "And one more thing sits on top of it all. Founders feel this as risk. They worry about depending on key people. They just can't see where the dependency is until something breaks. One person quietly becomes the only one who knows payroll, and nobody notices until they're on a plane.",
      },
      {
        type: "punch",
        text: "So. Not a documentation problem. A memory problem. Now what?",
      },
    ],
  },
  {
    id: "byproduct",
    label: "What if nobody had to document anything?",
    tocLabel: "Capture as by-product",
    blocks: [
      {
        type: "lead",
        text: "Back to that flipped question.",
      },
      {
        type: "insight",
        text: "If documentation dies because it's manual, the answer isn't better documentation tools. It's capturing knowledge as a by-product of work people already do.",
      },
      {
        type: "example",
        text: "A meeting happens. There's a transcript. A decision gets made in it. That decision gets extracted, linked to the project, given an owner, and becomes searchable forever. Nobody wrote a doc. The knowledge got kept anyway.",
      },
      {
        type: "p",
        text: "Once I trusted that idea, the rest of the product fell into place around the findings — almost one for one.",
      },
      {
        type: "map",
        items: [
          {
            finding: "People ask colleagues instead of searching",
            move: "Let them ask the system the same way. “How do refunds work?” gets a direct answer with linked evidence — not another chatbot. Summarization, not generation.",
          },
          {
            finding: "Decisions keep getting relitigated",
            move: "Keep the decision with its reasoning: the meeting, the participants, the alternatives, the outcome.",
          },
          {
            finding: "“Ask Rahul, he'll know”",
            move: "Make expertise visible — not an org chart, a map of who actually knows what.",
          },
          {
            finding: "Founders can't see their risk",
            move: "Surface bus factor on a dashboard before it hurts — only one person knows payroll.",
          },
        ],
      },
      {
        type: "p",
        text: "And the two breaking moments get their own workflows.",
      },
      {
        type: "pair",
        items: [
          {
            title: "New hire",
            text: "Not “read the Notion” — a generated path: people to meet, product walkthrough, first tasks, a glossary, recent decisions, an AI mentor for the hesitant questions.",
          },
          {
            title: "Departing employee",
            text: "Not “upload your docs” — an interview. What breaks if you disappear tomorrow? Which customers are tricky? Which Slack channels matter? What did nobody ever write down?",
          },
        ],
      },
      {
        type: "punch",
        text: "Each piece felt earned by something the research surfaced. That's when I knew the direction was right.",
      },
      {
        type: "p",
        text: "But one problem was still waiting for me.",
      },
    ],
  },
  {
    id: "positioning",
    label: "The positioning trap",
    blocks: [
      {
        type: "lead",
        text: "Call this “knowledge management” and you lose instantly.",
      },
      {
        type: "p",
        text: "Notion, Guru, Slite, Confluence — that space is crowded, and “better documentation” invites a comparison you can't win. Worse, it describes the product wrong. This thing isn't about storing documents at all.",
      },
      {
        type: "p",
        text: "So I narrowed it. Hard.",
      },
      {
        type: "pull",
        text: "Knowledge continuity for startups with 10–50 employees — through onboarding, role changes, and exits.",
      },
      {
        type: "p",
        text: "Or, in plain words: making sure a company doesn't forget how it works while it's busy growing.",
      },
      {
        type: "insight",
        text: "The frame I landed on is institutional memory. Not a wiki. A second brain for the company.",
      },
      {
        type: "p",
        text: "And the success metrics follow from that — you don't count documents written. You measure whether onboarding got faster, whether the team survives an exit without losing knowledge, whether people stop spending their day searching and interrupting, whether the founder's key-person risk actually shrinks.",
      },
      {
        type: "punch",
        text: "Continuity outcomes. Not documentation volume.",
      },
    ],
  },
  {
    id: "design-rules",
    label: "The rules I'm designing by",
    tocLabel: "Design principles",
    blocks: [
      {
        type: "lead",
        text: "Everything above compressed into six principles that now sit above every design decision.",
      },
      {
        type: "principles",
        items: [
          "Capture once, reuse everywhere.",
          "Context over content.",
          "Answers over documents.",
          "Knowledge belongs to the organization, not individuals.",
          "Automation should reduce effort, not remove control.",
          "Every answer should be explainable and traceable.",
        ],
      },
      {
        type: "p",
        text: "Each one traces back to a specific thing that kept showing up. Nothing here is a framework I imported. It's just the research, folded up small.",
      },
    ],
  },
  {
    id: "next",
    label: "Where this goes next",
    blocks: [
      {
        type: "lead",
        text: "The direction is set. The open questions are honest ones.",
      },
      {
        type: "questions",
        items: [
          "Which persona does v1 serve first — the founder, the manager, or the person answering the same question for the fifth time?",
          "Which workflow is the wedge: onboarding, exits, or ask-anything?",
          "Which three or four flows become the hero screens of the case study?",
        ],
      },
      {
        type: "p",
        text: "What I know for sure is the sentence the whole project now hangs on:",
      },
      {
        type: "thesis",
        text: "Reducing organizational knowledge loss in fast-growing startups.",
      },
      {
        type: "close",
        lines: [
          "I started with a compliance checklist I didn't believe in.",
          "I ended up designing a memory.",
          "Funny how that works.",
        ],
      },
    ],
  },
];
