## Getting Started

First, run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## LinkedIn graduate/junior profile scraper

This repository includes a CLI to search and extract public LinkedIn profile data for beginner/fresh grad/junior profiles in CS/IT/Data Science fields using SerpAPI.

### Setup

1. Create a `.env` file in project root with your key:

```
SERPAPI_API_KEY=your_serpapi_key
```

2. Run the scraper (outputs JSON to stdout by default):

```
pnpm scrape:linkedin -- --limit 25 --out profiles.json
```

Optional flags:
- `--q`: custom search query. Default targets CS/IT/Data Science junior/fresh grad.
- `--limit`: number of profiles to return (default 20).
- `--out`: path to save JSON instead of printing.

The JSON includes: `name`, `headline`, `about` (description), `skills` (array), and `url`.

### Python version

Requirements: Python 3.9+, `requests`.

```
pip install requests
set SERPAPI_API_KEY=your_serpapi_key   # Windows PowerShell: $env:SERPAPI_API_KEY="your_key"
python scripts/linkedin_scraper.py --limit 25 --out profiles.json
```

AI enrichment (OpenAI) to extract/normalize skills:

```
pip install requests
set SERPAPI_API_KEY=your_serpapi_key
set OPENAI_API_KEY=your_openai_key   # Windows PowerShell: $env:OPENAI_API_KEY="your_key"
python scripts/linkedin_scraper.py --ai --openai-model gpt-4o-mini --limit 25 --out profiles.json
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!