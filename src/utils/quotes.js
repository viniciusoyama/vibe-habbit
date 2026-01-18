// Returns a nice and motivational quote.
const QUOTES = [
  {
    text: "The cap moved again. Probably a feature. Keep grinding.",
    author: "The Bug Fixer Programmer"
  },
  {
    text: "If there’s a limit, it’s undocumented. Ship the next level.",
    author: "The Bug Fixer Programmer"
  },
  {
    text: "Cap reached? Unlikely. Let me search that real quick.",
    author: "The Senior Dev Who Still Googles"
  },
  {
    text: "Uh… so… I think the cap keeps increasing? I didn’t mean to, but yeah, keep leveling.",
    author: "The Dev Who Fixed Production"
  },
  {
    text: "I touched one thing and now there’s no cap. Sorry. Or congrats.",
    author: "The Dev Who Fixed Production"
  },
  {
    text: "Reached the cap, you have not. Missing semicolon, there is.",
    author: "Yoda, but with Syntax Errors"
  }
]

export const getQuote = () => {
  const randomIndex = Math.floor(Math.random() * QUOTES.length)
  return QUOTES[randomIndex]
}
