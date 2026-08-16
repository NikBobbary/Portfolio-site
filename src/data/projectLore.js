export const LORE_META = {
  eyebrow: "Project lore",
  kicker: "Institutional Memory Platform",
  title: "Reducing organizational knowledge loss in fast-growing startups",
  dek: "How fast-growing startups lose their operational memory — and how this project found the problem worth solving. The discovery journey behind the Institutional Memory Platform.",
};

export const LORE_SECTIONS = [
  {
    id: "question",
    label: "The question that started everything",
    blocks: [
      {
        type: "lead",
        text: "Imagine a designer quits a fifteen-person startup.",
      },
      {
        type: "p",
        text: "What actually walks out the door with them?",
      },
      {
        type: "p",
        text: "Not the Figma files. Those stay. It's everything around them — the design decisions, the reasons behind them, the customer context, the Slack threads, the unwritten rule of “ask Rahul, he'll know.”",
      },
      {
        type: "p",
        text: "Replace the designer with an engineer. It gets worse.",
      },
      {
        type: "stays-leaves",
        stays: [
          "Figma files",
          "Repos & tickets",
          "Notion pages",
          "Git history",
        ],
        leaves: [
          "Why we chose this",
          "Customer context",
          "Slack folklore",
          "“Ask Rahul”",
        ],
      },
      {
        type: "pull",
        text: "A company slowly forgetting how it works.",
      },
      {
        type: "p",
        text: "I first framed this as an onboarding problem. But the framing kept feeling too small. The real question became: how does a startup keep its memory while moving fast?",
      },
      {
        type: "punch",
        text: "That's a founder problem. Not an HR problem.",
      },
    ],
  },
  {
    id: "wrong",
    label: "Everything I got wrong along the way",
    children: [
      {
        id: "documentation",
        label: "Documentation wasn't the problem",
        blocks: [
          {
            type: "lead",
            text: "I assumed startups just don't document enough. The findings said otherwise.",
          },
          {
            type: "chat",
            text: "I don't search Notion first. I Slack Rahul.",
          },
          {
            type: "p",
            text: "And it's rational — people trust colleagues over documents, because documents go stale.",
          },
          {
            type: "p",
            text: "The pattern repeated everywhere:",
          },
          {
            type: "bullets",
            items: [
              "Docs get written after something breaks",
              "Documentation projects start strong, then get quietly abandoned",
              "Nobody owns doc quality — shipping always wins",
            ],
          },
          {
            type: "punch",
            text: "So the knowledge wasn't missing. It lived in people. And people leave.",
          },
        ],
      },
      {
        id: "transitions",
        label: "Transitions expose the damage",
        blocks: [
          {
            type: "lead",
            text: "Knowledge loss is invisible until someone resigns.",
          },
          {
            type: "p",
            text: "Handovers cover tasks — projects, logins — but never reasoning: why things are the way they are, which customers are difficult, what breaks without this person.",
          },
          {
            type: "p",
            text: "Onboarding is the mirror image. New hires drown in documents with no sense of what matters, and hesitate to ask “basic” questions. Learning tools is fast; learning context takes months.",
          },
          {
            type: "insight",
            text: "Joining and leaving aren't two problems. They're the two moments when missing memory becomes painful.",
          },
        ],
      },
      {
        id: "retrieval",
        label: "Storage wasn't the challenge. Retrieval was.",
        blocks: [
          {
            type: "lead",
            text: "Information was scattered across Slack, Notion, Docs, GitHub, Linear, email.",
          },
          {
            type: "p",
            text: "People search two tools, give up, and interrupt a teammate — because interrupting is faster. Search returns documents, not answers. Teams remember what they decided but forget why, so old debates come back from the dead.",
          },
          {
            type: "insight",
            text: "Knowledge is embedded in conversations, not documentation — and retrieval, not storage, is the real challenge.",
          },
        ],
      },
    ],
  },
  {
    id: "landed",
    label: "Where it all landed",
    children: [
      {
        id: "capture",
        label: "What if nobody ever had to document anything?",
        blocks: [
          {
            type: "lead",
            text: "I stopped believing people would ever maintain docs — the incentives just don't work. So the question flipped:",
          },
          {
            type: "contrast",
            before: "How do we make people document more?",
            after: "What if they never had to?",
          },
          {
            type: "p",
            text: "Knowledge is already produced daily — in meetings, Slack, pull requests. The system should just catch it:",
          },
          {
            type: "pipeline",
            steps: [
              "Meeting",
              "Decision extracted",
              "Project updated",
              "Owner assigned",
              "Searchable forever",
            ],
          },
          {
            type: "p",
            text: "Then everything downstream changes: ask “how do refunds work?” and get an answer with sources. Ask “why did we remove that feature?” and see the reasoning. Need React help? See who actually built the payment system — a knowledge map, not an org chart.",
          },
        ],
      },
      {
        id: "blind-spot",
        label: "The founder's blind spot",
        blocks: [
          {
            type: "lead",
            text: "Founders don't fear missing docs. They fear dependency — only one person knowing how payroll works. And they can't see it until something breaks.",
          },
          {
            type: "p",
            text: "So: a knowledge-health view. Where knowledge concentrates, which areas hang on one person, whether the team is ready for the next hire.",
          },
          {
            type: "bus-factor",
            label: "Bus factor",
            value: "1",
            area: "Payroll",
            note: "Only one person can run it. Nobody notices until they're gone.",
          },
        ],
      },
      {
        id: "not-wiki",
        label: "Not another wiki",
        blocks: [
          {
            type: "lead",
            text: "Notion, Guru, Slite, Confluence store knowledge.",
          },
          {
            type: "p",
            text: "The failure happens elsewhere — capture is manual, retrieval returns files, and nothing special happens at the exact moments knowledge is lost.",
          },
          {
            type: "pull",
            text: "Knowledge continuity for startups with 10–50 employees — during onboarding, role changes, and exits. Not a wiki. A company's memory.",
          },
        ],
      },
      {
        id: "five-bets",
        label: "The five bets",
        blocks: [
          {
            type: "bets",
            items: [
              {
                bet: "Capture passively",
                line: "Knowledge as a by-product of work, never a task",
              },
              {
                bet: "Organize around context",
                line: "People, projects, decisions — not folders",
              },
              {
                bet: "Answers, not documents",
                line: "With sources attached — trust comes from evidence",
              },
              {
                bet: "Design for transitions",
                line: "Joining, changing roles, leaving",
              },
              {
                bet: "Make knowledge health visible",
                line: "See the risk before it breaks something",
              },
            ],
          },
          {
            type: "p",
            text: "Success isn't pages written. It's faster onboarding, fewer repeated questions, handovers that keep the reasoning.",
          },
          {
            type: "close",
            lines: [
              "Still open: the name, the first persona, and which workflow becomes the wedge.",
              "That's the next chapter.",
            ],
          },
        ],
      },
    ],
  },
];
