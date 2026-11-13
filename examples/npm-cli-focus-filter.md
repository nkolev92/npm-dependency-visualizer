# Dependency graph: npm

- Inputs: package.json, package-lock.json; lockfile version 3.
- Dependency selection: production, optional, and peer dependencies.
- Filters: focus glob; depth unlimited.
- Displayed: 27 nodes, 70 relationships.
- Omitted by filters: 122 nodes, 289 relationships.
- Excluded boundaries: 0 relationships; excluded non-node&#95;modules project records: 0.
- Workspaces: included; reached 12 of 16 workspace projects.
- Focus mode: filter; matching instances: 1.

## Warnings

- optional-not-recorded: node&#95;modules/proxy-agent-negotiate declares optional peer dependency kerberos (^2.0.0), but no eligible package is recorded.

## Legend

- Arrows point from the declaring package to its resolved dependency.
- Node versions are selected versions; edge labels show the dependency role, declared name, and original specification.
- `prod`, `dev`, `optional`, `peer`, and `optional peer` identify dependency roles.
- Unresolved and unrecorded optional dependencies have placeholder nodes.
- Workspace projects use double-bordered (subroutine) nodes labeled `(workspace)`.
- Focus (Sunset Boulevard): coral nodes with thick borders are matches; warm-sand nodes are ancestors; thick burnt-orange arrows trace the ancestor subgraph. Unrelated branches keep their normal style.
- The node index identifies matches and ancestors without relying on color.

## Dependency graph

```mermaid
flowchart LR
    n0["npm@12.2.2"]
    n13["@npmcli/map-workspaces@6.0.0"]
    n14["@npmcli/metavuln-calculator@10.0.0"]
    n17["@npmcli/package-json@8.0.0"]
    n21["@npmcli/run-script@11.0.0"]
    n25["@sigstore/sign@5.0.0"]
    n40["cacache@21.0.1"]
    n53["glob@13.0.6"]
    n59["init-package-json@9.0.0"]
    n69["make-fetch-happen@16.0.1"]
    n88["npm-packlist@11.3.0"]
    n92["npm-profile@13.0.1"]
    n93["npm-registry-fetch@20.0.1"]
    n96["pacote@22.0.1"]
    n112["sigstore@5.0.0"]
    n137[["@npmcli/arborist@10.0.4 (workspace)"]]
    n138[["@npmcli/config@11.2.0 (workspace)"]]
    n139[["libnpmaccess@11.0.0 (workspace)"]]
    n140[["libnpmdiff@9.0.4 (workspace)"]]
    n141[["libnpmexec@11.0.5 (workspace)"]]
    n142[["libnpmfund@8.0.4 (workspace)"]]
    n143[["libnpmorg@9.0.0 (workspace)"]]
    n144[["libnpmpack@10.0.4 (workspace)"]]
    n145[["libnpmpublish@12.0.1 (workspace)"]]
    n146[["libnpmsearch@10.0.0 (workspace)"]]
    n147[["libnpmteam@9.0.0 (workspace)"]]
    n148[["libnpmversion@9.0.0 (workspace)"]]
    n0 -->|"prod: @npmcli/map-workspaces @ ^6.0.0"| n13
    n0 -->|"prod: @npmcli/metavuln-calculator @ ^10.0.0"| n14
    n0 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n0 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n0 -->|"prod: cacache @ ^21.0.1"| n40
    n0 -->|"prod: glob @ ^13.0.6"| n53
    n0 -->|"prod: init-package-json @ ^9.0.0"| n59
    n0 -->|"prod: make-fetch-happen @ ^16.0.1"| n69
    n0 -->|"prod: npm-profile @ ^13.0.1"| n92
    n0 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n0 -->|"prod: pacote @ ^22.0.1"| n96
    n0 -->|"prod: @npmcli/arborist @ ^10.0.4"| n137
    n0 -->|"prod: @npmcli/config @ ^11.2.0"| n138
    n0 -->|"prod: libnpmaccess @ ^11.0.0"| n139
    n0 -->|"prod: libnpmdiff @ ^9.0.4"| n140
    n0 -->|"prod: libnpmexec @ ^11.0.5"| n141
    n0 -->|"prod: libnpmfund @ ^8.0.4"| n142
    n0 -->|"prod: libnpmorg @ ^9.0.0"| n143
    n0 -->|"prod: libnpmpack @ ^10.0.4"| n144
    n0 -->|"prod: libnpmpublish @ ^12.0.1"| n145
    n0 -->|"prod: libnpmsearch @ ^10.0.0"| n146
    n0 -->|"prod: libnpmteam @ ^9.0.0"| n147
    n0 -->|"prod: libnpmversion @ ^9.0.0"| n148
    n13 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n13 -->|"prod: glob @ ^13.0.0"| n53
    n14 -->|"prod: cacache @ ^21.0.1"| n40
    n14 -->|"prod: pacote @ ^22.0.0"| n96
    n17 -->|"prod: glob @ ^13.0.0"| n53
    n21 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n25 -->|"prod: make-fetch-happen @ ^16.0.0"| n69
    n40 -->|"prod: glob @ ^13.0.0"| n53
    n59 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n69 -->|"prod: cacache @ ^21.0.0"| n40
    n88 -->|"prod: glob @ ^13.0.6"| n53
    n92 -->|"prod: npm-registry-fetch @ ^20.0.0"| n93
    n93 -->|"prod: make-fetch-happen @ ^16.0.0"| n69
    n96 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n96 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n96 -->|"prod: cacache @ ^21.0.1"| n40
    n96 -->|"prod: npm-packlist @ ^11.2.0"| n88
    n96 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n96 -->|"prod: sigstore @ ^5.0.0"| n112
    n112 -->|"prod: @sigstore/sign @ ^5.0.0"| n25
    n137 -->|"prod: @npmcli/map-workspaces @ ^6.0.0"| n13
    n137 -->|"prod: @npmcli/metavuln-calculator @ ^10.0.0"| n14
    n137 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n137 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n137 -->|"prod: cacache @ ^21.0.1"| n40
    n137 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n137 -->|"prod: pacote @ ^22.0.0"| n96
    n138 -->|"prod: @npmcli/map-workspaces @ ^6.0.0"| n13
    n138 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n139 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n140 -->|"prod: pacote @ ^22.0.0"| n96
    n140 -->|"prod: @npmcli/arborist @ ^10.0.4"| n137
    n141 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n141 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n141 -->|"prod: pacote @ ^22.0.0"| n96
    n141 -->|"prod: @npmcli/arborist @ ^10.0.4"| n137
    n142 -->|"prod: @npmcli/arborist @ ^10.0.4"| n137
    n143 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n144 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n144 -->|"prod: pacote @ ^22.0.0"| n96
    n144 -->|"prod: @npmcli/arborist @ ^10.0.4"| n137
    n145 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n145 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n145 -->|"prod: sigstore @ ^5.0.0"| n112
    n146 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n147 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n148 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    classDef focusMatch fill:#f4a261,stroke:#264653,color:#264653,stroke-width:3px,font-family:DejaVu Sans
    classDef focusAncestor fill:#e9c46a,stroke:#264653,color:#264653,stroke-width:1.5px,font-family:DejaVu Sans
    class n0 focusAncestor
    class n13 focusAncestor
    class n14 focusAncestor
    class n17 focusAncestor
    class n21 focusAncestor
    class n25 focusAncestor
    class n40 focusAncestor
    class n53 focusMatch
    class n59 focusAncestor
    class n69 focusAncestor
    class n88 focusAncestor
    class n92 focusAncestor
    class n93 focusAncestor
    class n96 focusAncestor
    class n112 focusAncestor
    class n137 focusAncestor
    class n138 focusAncestor
    class n139 focusAncestor
    class n140 focusAncestor
    class n141 focusAncestor
    class n142 focusAncestor
    class n143 focusAncestor
    class n144 focusAncestor
    class n145 focusAncestor
    class n146 focusAncestor
    class n147 focusAncestor
    class n148 focusAncestor
    linkStyle 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69 stroke:#e76f51,stroke-width:3px
```

## Node index

| ID | Name | Selected version | Lockfile location | Focus |
| --- | --- | --- | --- | --- |
| n0 | npm | 12.2.2 | (root) | Ancestor |
| n13 | &#64;npmcli/map-workspaces | 6.0.0 | node&#95;modules/&#64;npmcli/map-workspaces | Ancestor |
| n14 | &#64;npmcli/metavuln-calculator | 10.0.0 | node&#95;modules/&#64;npmcli/metavuln-calculator | Ancestor |
| n17 | &#64;npmcli/package-json | 8.0.0 | node&#95;modules/&#64;npmcli/package-json | Ancestor |
| n21 | &#64;npmcli/run-script | 11.0.0 | node&#95;modules/&#64;npmcli/run-script | Ancestor |
| n25 | &#64;sigstore/sign | 5.0.0 | node&#95;modules/&#64;sigstore/sign | Ancestor |
| n40 | cacache | 21.0.1 | node&#95;modules/cacache | Ancestor |
| n53 | glob | 13.0.6 | node&#95;modules/glob | Match |
| n59 | init-package-json | 9.0.0 | node&#95;modules/init-package-json | Ancestor |
| n69 | make-fetch-happen | 16.0.1 | node&#95;modules/make-fetch-happen | Ancestor |
| n88 | npm-packlist | 11.3.0 | node&#95;modules/npm-packlist | Ancestor |
| n92 | npm-profile | 13.0.1 | node&#95;modules/npm-profile | Ancestor |
| n93 | npm-registry-fetch | 20.0.1 | node&#95;modules/npm-registry-fetch | Ancestor |
| n96 | pacote | 22.0.1 | node&#95;modules/pacote | Ancestor |
| n112 | sigstore | 5.0.0 | node&#95;modules/sigstore | Ancestor |
| n137 | &#64;npmcli/arborist (workspace) | 10.0.4 | workspaces/arborist | Ancestor |
| n138 | &#64;npmcli/config (workspace) | 11.2.0 | workspaces/config | Ancestor |
| n139 | libnpmaccess (workspace) | 11.0.0 | workspaces/libnpmaccess | Ancestor |
| n140 | libnpmdiff (workspace) | 9.0.4 | workspaces/libnpmdiff | Ancestor |
| n141 | libnpmexec (workspace) | 11.0.5 | workspaces/libnpmexec | Ancestor |
| n142 | libnpmfund (workspace) | 8.0.4 | workspaces/libnpmfund | Ancestor |
| n143 | libnpmorg (workspace) | 9.0.0 | workspaces/libnpmorg | Ancestor |
| n144 | libnpmpack (workspace) | 10.0.4 | workspaces/libnpmpack | Ancestor |
| n145 | libnpmpublish (workspace) | 12.0.1 | workspaces/libnpmpublish | Ancestor |
| n146 | libnpmsearch (workspace) | 10.0.0 | workspaces/libnpmsearch | Ancestor |
| n147 | libnpmteam (workspace) | 9.0.0 | workspaces/libnpmteam | Ancestor |
| n148 | libnpmversion (workspace) | 9.0.0 | workspaces/libnpmversion | Ancestor |
