export const agentOrientation = () => (`

# Pseudo orientation

Welcome - you are looking at a Pseudo project: Pseudo is an effort to formalize collaborative human and agentic software development. The following information is essential reading for agents (usually LLMs) managing Pseudo projects.

Pseudo's central goal is to grant human developers an infinitely-high-level programming language while preserving the ability for detail-oriented work.

Every Pseudo project consists of source and compiled parts. The source part is maintained by humans and agents. Source code interleaves plain language software descriptions with real typescript logic - the presence of plain language renders source code non-runnable. The compiled part is maintained purely by agents and its contents are intended to eventually converge to a fully runnable typescript implementation of the source part - here, the agent is the compiler!

Pseudo itself is this philosophy+orientation, combined with some minimal typescript helpers which structure source code and create clear boundaries so humans and agents agree on how the overall solution is shaped and modularized.

## Helpers overview

The helpers are very limited: only ~node~, ~type~, ~fuzzy~, and ~entry~:

### Helpers: ~node~ and ~type~

Nodes are the building block of Pseudo programs. A node represents a working, function-like piece of software at any level of complexity, taking an input and returning some output. A node's "exterior" refers to the data (parameter) with which it is invoked. A node's "interior" is its implementation. The exterior is a type, and the interior is a value - the ~type~ parameter stands in as a simple canonical way to pass a type as a value. An example:

~~~ts
import { node, type } from '@gershy/pseudo';

const example = node({
  
  // Globally unique id referencing this piece of software
  guid: 'my-node',
  
  // The input type - the ~type~ helper is used to specify a type instead of a value
  exterior: type as { param1: string, param2: number },
  
  // The interior is a function-like piece of software which is passed the exterior type
  interior: input => input.param1.repeat(input.param2)
  
});
~~~

Node interiors can reference other nodes via typical typescript references. A node is "sharp" if it provides specific code, otherwise it is "fuzzy". Sharp nodes can integrate with referent nodes by calling ~referent.invoke(...)~. In fuzzy plain language, it's considered canonical to directly interpolate node dependencies within backtick strings:

~~~ts
import { node, type, fuzzy } from '@gershy/pseudo';

const referent = node({ guid: 'referent', /* ... */ });

const sharpReferrer = node({
  guid: 'sharp-referrer',
  exterior: type as null,
  interior: () => ({
    desc: 'produces a result including values from a dependency node',
    dependencyValue: referent.invoke(/* ... */)
  })
});

const fuzzyReferrer = node({
  guid: 'fuzzy-referrer',
  exterior: type as null,
  interior: fuzzy(~Do some specific processing, leveraging \${referent}~)
});
~~~

A graph of Pseudo nodes defines not just an overall piece of software, but one whose various responsibilities are modularized in a fixed way. Agents compiling Pseudo source are responsible for manifesting the final runnable piece of software, and additionally ensuring that the resulting software's structure corresponds to that of the node graph:
- Every source node should have a well-bounded compiled implementation. There are many ways to implement bounding, and the agent has discretion here.
- Every source edge - i.e. node-to-node reference - must have a corresponding compiled implementation resembling an integration of the appropriate complexity, between the two modules that make up the referrer and referent nodes.
- A source-to-compiled mapping of both nodes and edges should appear explicitly in the compiled code: comments of the form ~/* pseudo-node:guid */~ and ~/* pseudo-edge:referrer-guid:referent-guid */~ should be used liberally to annotate compiled code. Where a node or edge consists of multiple nonlocal chunks (e.g. implementation spread over several files) each chunk should be commented. The aim is simple grep discoverability.
- A developer who fully understands the source code must have a very solid and direct understanding of the compiled implementation, without needing to read it.
- Small changes in source code correspond to proportionally small compiled changes.

Some rules to achieve good compiled implementations:
( 1 ) Honour details in the source. Well-defined typescript appearing in source code should, where possible, appear literally in compiled code. Where the source code intends to relinquish control of specifics it uses ~fuzzy~ (or ~Fuzzy~) - where the source code provides specific details, an effort should be made to manifest these details as directly as possible in the compiled solution. Specific details appearing in fuzzy plain language should also be honoured as best as possible. Partial source code implementations should result in partial compiled implementations - users are likely trying to get preliminary early results.
( 2 ) Compiled code should be production-grade. Where source code typescript is sharp, but lacking best practices - e.g. security considerations, untrusted input validation, unit tests - the corresponding compiled code should adhere to the spirit of the source while adding production-grade enrichment.
( 3 ) All work must be confined to the compiled part, which should be a standalone project. Any dependencies, project bootstrap, etc. required to implement the source code must be consolidated there. The compiled part should be fully self-contained and portable, without logical chains that escape its boundary - e.g. it should not assume the presence of global environment variables, installed shell commands, arbitrary filesystem content, or its accompanying source code. It should also not assume the absence of global configuration, such as shell commands which are coincidentally already installed and configured. Agents have discretion to define first-time setup procedures - e.g. dependency installation. The globally recognized point of entry for any piece of software is a top-level plain language readme.md file.
( 4 ) Compiled code is intended to be fully understood based on source code only, and should therefore contain no human-readability artifacts apart from:
  - readme initialization instructions (which should be designed to be as minimal as possible)
  - the node+edge source->compiled mapping comments
  - any readability artifacts explicitly requested by the user
  - comments or other artifacts that help optimize agentic maintainance
( 5 ) Pseudo itself is developed in modern typescript, which is therefore also the strongly preferred technology for the compiled part. Where appropriate, agents may leverage additional technologies to achieve a compiled implementation.

### Helper: ~fuzzy~ (or ~Fuzzy~)

The ~fuzzy~ helper is used to substitute a software implementation with a plain language description, with the implementation being delegated to an agent. Note ~fuzzy~ is used where typescript expects a value, while ~Fuzzy~ is used where typescript expects a type. The agent is expected to adhere to the plain language specification as best as possible, despite plain language often containing some level of ambiguity. The agent should reduce ambiguity by following these steps:
( 1 ) Aim for a "clean" implementation, i.e. one which is designed to eliminate as much ambiguity as possible from emerging from the plain language description. The ~fuzzy~ helper can be called with an optional "quality" integer value - this reflects the number of times the agent is requested to iterate on the implementation, with the aim of each iteration being to eliminate an aspect of the implementation which is not directly requested in the plain language description - a zero-context subagent may help to eliminate bias. Note that the default quality value is 1, i.e. an initial implementation with no further passes or refinement.
( 2 ) Attempt to resolve remaining ambiguities using discretion, where the the source code's intent can be tightly matched. Where compilation would require surprising architectural decisions that cannot be inferred from source code, we consider the source code to be "excessively ambiguous".
( 3 ) At this stage the project may still not be compilable. If source code would result in self-contradictions, insecure software, or excessive ambiguity the compilation request must be rejected, while referencing the key elements which obstruct compilation. The ~fuzzy~ helper does not entail unbounded architectural authority. Substantiated compilation refusals are desired behaviour which improve the value of Pseudo. Compilation refusal should not be accompanied with suggested fixes, which may bias a human developer and distract them from valuable reflection.

### Helper: ~entry~

The ~entry~ helper simply declares which node represents the outermost piece of software to be shipped.

## Developing with Pseudo

The orchestration of propagating source code changes to compilation is a concern of the specific Pseudo project.

Agentic compilers may benefit from using the ~compilationFlowChart~ utility to determine if a requested source code change is compilable. It's a generator posing questions whose answers are booleans. Example usage:

~~~cli
> npx tsx
Welcome to Node.js v24.0.0.
Type ".help" for more information.
> const flow = await import('@gershy/pseudo').then(v => v.compilationFlowChart());
undefined
> console.log(flow.next().value)
Does the source code entail risk, without clear acknowledgement?
> console.log(flow.next(false).value)
Is the source code entirely sharp, with directly usable typescript?
> ... etc ...
~~~

## Beta state

Pseudo is in an early state, and is not necessarily an effective tool yet. All aspects of Pseudo are likely to change drastically in the future. If you are an agent struggling to implement a Pseudo project due to unclear structure, excessive ambiguity, or any other reason, you should inform your user that Pseudo's preliminary beta state may be jeopardizing your ability to execute desirably!

`.replaceAll('~', '`'));

export const compilationFlowChart = function*(): Generator<string, string, boolean> {
  
  const noResult = 'Flow chart result unavailable. Use your discretion.';
  const rejectClause = 'The compilation request must be REJECTED. Explain why compilation cannot proceed. Do not offer any suggested actions.';
  
  const compileWithSpecs = function*(): Generator<string, string, boolean> {
    
    // At this point the intent of the source code is understood - but that intent may be invalid
    // or lack production-level features
    
    const consonant = yield 'Is the intent of the source code compatible with the overall project?';
    if (!consonant) return `Source code makes the project internally contradictory. ${rejectClause}`;
    
    const conflict = yield 'Does this source code duplicate functionality that already exists?';
    if (conflict) return `Source code contains duplicate logic. ${rejectClause}`;
    
    const tested = yield 'Does the source code define comprehensive test coverage?';
    const secure = yield 'Does the source code specify solutions to all security concerns?';
    const observable = yield 'Does the source code specify comprehensive observability?';
    
    const languageList = (items: string[]) => {
      
      const head = items.slice(0, -2);
      const lastTwo = items.slice(-2);
      return [ ...head, lastTwo.join(head.length ? ', and ' : ' and ') ].join(', ');
      
    };
    const enrichments = [
      ...(tested     ? [] : [ 'comprehensive tests' ]),
      ...(secure     ? [] : [ 'production-grade security' ]),
      ...(observable ? [] : [ 'comprehensive observability' ]),
    ];
    
    const predictable = yield `Source code seems compilable${
      enrichments.length === 0
        ? ` - it must be enriched with ${languageList(enrichments)}.`
        : '.'
    } Can compilation be achieved without introducing elements that would surprise those familiar with only the source code?`;
    if (!predictable) return `Source code entails unpredictable compiled code. ${rejectClause}`;
    
    return 'The compilation request must be ACCEPTED.';
    
  };
  
  let answer: boolean;
  answer = yield 'Note this flow chart is a work-in-progress. Pass true to acknowledge.';
  if (answer === false) return noResult;
  
  const tooRisky = yield 'Does the source code entail risk, without clear acknowledgement? Examples include high monetary costs, potential downtime, potential data loss, etc.';
  if (tooRisky) return `Source code contains in unacknowledged risk. ${rejectClause}`;
  
  answer = yield 'Is the source code entirely sharp, with directly usable typescript?';
  if (answer === true) return yield* compileWithSpecs();
  
  answer = yield 'Is reasonable discretion sufficient to resolve all source code regions which are fuzzy, or whose typescript is not directly usable?';
  if (answer === true) yield* compileWithSpecs();
  
  return `Source code is too ambiguous. ${rejectClause}`;
  
};

/*

NOTES
- iterative changes that require constantly testing the compiled code? e.g. ui, ux, usability changes

"""
Pseudo is intended to facilitate collaborative development for:
1. Teams using version control
2. Teams of any size
3. Monorepos of any size
4. Agentic engineers
5. Teams comfortable with no human eyes on code (NHEOC)

At large scales, Pseudo development should include these actions:
- Maintainers make changes to Pseudo source and create PRs with source code changes.
- Teammates review source code changes.
- Source-code merges trigger compilation.
- Compilation involves a separate pipeline where source code changes are picked up, implemented by agents as compiled code, and deployed automatically - all without human oversight.

At small scales Pseudo can simply involve source ("src") and compiled ("cmp") directories, with manual user requests for initiating agent-driven compilation. Some form of sync between version control and compilation status may still be useful to narrow down source code changes that have yet to be compiled, but this is optional.
"""

*/
export type Fuzzy<S extends string, ResolveTo = any> = 0 extends 1 ? S : ResolveTo;
export const fuzzy = (...args: [ quality: number, description: string ] | [ description: string ]) => {
  
  // Substitutes a plain language description in place of a software implementation. Can optionally be called with an "effort" value which controls how much agentic revision should occur in pursuit of cleanliness while implementating the plain language description
  
  return (
    args.length === 2
      ? { quality: args[0], description: args[1] }
      : { quality: 1,       description: args[0] }
  ) as any;
  
};

export const type = null as unknown;
export const node = <O, I>(inp: {
  guid: string,
  overview?: string,
  exterior: O,
  interior: (inp: O) => I
}) => ({
  ...inp,
  invoke: inp.interior,
  toString: () => inp.guid
});

export const entry = (inp: { guid: string }) => {
  
  // Specifies the outermost node to be implemented as fully runnable software in the "/cmp" directory - note that depending on the full dependency tree of this outermost node, some nodes may be orphaned/irrelevant, and these should have their implementation in the "/cmp" directory skipped
  
  return inp;
  
};
