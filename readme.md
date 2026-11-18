# Pseudo

Infinitely-high-level, typescript-based, compiled programming language. See the agent orientation:

```bash
npx tsx -e "import('@gershy/pseudo').then(n => console.log(n.agentOrientation()))"
```

## The basic premise

Write software where any aspect of any complexity can be expressed either with "sharp" code, or delegated to an agent implementation via "fuzzy" plain language:

```ts
// Sharp logic:
for (const head of headValues)
  for (const tail of tailValues)
    if (comparison(head, tail))
      
      // Fuzzy logic:
      await fuzzy(`write a csv document into ${s3Bucket} contrasting ${head} and ${tail}, and email all subscribers a link to the resulting s3 object using ${headTailEmailTemplate}`);
```

## Why?

Agents have destabilized most aspects of software engineering. Pseudo restores the following aspects:
- High-level thinking appears in version control (instead of being lost in an agent conversation)