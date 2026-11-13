# Dependency graph: npm

- Inputs: package.json, package-lock.json; lockfile version 3.
- Dependency selection: production, optional, and peer dependencies.
- Filters: focus none; depth unlimited.
- Displayed: 149 nodes, 359 relationships.
- Omitted by filters: 0 nodes, 0 relationships.
- Excluded boundaries: 0 relationships; excluded non-node&#95;modules project records: 0.
- Workspaces: included; reached 12 of 16 workspace projects.

## Warnings

- optional-not-recorded: node&#95;modules/proxy-agent-negotiate declares optional peer dependency kerberos (^2.0.0), but no eligible package is recorded.

## Legend

- Arrows point from the declaring package to its resolved dependency.
- Node versions are selected versions; edge labels show the dependency role, declared name, and original specification.
- `prod`, `dev`, `optional`, `peer`, and `optional peer` identify dependency roles.
- Unresolved and unrecorded optional dependencies have placeholder nodes.
- Workspace projects use double-bordered (subroutine) nodes labeled `(workspace)`.

## Dependency graph

```mermaid
flowchart LR
    n0["npm@12.2.2"]
    n1["@gar/promise-retry@1.0.3"]
    n2["@isaacs/fs-minipass@4.0.1"]
    n3["@isaacs/string-locale-compare@1.1.0"]
    n4["@npmcli/agent@5.0.2"]
    n5["agent-base@9.0.0 #91;node_modules/@npmcli/agent/node_modules/agent-base#93;"]
    n6["http-proxy-agent@9.1.0"]
    n7["https-proxy-agent@9.1.0"]
    n8["@npmcli/fs@6.0.0"]
    n9["@npmcli/git@8.0.0"]
    n10["@npmcli/installed-package-contents@5.0.0"]
    n11["npm-bundled@6.0.0"]
    n12["npm-normalize-package-bin@6.0.0 #91;node_modules/@npmcli/installed-package-contents/node_modules/npm-normalize-package-bin#93;"]
    n13["@npmcli/map-workspaces@6.0.0"]
    n14["@npmcli/metavuln-calculator@10.0.0"]
    n15["@npmcli/name-from-folder@5.0.0"]
    n16["@npmcli/node-gyp@6.0.0"]
    n17["@npmcli/package-json@8.0.0"]
    n18["@npmcli/promise-spawn@10.0.1"]
    n19["@npmcli/query@5.0.0"]
    n20["@npmcli/redact@5.0.0"]
    n21["@npmcli/run-script@11.0.0"]
    n22["@sigstore/bundle@5.0.0"]
    n23["@sigstore/core@4.0.1"]
    n24["@sigstore/protobuf-specs@0.5.1"]
    n25["@sigstore/sign@5.0.0"]
    n26["@sigstore/tuf@5.0.0"]
    n27["@sigstore/verify@4.1.0"]
    n28["@tufjs/canonical-json@2.0.0"]
    n29["@tufjs/models@5.0.0"]
    n30["abbrev@5.0.0"]
    n31["aproba@2.1.0"]
    n32["archy@1.0.0"]
    n33["balanced-match@4.0.4"]
    n34["bin-links@7.0.1"]
    n35["cmd-shim@9.0.2"]
    n36["npm-normalize-package-bin@6.0.0 #91;node_modules/bin-links/node_modules/npm-normalize-package-bin#93;"]
    n37["read-cmd-shim@7.0.1"]
    n38["binary-extensions@3.1.0"]
    n39["brace-expansion@5.0.12"]
    n40["cacache@21.0.1"]
    n41["chalk@5.6.2"]
    n42["chownr@3.0.0"]
    n43["ci-info@4.4.0"]
    n44["cidr-regex@6.0.0"]
    n45["common-ancestor-path@2.0.0"]
    n46["cssesc@3.0.0"]
    n47["debug@4.4.3"]
    n48["diff@8.0.4"]
    n49["env-paths@2.2.1"]
    n50["exponential-backoff@3.1.3"]
    n51["fastest-levenshtein@1.0.16"]
    n52["fs-minipass@3.0.3"]
    n53["glob@13.0.6"]
    n54["graceful-fs@4.2.11"]
    n55["hosted-git-info@10.1.1"]
    n56["http-cache-semantics@4.3.0"]
    n57["iconv-lite@0.7.3"]
    n58["ini@7.0.0"]
    n59["init-package-json@9.0.0"]
    n60["ip-address@10.7.5"]
    n61["is-cidr@7.0.0"]
    n62["isexe@4.0.0"]
    n63["json-parse-even-better-errors@6.0.0"]
    n64["json-stringify-nice@1.1.4"]
    n65["jsonparse@1.3.1"]
    n66["just-diff@6.0.2"]
    n67["just-diff-apply@5.5.0"]
    n68["lru-cache@11.5.2"]
    n69["make-fetch-happen@16.0.1"]
    n70["minimatch@10.2.5"]
    n71["minipass@7.1.3"]
    n72["minipass-collect@2.0.1"]
    n73["minipass-fetch@6.0.0"]
    n74["minipass-flush@1.0.6"]
    n75["minipass-pipeline@1.2.4"]
    n76["minipass@3.3.6"]
    n77["yallist@4.0.0"]
    n78["minipass-sized@2.0.0"]
    n79["minizlib@3.1.0"]
    n80["ms@2.1.3"]
    n81["mute-stream@4.0.0"]
    n82["negotiator@1.0.0"]
    n83["node-gyp@13.0.0"]
    n84["nopt@10.0.1"]
    n85["npm-audit-report@8.0.0"]
    n86["npm-install-checks@9.0.0"]
    n87["npm-package-arg@14.0.0"]
    n88["npm-packlist@11.3.0"]
    n89["ignore-walk@9.0.0"]
    n90["npm-pick-manifest@12.0.0"]
    n91["npm-normalize-package-bin@6.0.0 #91;node_modules/npm-pick-manifest/node_modules/npm-normalize-package-bin#93;"]
    n92["npm-profile@13.0.1"]
    n93["npm-registry-fetch@20.0.1"]
    n94["npm-user-validate@5.0.0"]
    n95["p-map@7.0.5"]
    n96["pacote@22.0.1"]
    n97["parse-conflict-json@6.0.0"]
    n98["path-scurry@2.0.2"]
    n99["postcss-selector-parser@7.1.6"]
    n100["proc-log@7.0.0"]
    n101["proggy@4.0.0"]
    n102["promise-all-reject-late@1.0.1"]
    n103["promise-call-limit@3.0.2"]
    n104["promzard@4.0.0"]
    n105["proxy-agent-negotiate@1.1.0"]
    n106["kerberos (not recorded (optional))"]
    n107["qrcode-terminal@0.12.0"]
    n108["read@6.0.0"]
    n109["safer-buffer@2.1.2"]
    n110["semver@7.8.6"]
    n111["signal-exit@4.1.0"]
    n112["sigstore@5.0.0"]
    n113["smart-buffer@4.2.0"]
    n114["socks@2.8.9"]
    n115["socks-proxy-agent@10.1.0"]
    n116["agent-base@9.0.0 #91;node_modules/socks-proxy-agent/node_modules/agent-base#93;"]
    n117["spdx-exceptions@2.5.0"]
    n118["spdx-expression-parse@4.0.0"]
    n119["spdx-license-ids@3.0.23"]
    n120["ssri@14.0.0"]
    n121["supports-color@10.2.2"]
    n122["tar@7.5.22"]
    n123["text-table@0.2.0"]
    n124["tiny-relative-date@2.0.2"]
    n125["tinyglobby@0.2.17"]
    n126["fdir@6.5.0"]
    n127["picomatch@4.0.5"]
    n128["treeverse@3.0.0"]
    n129["tuf-js@6.0.0"]
    n130["undici@6.29.1"]
    n131["util-deprecate@1.0.2"]
    n132["validate-npm-package-name@8.0.0"]
    n133["walk-up-path@4.0.0"]
    n134["which@7.0.0"]
    n135["write-file-atomic@8.0.0"]
    n136["yallist@5.0.0"]
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
    n0 -->|"prod: @isaacs/string-locale-compare @ ^1.1.0"| n3
    n0 -->|"prod: @npmcli/fs @ ^6.0.0"| n8
    n0 -->|"prod: @npmcli/git @ ^8.0.0"| n9
    n0 -->|"prod: @npmcli/map-workspaces @ ^6.0.0"| n13
    n0 -->|"prod: @npmcli/metavuln-calculator @ ^10.0.0"| n14
    n0 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n0 -->|"prod: @npmcli/promise-spawn @ ^10.0.1"| n18
    n0 -->|"prod: @npmcli/redact @ ^5.0.0"| n20
    n0 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n0 -->|"prod: @sigstore/tuf @ ^5.0.0"| n26
    n0 -->|"prod: abbrev @ ^5.0.0"| n30
    n0 -->|"prod: archy @ ~1.0.0"| n32
    n0 -->|"prod: bin-links @ ^7.0.1"| n34
    n0 -->|"prod: cacache @ ^21.0.1"| n40
    n0 -->|"prod: chalk @ ^5.6.2"| n41
    n0 -->|"prod: ci-info @ ^4.4.0"| n43
    n0 -->|"prod: diff @ ^8.0.2"| n48
    n0 -->|"prod: fastest-levenshtein @ ^1.0.16"| n51
    n0 -->|"prod: fs-minipass @ ^3.0.3"| n52
    n0 -->|"prod: glob @ ^13.0.6"| n53
    n0 -->|"prod: graceful-fs @ ^4.2.11"| n54
    n0 -->|"prod: hosted-git-info @ ^10.1.1"| n55
    n0 -->|"prod: ini @ ^7.0.0"| n58
    n0 -->|"prod: init-package-json @ ^9.0.0"| n59
    n0 -->|"prod: is-cidr @ ^7.0.0"| n61
    n0 -->|"prod: json-parse-even-better-errors @ ^6.0.0"| n63
    n0 -->|"prod: make-fetch-happen @ ^16.0.1"| n69
    n0 -->|"prod: minimatch @ ^10.2.5"| n70
    n0 -->|"prod: minipass @ ^7.1.3"| n71
    n0 -->|"prod: minipass-pipeline @ ^1.2.4"| n75
    n0 -->|"prod: ms @ ^2.1.2"| n80
    n0 -->|"prod: node-gyp @ ^13.0.0"| n83
    n0 -->|"prod: nopt @ ^10.0.1"| n84
    n0 -->|"prod: npm-audit-report @ ^8.0.0"| n85
    n0 -->|"prod: npm-install-checks @ ^9.0.0"| n86
    n0 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n0 -->|"prod: npm-pick-manifest @ ^12.0.0"| n90
    n0 -->|"prod: npm-profile @ ^13.0.1"| n92
    n0 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n0 -->|"prod: npm-user-validate @ ^5.0.0"| n94
    n0 -->|"prod: p-map @ ^7.0.4"| n95
    n0 -->|"prod: pacote @ ^22.0.1"| n96
    n0 -->|"prod: parse-conflict-json @ ^6.0.0"| n97
    n0 -->|"prod: proc-log @ ^7.0.0"| n100
    n0 -->|"prod: qrcode-terminal @ ^0.12.0"| n107
    n0 -->|"prod: read @ ^6.0.0"| n108
    n0 -->|"prod: semver @ ^7.8.6"| n110
    n0 -->|"prod: spdx-expression-parse @ ^4.0.0"| n118
    n0 -->|"prod: ssri @ ^14.0.0"| n120
    n0 -->|"prod: supports-color @ ^10.2.2"| n121
    n0 -->|"prod: tar @ ^7.5.22"| n122
    n0 -->|"prod: text-table @ ~0.2.0"| n123
    n0 -->|"prod: tiny-relative-date @ ^2.0.2"| n124
    n0 -->|"prod: treeverse @ ^3.0.0"| n128
    n0 -->|"prod: validate-npm-package-name @ ^8.0.0"| n132
    n0 -->|"prod: which @ ^7.0.0"| n134
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
    n2 -->|"prod: minipass @ ^7.0.4"| n71
    n4 -->|"prod: agent-base @ ^9.0.0"| n5
    n4 -->|"prod: http-proxy-agent @ ^9.0.0"| n6
    n4 -->|"prod: https-proxy-agent @ ^9.0.0"| n7
    n4 -->|"prod: lru-cache @ ^11.2.1"| n68
    n4 -->|"prod: socks-proxy-agent @ ^10.0.0"| n115
    n6 -->|"prod: agent-base @ 9.0.0"| n5
    n6 -->|"prod: debug @ ^4.3.4"| n47
    n6 -->|"prod: proxy-agent-negotiate @ 1.1.0"| n105
    n7 -->|"prod: agent-base @ 9.0.0"| n5
    n7 -->|"prod: debug @ ^4.3.4"| n47
    n7 -->|"prod: proxy-agent-negotiate @ 1.1.0"| n105
    n8 -->|"prod: semver @ ^7.3.5"| n110
    n9 -->|"prod: @gar/promise-retry @ ^1.0.0"| n1
    n9 -->|"prod: @npmcli/promise-spawn @ ^10.0.0"| n18
    n9 -->|"prod: ini @ ^7.0.0"| n58
    n9 -->|"prod: lru-cache @ ^11.2.1"| n68
    n9 -->|"prod: npm-pick-manifest @ ^12.0.0"| n90
    n9 -->|"prod: proc-log @ ^7.0.0"| n100
    n9 -->|"prod: semver @ ^7.3.5"| n110
    n9 -->|"prod: which @ ^7.0.0"| n134
    n10 -->|"prod: npm-bundled @ ^6.0.0"| n11
    n10 -->|"prod: npm-normalize-package-bin @ ^6.0.0"| n12
    n11 -->|"prod: npm-normalize-package-bin @ ^6.0.0"| n12
    n13 -->|"prod: @npmcli/name-from-folder @ ^5.0.0"| n15
    n13 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n13 -->|"prod: glob @ ^13.0.0"| n53
    n13 -->|"prod: minimatch @ ^10.0.3"| n70
    n14 -->|"prod: cacache @ ^21.0.1"| n40
    n14 -->|"prod: json-parse-even-better-errors @ ^6.0.0"| n63
    n14 -->|"prod: pacote @ ^22.0.0"| n96
    n14 -->|"prod: proc-log @ ^7.0.0"| n100
    n14 -->|"prod: semver @ ^7.3.5"| n110
    n17 -->|"prod: @npmcli/git @ ^8.0.0"| n9
    n17 -->|"prod: glob @ ^13.0.0"| n53
    n17 -->|"prod: hosted-git-info @ ^10.1.1"| n55
    n17 -->|"prod: json-parse-even-better-errors @ ^6.0.0"| n63
    n17 -->|"prod: proc-log @ ^7.0.0"| n100
    n17 -->|"prod: semver @ ^7.5.3"| n110
    n17 -->|"prod: spdx-expression-parse @ ^4.0.0"| n118
    n18 -->|"prod: which @ ^7.0.0"| n134
    n19 -->|"prod: postcss-selector-parser @ ^7.0.0"| n99
    n21 -->|"prod: @npmcli/node-gyp @ ^6.0.0"| n16
    n21 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n21 -->|"prod: @npmcli/promise-spawn @ ^10.0.0"| n18
    n21 -->|"prod: node-gyp @ ^13.0.0"| n83
    n21 -->|"prod: proc-log @ ^7.0.0"| n100
    n22 -->|"prod: @sigstore/protobuf-specs @ ^0.5.0"| n24
    n25 -->|"prod: @gar/promise-retry @ ^1.0.2"| n1
    n25 -->|"prod: @sigstore/bundle @ ^5.0.0"| n22
    n25 -->|"prod: @sigstore/core @ ^4.0.0"| n23
    n25 -->|"prod: @sigstore/protobuf-specs @ ^0.5.0"| n24
    n25 -->|"prod: make-fetch-happen @ ^16.0.0"| n69
    n25 -->|"prod: proc-log @ ^7.0.0"| n100
    n26 -->|"prod: @sigstore/protobuf-specs @ ^0.5.0"| n24
    n26 -->|"prod: tuf-js @ ^6.0.0"| n129
    n27 -->|"prod: @sigstore/bundle @ ^5.0.0"| n22
    n27 -->|"prod: @sigstore/core @ ^4.0.1"| n23
    n27 -->|"prod: @sigstore/protobuf-specs @ ^0.5.0"| n24
    n29 -->|"prod: @tufjs/canonical-json @ 2.0.0"| n28
    n29 -->|"prod: minimatch @ ^10.2.1"| n70
    n34 -->|"prod: cmd-shim @ ^9.0.0"| n35
    n34 -->|"prod: npm-normalize-package-bin @ ^6.0.0"| n36
    n34 -->|"prod: read-cmd-shim @ ^7.0.0"| n37
    n34 -->|"prod: proc-log @ ^7.0.0"| n100
    n34 -->|"prod: write-file-atomic @ ^8.0.0"| n135
    n39 -->|"prod: balanced-match @ ^4.0.2"| n33
    n40 -->|"prod: @npmcli/fs @ ^6.0.0"| n8
    n40 -->|"prod: fs-minipass @ ^3.0.0"| n52
    n40 -->|"prod: glob @ ^13.0.0"| n53
    n40 -->|"prod: lru-cache @ ^11.1.0"| n68
    n40 -->|"prod: minipass @ ^7.0.3"| n71
    n40 -->|"prod: minipass-collect @ ^2.0.1"| n72
    n40 -->|"prod: minipass-flush @ ^1.0.5"| n74
    n40 -->|"prod: minipass-pipeline @ ^1.2.4"| n75
    n40 -->|"prod: p-map @ ^7.0.2"| n95
    n40 -->|"prod: ssri @ ^14.0.0"| n120
    n47 -->|"prod: ms @ ^2.1.3"| n80
    n52 -->|"prod: minipass @ ^7.0.3"| n71
    n53 -->|"prod: minimatch @ ^10.2.2"| n70
    n53 -->|"prod: minipass @ ^7.1.3"| n71
    n53 -->|"prod: path-scurry @ ^2.0.2"| n98
    n55 -->|"prod: lru-cache @ ^11.1.0"| n68
    n57 -->|"prod: safer-buffer @ #62;= 2.1.2 #60; 3.0.0"| n109
    n59 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n59 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n59 -->|"prod: promzard @ ^4.0.0"| n104
    n59 -->|"prod: read @ ^6.0.0"| n108
    n59 -->|"prod: semver @ ^7.7.2"| n110
    n59 -->|"prod: validate-npm-package-name @ ^8.0.0"| n132
    n61 -->|"prod: cidr-regex @ ^6.0.0"| n44
    n69 -->|"prod: @gar/promise-retry @ ^1.0.0"| n1
    n69 -->|"prod: @npmcli/agent @ ^5.0.0"| n4
    n69 -->|"prod: @npmcli/redact @ ^5.0.0"| n20
    n69 -->|"prod: cacache @ ^21.0.0"| n40
    n69 -->|"prod: http-cache-semantics @ ^4.1.1"| n56
    n69 -->|"prod: minipass @ ^7.0.2"| n71
    n69 -->|"prod: minipass-fetch @ ^6.0.0"| n73
    n69 -->|"prod: minipass-flush @ ^1.0.5"| n74
    n69 -->|"prod: minipass-pipeline @ ^1.2.4"| n75
    n69 -->|"prod: negotiator @ ^1.0.0"| n82
    n69 -->|"prod: proc-log @ ^7.0.0"| n100
    n69 -->|"prod: ssri @ ^14.0.0"| n120
    n70 -->|"prod: brace-expansion @ ^5.0.5"| n39
    n72 -->|"prod: minipass @ ^7.0.3"| n71
    n73 -->|"optional: iconv-lite @ ^0.7.2"| n57
    n73 -->|"prod: minipass @ ^7.0.3"| n71
    n73 -->|"prod: minipass-sized @ ^2.0.0"| n78
    n73 -->|"prod: minizlib @ ^3.0.1"| n79
    n74 -->|"prod: minipass @ ^7.1.3"| n71
    n75 -->|"prod: minipass @ ^3.0.0"| n76
    n76 -->|"prod: yallist @ ^4.0.0"| n77
    n78 -->|"prod: minipass @ ^7.1.2"| n71
    n79 -->|"prod: minipass @ ^7.1.2"| n71
    n83 -->|"prod: env-paths @ ^2.2.0"| n49
    n83 -->|"prod: exponential-backoff @ ^3.1.1"| n50
    n83 -->|"prod: graceful-fs @ ^4.2.6"| n54
    n83 -->|"prod: nopt @ ^10.0.0"| n84
    n83 -->|"prod: proc-log @ ^7.0.0"| n100
    n83 -->|"prod: semver @ ^7.3.5"| n110
    n83 -->|"prod: tar @ ^7.5.4"| n122
    n83 -->|"prod: tinyglobby @ ^0.2.12"| n125
    n83 -->|"prod: undici @ ^6.25.0"| n130
    n83 -->|"prod: which @ ^7.0.0"| n134
    n84 -->|"prod: abbrev @ ^5.0.0"| n30
    n86 -->|"prod: semver @ ^7.1.1"| n110
    n87 -->|"prod: hosted-git-info @ ^10.1.0"| n55
    n87 -->|"prod: proc-log @ ^7.0.0"| n100
    n87 -->|"prod: semver @ ^7.3.5"| n110
    n87 -->|"prod: validate-npm-package-name @ ^8.0.0"| n132
    n88 -->|"prod: glob @ ^13.0.6"| n53
    n88 -->|"prod: ignore-walk @ ^9.0.0"| n89
    n88 -->|"prod: proc-log @ ^7.0.0"| n100
    n89 -->|"prod: minimatch @ ^10.0.3"| n70
    n90 -->|"prod: npm-install-checks @ ^9.0.0"| n86
    n90 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n90 -->|"prod: npm-normalize-package-bin @ ^6.0.0"| n91
    n90 -->|"prod: semver @ ^7.3.5"| n110
    n92 -->|"prod: npm-registry-fetch @ ^20.0.0"| n93
    n92 -->|"prod: proc-log @ ^7.0.0"| n100
    n93 -->|"prod: @npmcli/redact @ ^5.0.0"| n20
    n93 -->|"prod: jsonparse @ ^1.3.1"| n65
    n93 -->|"prod: make-fetch-happen @ ^16.0.0"| n69
    n93 -->|"prod: minipass @ ^7.0.2"| n71
    n93 -->|"prod: minipass-fetch @ ^6.0.0"| n73
    n93 -->|"prod: minizlib @ ^3.0.1"| n79
    n93 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n93 -->|"prod: proc-log @ ^7.0.0"| n100
    n96 -->|"prod: @gar/promise-retry @ ^1.0.0"| n1
    n96 -->|"prod: @npmcli/git @ ^8.0.0"| n9
    n96 -->|"prod: @npmcli/installed-package-contents @ ^5.0.0"| n10
    n96 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n96 -->|"prod: @npmcli/promise-spawn @ ^10.0.0"| n18
    n96 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n96 -->|"prod: cacache @ ^21.0.1"| n40
    n96 -->|"prod: fs-minipass @ ^3.0.0"| n52
    n96 -->|"prod: minipass @ ^7.0.2"| n71
    n96 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n96 -->|"prod: npm-packlist @ ^11.2.0"| n88
    n96 -->|"prod: npm-pick-manifest @ ^12.0.0"| n90
    n96 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n96 -->|"prod: proc-log @ ^7.0.0"| n100
    n96 -->|"prod: sigstore @ ^5.0.0"| n112
    n96 -->|"prod: ssri @ ^14.0.0"| n120
    n96 -->|"prod: tar @ ^7.4.3"| n122
    n97 -->|"prod: json-parse-even-better-errors @ ^6.0.0"| n63
    n97 -->|"prod: just-diff @ ^6.0.0"| n66
    n97 -->|"prod: just-diff-apply @ ^5.2.0"| n67
    n98 -->|"prod: lru-cache @ ^11.0.0"| n68
    n98 -->|"prod: minipass @ ^7.1.2"| n71
    n99 -->|"prod: cssesc @ ^3.0.0"| n46
    n99 -->|"prod: util-deprecate @ ^1.0.2"| n131
    n104 -->|"prod: read @ ^6.0.0"| n108
    n105 -->|"optional peer: kerberos @ ^2.0.0"| n106
    n108 -->|"prod: mute-stream @ ^4.0.0"| n81
    n112 -->|"prod: @sigstore/bundle @ ^5.0.0"| n22
    n112 -->|"prod: @sigstore/core @ ^4.0.0"| n23
    n112 -->|"prod: @sigstore/protobuf-specs @ ^0.5.0"| n24
    n112 -->|"prod: @sigstore/sign @ ^5.0.0"| n25
    n112 -->|"prod: @sigstore/tuf @ ^5.0.0"| n26
    n112 -->|"prod: @sigstore/verify @ ^4.0.0"| n27
    n114 -->|"prod: ip-address @ ^10.1.1"| n60
    n114 -->|"prod: smart-buffer @ ^4.2.0"| n113
    n115 -->|"prod: debug @ ^4.3.4"| n47
    n115 -->|"prod: socks @ ^2.8.3"| n114
    n115 -->|"prod: agent-base @ 9.0.0"| n116
    n118 -->|"prod: spdx-exceptions @ ^2.1.0"| n117
    n118 -->|"prod: spdx-license-ids @ ^3.0.0"| n119
    n120 -->|"prod: minipass @ ^7.0.3"| n71
    n122 -->|"prod: @isaacs/fs-minipass @ ^4.0.0"| n2
    n122 -->|"prod: chownr @ ^3.0.0"| n42
    n122 -->|"prod: minipass @ ^7.1.2"| n71
    n122 -->|"prod: minizlib @ ^3.1.0"| n79
    n122 -->|"prod: yallist @ ^5.0.0"| n136
    n125 -->|"prod: fdir @ ^6.5.0"| n126
    n125 -->|"prod: picomatch @ ^4.0.4"| n127
    n126 -->|"optional peer: picomatch @ ^3 #124;#124; ^4"| n127
    n129 -->|"prod: @gar/promise-retry @ ^1.0.3"| n1
    n129 -->|"prod: @tufjs/models @ 5.0.0"| n29
    n129 -->|"prod: debug @ ^4.4.3"| n47
    n134 -->|"prod: isexe @ ^4.0.0"| n62
    n135 -->|"prod: signal-exit @ ^4.0.1"| n111
    n137 -->|"prod: @gar/promise-retry @ ^1.0.0"| n1
    n137 -->|"prod: @isaacs/string-locale-compare @ ^1.1.0"| n3
    n137 -->|"prod: @npmcli/fs @ ^6.0.0"| n8
    n137 -->|"prod: @npmcli/installed-package-contents @ ^5.0.0"| n10
    n137 -->|"prod: @npmcli/map-workspaces @ ^6.0.0"| n13
    n137 -->|"prod: @npmcli/metavuln-calculator @ ^10.0.0"| n14
    n137 -->|"prod: @npmcli/name-from-folder @ ^5.0.0"| n15
    n137 -->|"prod: @npmcli/node-gyp @ ^6.0.0"| n16
    n137 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n137 -->|"prod: @npmcli/query @ ^5.0.0"| n19
    n137 -->|"prod: @npmcli/redact @ ^5.0.0"| n20
    n137 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n137 -->|"prod: bin-links @ ^7.0.0"| n34
    n137 -->|"prod: cacache @ ^21.0.1"| n40
    n137 -->|"prod: common-ancestor-path @ ^2.0.0"| n45
    n137 -->|"prod: diff @ ^8.0.2"| n48
    n137 -->|"prod: hosted-git-info @ ^10.1.1"| n55
    n137 -->|"prod: json-stringify-nice @ ^1.1.4"| n64
    n137 -->|"prod: lru-cache @ ^11.2.1"| n68
    n137 -->|"prod: minimatch @ ^10.0.3"| n70
    n137 -->|"prod: nopt @ ^10.0.1"| n84
    n137 -->|"prod: npm-install-checks @ ^9.0.0"| n86
    n137 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n137 -->|"prod: npm-pick-manifest @ ^12.0.0"| n90
    n137 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n137 -->|"prod: pacote @ ^22.0.0"| n96
    n137 -->|"prod: parse-conflict-json @ ^6.0.0"| n97
    n137 -->|"prod: proc-log @ ^7.0.0"| n100
    n137 -->|"prod: proggy @ ^4.0.0"| n101
    n137 -->|"prod: promise-all-reject-late @ ^1.0.0"| n102
    n137 -->|"prod: promise-call-limit @ ^3.0.1"| n103
    n137 -->|"prod: semver @ ^7.3.7"| n110
    n137 -->|"prod: ssri @ ^14.0.0"| n120
    n137 -->|"prod: treeverse @ ^3.0.0"| n128
    n137 -->|"prod: validate-npm-package-name @ ^8.0.0"| n132
    n137 -->|"prod: walk-up-path @ ^4.0.0"| n133
    n138 -->|"prod: @npmcli/map-workspaces @ ^6.0.0"| n13
    n138 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n138 -->|"prod: ci-info @ ^4.0.0"| n43
    n138 -->|"prod: ini @ ^7.0.0"| n58
    n138 -->|"prod: nopt @ ^10.0.1"| n84
    n138 -->|"prod: proc-log @ ^7.0.0"| n100
    n138 -->|"prod: semver @ ^7.3.5"| n110
    n138 -->|"prod: walk-up-path @ ^4.0.0"| n133
    n139 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n139 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n140 -->|"prod: @npmcli/installed-package-contents @ ^5.0.0"| n10
    n140 -->|"prod: binary-extensions @ ^3.0.0"| n38
    n140 -->|"prod: diff @ ^8.0.2"| n48
    n140 -->|"prod: minimatch @ ^10.0.3"| n70
    n140 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n140 -->|"prod: pacote @ ^22.0.0"| n96
    n140 -->|"prod: tar @ ^7.5.1"| n122
    n140 -->|"prod: @npmcli/arborist @ ^10.0.4"| n137
    n141 -->|"prod: @gar/promise-retry @ ^1.0.0"| n1
    n141 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n141 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n141 -->|"prod: ci-info @ ^4.0.0"| n43
    n141 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n141 -->|"prod: pacote @ ^22.0.0"| n96
    n141 -->|"prod: proc-log @ ^7.0.0"| n100
    n141 -->|"prod: read @ ^6.0.0"| n108
    n141 -->|"prod: semver @ ^7.3.7"| n110
    n141 -->|"prod: signal-exit @ ^4.1.0"| n111
    n141 -->|"prod: walk-up-path @ ^4.0.0"| n133
    n141 -->|"prod: @npmcli/arborist @ ^10.0.4"| n137
    n142 -->|"prod: @npmcli/arborist @ ^10.0.4"| n137
    n143 -->|"prod: aproba @ ^2.0.0"| n31
    n143 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n144 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n144 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n144 -->|"prod: pacote @ ^22.0.0"| n96
    n144 -->|"prod: @npmcli/arborist @ ^10.0.4"| n137
    n145 -->|"prod: @npmcli/package-json @ ^8.0.0"| n17
    n145 -->|"prod: ci-info @ ^4.0.0"| n43
    n145 -->|"prod: npm-package-arg @ ^14.0.0"| n87
    n145 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n145 -->|"prod: proc-log @ ^7.0.0"| n100
    n145 -->|"prod: semver @ ^7.3.7"| n110
    n145 -->|"prod: sigstore @ ^5.0.0"| n112
    n145 -->|"prod: ssri @ ^14.0.0"| n120
    n146 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n147 -->|"prod: aproba @ ^2.0.0"| n31
    n147 -->|"prod: npm-registry-fetch @ ^20.0.1"| n93
    n148 -->|"prod: @npmcli/git @ ^8.0.0"| n9
    n148 -->|"prod: @npmcli/run-script @ ^11.0.0"| n21
    n148 -->|"prod: json-parse-even-better-errors @ ^6.0.0"| n63
    n148 -->|"prod: proc-log @ ^7.0.0"| n100
    n148 -->|"prod: semver @ ^7.3.7"| n110
```

## Node index

| ID | Name | Selected version | Lockfile location |
| --- | --- | --- | --- |
| n0 | npm | 12.2.2 | (root) |
| n1 | &#64;gar/promise-retry | 1.0.3 | node&#95;modules/&#64;gar/promise-retry |
| n2 | &#64;isaacs/fs-minipass | 4.0.1 | node&#95;modules/&#64;isaacs/fs-minipass |
| n3 | &#64;isaacs/string-locale-compare | 1.1.0 | node&#95;modules/&#64;isaacs/string-locale-compare |
| n4 | &#64;npmcli/agent | 5.0.2 | node&#95;modules/&#64;npmcli/agent |
| n5 | agent-base | 9.0.0 | node&#95;modules/&#64;npmcli/agent/node&#95;modules/agent-base |
| n6 | http-proxy-agent | 9.1.0 | node&#95;modules/&#64;npmcli/agent/node&#95;modules/http-proxy-agent |
| n7 | https-proxy-agent | 9.1.0 | node&#95;modules/&#64;npmcli/agent/node&#95;modules/https-proxy-agent |
| n8 | &#64;npmcli/fs | 6.0.0 | node&#95;modules/&#64;npmcli/fs |
| n9 | &#64;npmcli/git | 8.0.0 | node&#95;modules/&#64;npmcli/git |
| n10 | &#64;npmcli/installed-package-contents | 5.0.0 | node&#95;modules/&#64;npmcli/installed-package-contents |
| n11 | npm-bundled | 6.0.0 | node&#95;modules/&#64;npmcli/installed-package-contents/node&#95;modules/npm-bundled |
| n12 | npm-normalize-package-bin | 6.0.0 | node&#95;modules/&#64;npmcli/installed-package-contents/node&#95;modules/npm-normalize-package-bin |
| n13 | &#64;npmcli/map-workspaces | 6.0.0 | node&#95;modules/&#64;npmcli/map-workspaces |
| n14 | &#64;npmcli/metavuln-calculator | 10.0.0 | node&#95;modules/&#64;npmcli/metavuln-calculator |
| n15 | &#64;npmcli/name-from-folder | 5.0.0 | node&#95;modules/&#64;npmcli/name-from-folder |
| n16 | &#64;npmcli/node-gyp | 6.0.0 | node&#95;modules/&#64;npmcli/node-gyp |
| n17 | &#64;npmcli/package-json | 8.0.0 | node&#95;modules/&#64;npmcli/package-json |
| n18 | &#64;npmcli/promise-spawn | 10.0.1 | node&#95;modules/&#64;npmcli/promise-spawn |
| n19 | &#64;npmcli/query | 5.0.0 | node&#95;modules/&#64;npmcli/query |
| n20 | &#64;npmcli/redact | 5.0.0 | node&#95;modules/&#64;npmcli/redact |
| n21 | &#64;npmcli/run-script | 11.0.0 | node&#95;modules/&#64;npmcli/run-script |
| n22 | &#64;sigstore/bundle | 5.0.0 | node&#95;modules/&#64;sigstore/bundle |
| n23 | &#64;sigstore/core | 4.0.1 | node&#95;modules/&#64;sigstore/core |
| n24 | &#64;sigstore/protobuf-specs | 0.5.1 | node&#95;modules/&#64;sigstore/protobuf-specs |
| n25 | &#64;sigstore/sign | 5.0.0 | node&#95;modules/&#64;sigstore/sign |
| n26 | &#64;sigstore/tuf | 5.0.0 | node&#95;modules/&#64;sigstore/tuf |
| n27 | &#64;sigstore/verify | 4.1.0 | node&#95;modules/&#64;sigstore/verify |
| n28 | &#64;tufjs/canonical-json | 2.0.0 | node&#95;modules/&#64;tufjs/canonical-json |
| n29 | &#64;tufjs/models | 5.0.0 | node&#95;modules/&#64;tufjs/models |
| n30 | abbrev | 5.0.0 | node&#95;modules/abbrev |
| n31 | aproba | 2.1.0 | node&#95;modules/aproba |
| n32 | archy | 1.0.0 | node&#95;modules/archy |
| n33 | balanced-match | 4.0.4 | node&#95;modules/balanced-match |
| n34 | bin-links | 7.0.1 | node&#95;modules/bin-links |
| n35 | cmd-shim | 9.0.2 | node&#95;modules/bin-links/node&#95;modules/cmd-shim |
| n36 | npm-normalize-package-bin | 6.0.0 | node&#95;modules/bin-links/node&#95;modules/npm-normalize-package-bin |
| n37 | read-cmd-shim | 7.0.1 | node&#95;modules/bin-links/node&#95;modules/read-cmd-shim |
| n38 | binary-extensions | 3.1.0 | node&#95;modules/binary-extensions |
| n39 | brace-expansion | 5.0.12 | node&#95;modules/brace-expansion |
| n40 | cacache | 21.0.1 | node&#95;modules/cacache |
| n41 | chalk | 5.6.2 | node&#95;modules/chalk |
| n42 | chownr | 3.0.0 | node&#95;modules/chownr |
| n43 | ci-info | 4.4.0 | node&#95;modules/ci-info |
| n44 | cidr-regex | 6.0.0 | node&#95;modules/cidr-regex |
| n45 | common-ancestor-path | 2.0.0 | node&#95;modules/common-ancestor-path |
| n46 | cssesc | 3.0.0 | node&#95;modules/cssesc |
| n47 | debug | 4.4.3 | node&#95;modules/debug |
| n48 | diff | 8.0.4 | node&#95;modules/diff |
| n49 | env-paths | 2.2.1 | node&#95;modules/env-paths |
| n50 | exponential-backoff | 3.1.3 | node&#95;modules/exponential-backoff |
| n51 | fastest-levenshtein | 1.0.16 | node&#95;modules/fastest-levenshtein |
| n52 | fs-minipass | 3.0.3 | node&#95;modules/fs-minipass |
| n53 | glob | 13.0.6 | node&#95;modules/glob |
| n54 | graceful-fs | 4.2.11 | node&#95;modules/graceful-fs |
| n55 | hosted-git-info | 10.1.1 | node&#95;modules/hosted-git-info |
| n56 | http-cache-semantics | 4.3.0 | node&#95;modules/http-cache-semantics |
| n57 | iconv-lite | 0.7.3 | node&#95;modules/iconv-lite |
| n58 | ini | 7.0.0 | node&#95;modules/ini |
| n59 | init-package-json | 9.0.0 | node&#95;modules/init-package-json |
| n60 | ip-address | 10.7.5 | node&#95;modules/ip-address |
| n61 | is-cidr | 7.0.0 | node&#95;modules/is-cidr |
| n62 | isexe | 4.0.0 | node&#95;modules/isexe |
| n63 | json-parse-even-better-errors | 6.0.0 | node&#95;modules/json-parse-even-better-errors |
| n64 | json-stringify-nice | 1.1.4 | node&#95;modules/json-stringify-nice |
| n65 | jsonparse | 1.3.1 | node&#95;modules/jsonparse |
| n66 | just-diff | 6.0.2 | node&#95;modules/just-diff |
| n67 | just-diff-apply | 5.5.0 | node&#95;modules/just-diff-apply |
| n68 | lru-cache | 11.5.2 | node&#95;modules/lru-cache |
| n69 | make-fetch-happen | 16.0.1 | node&#95;modules/make-fetch-happen |
| n70 | minimatch | 10.2.5 | node&#95;modules/minimatch |
| n71 | minipass | 7.1.3 | node&#95;modules/minipass |
| n72 | minipass-collect | 2.0.1 | node&#95;modules/minipass-collect |
| n73 | minipass-fetch | 6.0.0 | node&#95;modules/minipass-fetch |
| n74 | minipass-flush | 1.0.6 | node&#95;modules/minipass-flush |
| n75 | minipass-pipeline | 1.2.4 | node&#95;modules/minipass-pipeline |
| n76 | minipass | 3.3.6 | node&#95;modules/minipass-pipeline/node&#95;modules/minipass |
| n77 | yallist | 4.0.0 | node&#95;modules/minipass-pipeline/node&#95;modules/yallist |
| n78 | minipass-sized | 2.0.0 | node&#95;modules/minipass-sized |
| n79 | minizlib | 3.1.0 | node&#95;modules/minizlib |
| n80 | ms | 2.1.3 | node&#95;modules/ms |
| n81 | mute-stream | 4.0.0 | node&#95;modules/mute-stream |
| n82 | negotiator | 1.0.0 | node&#95;modules/negotiator |
| n83 | node-gyp | 13.0.0 | node&#95;modules/node-gyp |
| n84 | nopt | 10.0.1 | node&#95;modules/nopt |
| n85 | npm-audit-report | 8.0.0 | node&#95;modules/npm-audit-report |
| n86 | npm-install-checks | 9.0.0 | node&#95;modules/npm-install-checks |
| n87 | npm-package-arg | 14.0.0 | node&#95;modules/npm-package-arg |
| n88 | npm-packlist | 11.3.0 | node&#95;modules/npm-packlist |
| n89 | ignore-walk | 9.0.0 | node&#95;modules/npm-packlist/node&#95;modules/ignore-walk |
| n90 | npm-pick-manifest | 12.0.0 | node&#95;modules/npm-pick-manifest |
| n91 | npm-normalize-package-bin | 6.0.0 | node&#95;modules/npm-pick-manifest/node&#95;modules/npm-normalize-package-bin |
| n92 | npm-profile | 13.0.1 | node&#95;modules/npm-profile |
| n93 | npm-registry-fetch | 20.0.1 | node&#95;modules/npm-registry-fetch |
| n94 | npm-user-validate | 5.0.0 | node&#95;modules/npm-user-validate |
| n95 | p-map | 7.0.5 | node&#95;modules/p-map |
| n96 | pacote | 22.0.1 | node&#95;modules/pacote |
| n97 | parse-conflict-json | 6.0.0 | node&#95;modules/parse-conflict-json |
| n98 | path-scurry | 2.0.2 | node&#95;modules/path-scurry |
| n99 | postcss-selector-parser | 7.1.6 | node&#95;modules/postcss-selector-parser |
| n100 | proc-log | 7.0.0 | node&#95;modules/proc-log |
| n101 | proggy | 4.0.0 | node&#95;modules/proggy |
| n102 | promise-all-reject-late | 1.0.1 | node&#95;modules/promise-all-reject-late |
| n103 | promise-call-limit | 3.0.2 | node&#95;modules/promise-call-limit |
| n104 | promzard | 4.0.0 | node&#95;modules/promzard |
| n105 | proxy-agent-negotiate | 1.1.0 | node&#95;modules/proxy-agent-negotiate |
| n106 | kerberos | not recorded | not recorded; declared by node&#95;modules/proxy-agent-negotiate (peer) |
| n107 | qrcode-terminal | 0.12.0 | node&#95;modules/qrcode-terminal |
| n108 | read | 6.0.0 | node&#95;modules/read |
| n109 | safer-buffer | 2.1.2 | node&#95;modules/safer-buffer |
| n110 | semver | 7.8.6 | node&#95;modules/semver |
| n111 | signal-exit | 4.1.0 | node&#95;modules/signal-exit |
| n112 | sigstore | 5.0.0 | node&#95;modules/sigstore |
| n113 | smart-buffer | 4.2.0 | node&#95;modules/smart-buffer |
| n114 | socks | 2.8.9 | node&#95;modules/socks |
| n115 | socks-proxy-agent | 10.1.0 | node&#95;modules/socks-proxy-agent |
| n116 | agent-base | 9.0.0 | node&#95;modules/socks-proxy-agent/node&#95;modules/agent-base |
| n117 | spdx-exceptions | 2.5.0 | node&#95;modules/spdx-exceptions |
| n118 | spdx-expression-parse | 4.0.0 | node&#95;modules/spdx-expression-parse |
| n119 | spdx-license-ids | 3.0.23 | node&#95;modules/spdx-license-ids |
| n120 | ssri | 14.0.0 | node&#95;modules/ssri |
| n121 | supports-color | 10.2.2 | node&#95;modules/supports-color |
| n122 | tar | 7.5.22 | node&#95;modules/tar |
| n123 | text-table | 0.2.0 | node&#95;modules/text-table |
| n124 | tiny-relative-date | 2.0.2 | node&#95;modules/tiny-relative-date |
| n125 | tinyglobby | 0.2.17 | node&#95;modules/tinyglobby |
| n126 | fdir | 6.5.0 | node&#95;modules/tinyglobby/node&#95;modules/fdir |
| n127 | picomatch | 4.0.5 | node&#95;modules/tinyglobby/node&#95;modules/picomatch |
| n128 | treeverse | 3.0.0 | node&#95;modules/treeverse |
| n129 | tuf-js | 6.0.0 | node&#95;modules/tuf-js |
| n130 | undici | 6.29.1 | node&#95;modules/undici |
| n131 | util-deprecate | 1.0.2 | node&#95;modules/util-deprecate |
| n132 | validate-npm-package-name | 8.0.0 | node&#95;modules/validate-npm-package-name |
| n133 | walk-up-path | 4.0.0 | node&#95;modules/walk-up-path |
| n134 | which | 7.0.0 | node&#95;modules/which |
| n135 | write-file-atomic | 8.0.0 | node&#95;modules/write-file-atomic |
| n136 | yallist | 5.0.0 | node&#95;modules/yallist |
| n137 | &#64;npmcli/arborist (workspace) | 10.0.4 | workspaces/arborist |
| n138 | &#64;npmcli/config (workspace) | 11.2.0 | workspaces/config |
| n139 | libnpmaccess (workspace) | 11.0.0 | workspaces/libnpmaccess |
| n140 | libnpmdiff (workspace) | 9.0.4 | workspaces/libnpmdiff |
| n141 | libnpmexec (workspace) | 11.0.5 | workspaces/libnpmexec |
| n142 | libnpmfund (workspace) | 8.0.4 | workspaces/libnpmfund |
| n143 | libnpmorg (workspace) | 9.0.0 | workspaces/libnpmorg |
| n144 | libnpmpack (workspace) | 10.0.4 | workspaces/libnpmpack |
| n145 | libnpmpublish (workspace) | 12.0.1 | workspaces/libnpmpublish |
| n146 | libnpmsearch (workspace) | 10.0.0 | workspaces/libnpmsearch |
| n147 | libnpmteam (workspace) | 9.0.0 | workspaces/libnpmteam |
| n148 | libnpmversion (workspace) | 9.0.0 | workspaces/libnpmversion |
