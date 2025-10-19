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

## Peer Review Generation

This repository includes a script to generate realistic peer reviews using OpenAI's API for testing and development purposes.

### Setup

1. Create a `.env` file in project root with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_url
```

2. Run the peer review generator:

```bash
pnpm generate:peer-reviews
```

This will generate 25+ diverse peer reviews between the 4 students (Alice Chen, Bob Kumar, Carol Tan, David Lee) and save them to your database.

### Features

- **Realistic Content**: Uses OpenAI to generate contextually appropriate feedback
- **Structured Data**: Matches the peer review form fields exactly
- **Student Profiles**: Each student has unique traits and characteristics
- **Varied Ratings**: Generates realistic 3-5 star ratings
- **Database Integration**: Automatically saves to your Prisma database

The generated reviews include:
- Academic Performance Rating (1-5)
- Collaboration & Teamwork Rating (1-5) 
- Strengths and Positive Qualities (up to 1000 chars)
- Areas for Improvement (up to 1000 chars)
- Additional Comments (optional, up to 500 chars)

## Job Skills Classification

This repository includes a script to classify job skills using OpenAI's API for better data organization.

### Setup

1. Ensure your `.env` file has the OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key
```

2. Run the skill classification script (one-time setup):
```bash
pnpm classify:job-skills
```

This will process all job description files and create classified versions with pre-categorized hard and soft skills.

### Benefits

- **Faster Seeding**: No need to call OpenAI API during database seeding
- **Consistent Classification**: Skills are classified once and reused
- **Cost Effective**: Reduces API calls and costs
- **Reliable**: Fallback classification if OpenAI fails

### Workflow

1. **First time setup**: Run `pnpm classify:job-skills` to generate classified skill data
2. **Regular seeding**: Run `pnpm db:seed` to quickly populate database with pre-classified data
3. **Update skills**: Re-run classification script if you add new job description files

The classified files are saved as `*_classified.json` in the `prisma/data/` directory.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!