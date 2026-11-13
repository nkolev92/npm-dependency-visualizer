# npm/cli fixture

The two input files are copied without changes from npm/cli commit `8f92e740ee1547568779284005454ce2f1a5e58b`.
They are used as an offline, representative lockfile for the root npm package.

- Source: https://github.com/npm/cli/tree/8f92e740ee1547568779284005454ce2f1a5e58b
- License: Artistic-2.0; see `LICENSE` in this directory.

## Audited graph counts

The fixture's root declares 68 production dependencies and has 20 non-`node_modules` project records.
For the default view, npm's Arborist virtual tree has 123 reachable installed nodes, 254 reachable relationships, and one missing optional peer after excluding workspace links.
Arborist collapses the root's simultaneous production and development declarations of `diff` into one development edge, but the spec preserves its production edge.
Adding the `diff` instance and its production edge, and representing the missing optional peer as a node, gives 125 nodes and 255 relationships.
There are 12 reachable excluded link relationships.

With root development dependencies included, Arborist has 1,059 installed nodes, seven missing optional peers, and 2,040 relationships after excluding links.
The spec also preserves the two collapsed role pairs for root `diff` and `ajv-formats`'s `ajv`, giving 1,066 nodes and 2,042 relationships.
There are 16 reachable excluded link relationships in this mode.
