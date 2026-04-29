# Project Guidance

This file provides context and guidance for working with this project.

## Instructions

Only work in project directory and subdirectories, do not attempt reading or writing outside this directory branch.

Please periodically update this file as the project evolves to include:
- Project overview and goals
- Setup and installation instructions
- Development workflow
- Coding standards and conventions
- Testing approach
- Any other relevant information for working with this codebase

## Environment Persistence

This sandbox has a persistent environment file at `/etc/sandbox-persistent.sh`.

This file is automatically sourced in all shell contexts:
- **Non-interactive shells**: via `BASH_ENV=/etc/sandbox-persistent.sh`
- **Login shells**: via `/etc/profile.d/sandbox-persistent.sh`
- **Interactive shells**: via `/etc/bash.bashrc` and `~/.bashrc`

Environment variables stored in this file persist across all bash invocations.

- Use `echo "export VAR_NAME=value" >> /etc/sandbox-persistent.sh` to add persistent variables
- Useful for tool installations (nvm, sdkman, etc.) that modify PATH or environment variables

## Critical: Shell Completions Must NOT Be in the Persistent Environment File

**NEVER** add shell completion scripts to `/etc/sandbox-persistent.sh`. Shell completion scripts (like `bash_completion` for NVM, SDKMAN, etc.) **will completely break the bash tool** when sourced via the persistent environment file.

### Why Completions Break

The persistent environment file is sourced **before every single bash command execution**, not just during shell initialization. Completion scripts rely on special variables (`COMP_WORDS`, `COMP_CWORD`, `COMPREPLY`) that only exist during tab-completion contexts, not during normal command execution.

### WRONG - Will Break Bash

```bash
# DO NOT ADD THESE TO /etc/sandbox-persistent.sh
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
[[ -s "$SDKMAN_DIR/etc/bash_completion.sh" ]] && source "$SDKMAN_DIR/etc/bash_completion.sh"
```

### CORRECT - Only Load Core Functionality

```bash
# ONLY add the main initialization scripts
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$SDKMAN_DIR/bin/sdkman-init.sh" ]] && source "$SDKMAN_DIR/bin/sdkman-init.sh"
```

### Symptoms of Broken Shell

When completion scripts are incorrectly added to the persistent environment file:
- All bash commands return no output (silent failure)
- `echo`, `pwd`, and other basic commands produce no results
- The bash tool becomes completely unusable

### Solution

If you accidentally added completion scripts and broke the shell:
1. Remove the completion line(s) from `/etc/sandbox-persistent.sh`
2. Exit and restart the session
3. Verify with `echo "test"` that bash works again

### IMPORTANT: Using the Bash Tool

**When using the Bash tool, in case of not finding the tool in the PATH, try using a fresh login shell to ensure the persistent environment is properly loaded:**

- Use `bash -l -c "your-command"` instead of running commands directly
- This ensures `/etc/sandbox-persistent.sh` is sourced and PATH modifications are honored
- Example: `bash -l -c "java -version"` instead of `java -version`
- This is critical when tools like sdkman, nvm, or other environment managers modify PATH

**Why this is necessary:**
- Shell snapshots may contain cached environment state from before tools were installed
- Login shells always source the persistent environment file fresh, ensuring latest configuration

Example - persisting nvm installation:
```bash
# After installing nvm
 echo 'export NVM_DIR="$HOME/.nvm"' >> /etc/sandbox-persistent.sh
 echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /etc/sandbox-persistent.sh

# Then use login shells to access it
bash -l -c "node --version"
```

Example - persisting sdkman installation:
```bash
# After installing sdkman and Java
 echo 'export SDKMAN_DIR="$HOME/.sdkman"' >> /etc/sandbox-persistent.sh
 echo '[[ -s "$SDKMAN_DIR/bin/sdkman-init.sh" ]] && source "$SDKMAN_DIR/bin/sdkman-init.sh"' >> /etc/sandbox-persistent.sh

# Then use login shells to access it
bash -l -c "java -version"
 bash -l -c "sdk current"
```

## Network access

There is a firewall in place to restrict outbound network access.

### When a request is blocked

Blocked HTTP/HTTPS requests return **HTTP 403**. Always read the response body — it contains a
structured explanation you can act on directly:

```
Blocked by network policy: domain <host>
  rule:   "<rule-name>" (domain, deny)     ← present only for explicit deny rules
  origin: <origin>
  detail: <explanation>
```

Use `origin` and `detail` to give the user targeted advice:

- **`detail: no matching allow rule — blocked by default deny policy`**
  The domain is not on any allow list (implicit / default-deny). Ask the user to run on their host:
  ```bash
  sbx policy allow network <domain>[,<domain>…]   # allow specific domains
  sbx policy allow network "**"                   # allow all traffic not on the denylist
  ```

- **`origin: local policy`** with an explicit deny rule: a local rule is actively blocking the
  domain. The user can override it with `sbx policy allow network <domain>` if appropriate.

- **`origin: corporate policy`** or **`origin: system policy`**: the block is enforced at the
  organisation or system level. **Do not** suggest `sbx policy allow` — tell the user their
  company or system policy is blocking this request, and they should contact IT if they need access.

To inspect recent connections and their block reasons:
```bash
sbx policy log   # shows host, rule, reason, and last-seen time
sbx policy ls    # shows active rules and why any are inactive/suppressed
```

### Troubleshooting connectivity issues

If outbound HTTP/HTTPS requests are failing with connection errors (not policy blocks), the proxy
may be using the wrong IP protocol version for the host's network. The proxy auto-detects the host's
IP stack (IPv4-only, IPv6-only, or dual-stack) but the detection can be wrong.

To diagnose:
1. Check which IP versions the host has by looking for non-loopback, non-link-local addresses:
   - macOS: `ifconfig | grep 'inet '` (IPv4) and `ifconfig | grep 'inet6 '` (IPv6, ignore fe80::)
   - Linux: `ip -4 addr show scope global` and `ip -6 addr show scope global`
   - Windows (PowerShell): `Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.PrefixOrigin -ne 'WellKnown' }` and `Get-NetIPAddress -AddressFamily IPv6 | Where-Object { $_.PrefixOrigin -ne 'WellKnown' -and $_.SuffixOrigin -ne 'Link' }`
2. If the host is IPv6-only but the proxy is trying IPv4 (or vice versa), ask the user to set the
   `DOCKER_SANDBOXES_IP_STACK` environment variable before starting sandboxd. Valid values:
   - `ipv4only` — only use IPv4 for upstream connections
   - `ipv6only` — only use IPv6 for upstream connections
   - `dual-stack` — try both using happy-eyeballs (see below)

**Slow connections with dual-stack:** If the proxy detects `dual-stack` but one protocol doesn't
actually have upstream connectivity (e.g. the host has IPv6 addresses but no working IPv6 route),
requests may be very slow rather than failing outright. The happy-eyeballs algorithm tries both
protocols but must wait for the non-working one to time out before falling back to the other.
If connections are succeeding but taking much longer than expected, ask the user to set
`DOCKER_SANDBOXES_IP_STACK` to whichever single protocol actually works (`ipv4only` or `ipv6only`).

### Publishing ports to the host

Services running in this sandbox are not directly accessible from the host. To expose a port, the
user must run a CLI command on the host:

```bash
sbx ports <sandbox-name> --publish [[HOST_IP:]HOST_PORT:]SANDBOX_PORT[/PROTOCOL]
```

For example, to publish a web server on port 8080:

```bash
sbx ports <sandbox-name> --publish 8080:8080/tcp
```

To list published ports:

```bash
sbx ports <sandbox-name>
```

To unpublish a port:

```bash
sbx ports <sandbox-name> --unpublish 8080:8080/tcp
```

**Binding address**: Services you start must listen on the `eth0` interface (not just `127.0.0.1`)
To be reachable via port publishing. Bind to `0.0.0.0` (IPv4) or `::` (IPv6) to listen on all
interfaces including `eth0`.

**Protocols**: Supported values are `tcp` (default, dual-stack), `tcp4`, `tcp6`, `udp`, `udp4`,`udp6`.
Use `tcp6` or `udp6` only if the service is listening exclusively on an IPv6 address.
In most cases `tcp` or `udp` is sufficient.

When you need a port published, ask the user to run the command above on their host.

### Accessing services on the host

The sandbox has its own `localhost`, so you cannot use `localhost` to reach services running on the
host machine. To connect to a service bound to the host's localhost (e.g., a local API server on
port 3000), use `host.docker.internal` instead:

```
curl http://host.docker.internal:3000
```

Services listening on other host addresses (e.g., a LAN IP) are reachable directly — just use the
address and make sure it is allowed in the sandbox's network policy.

The target port must be allowed in the sandbox's network policy. If the request is blocked, ask
 the user to allow `localhost:<port>` in the network policy.

### Docker network access

You have access to a Docker daemon in this environment. You can access published ports on "localhost"
because it is included in the shell's "no proxy" configuration. For direct access to container ports,
you must add the container's network to the "no proxy" configuration.

## Git Authentication

The sandbox proxy handles GitHub authentication automatically by injecting credentials for HTTPS
Git operations. You do **not** need to run `gh auth login` or configure Git credentials inside the
sandbox — the proxy takes care of it transparently.

**Important**: `gh auth status` will show "not logged in" inside the sandbox. This is expected and
does **not** mean Git operations will fail. The proxy injects credentials at the network level,
independently of the `gh` CLI auth state.

**Do NOT tell the user to push from their local terminal.** Git push should work directly from
inside the sandbox when credentials are properly configured.

### If `git push` fails with authentication errors

If `git push` fails with `fatal: could not read Username for 'https://github.com'`, it means the
user has not yet configured a GitHub token as a sandbox secret on the host. Tell the user to run
the following command on their host:

For an existing sandbox (takes effect immediately):
```bash
sbx secret set <sandbox-name> github -t "$(gh auth token)"
```

Or globally for all future sandboxes (requires sandbox recreate):
```bash
sbx secret set -g github -t "$(gh auth token)"
```

## Additional Notes

- Always read relevant files before making changes
- Run tests after making modifications
- Follow the existing code structure and patterns
- Ask for clarification if project requirements are unclear
- You have sudo permissions, so you can install necessary packages
- npm, pip and uv are already available for package management

## Testing

Run the Italian module tests:
```bash
node tests/italian-unit.test.js
```

Tests verify:
- Question generation for each level (A1-C2)
- Category structure validity
- Syntax blocks required fields
- Reply choices and correctIndex
- Async API (generateQuestion returns Promise)

# Development Guidelines

## Code Review Standards

### Check for prior implementation before writing new code
- Search the codebase for existing solutions before implementing new features
- Reuse existing components, patterns, and mechanisms when possible
- Avoid duplicating logic or functionality

### Code Documentation
- Add inline comments to explain the purpose and mechanics of complex code
- Document why a solution was chosen, not just what it does
- Include context for future maintainers

### Planning and Design
- Plan and critique your plan before performing non-trivial tasks
- Consider edge cases and potential failure modes
- Review requirements and constraints before implementation

### File and Code Understanding
- Read relevant files before planning and before modifications
- Understand the existing code structure and patterns
- Ensure changes are consistent with the codebase style

### Testing and Validation
- Run tests after completing tasks to verify correctness
- Read modified files to identify resulting errors or regressions
- Fix any issues before considering the task complete

### Collaboration and Delegation
- Delegate tasks to sub-agents when possible
- Use expert agents for specialized tasks
- Leverage the strengths of different agent types

### Security Reviews
- Invoke a security specialist agent to perform security reviews of solutions and code in plan, build, and test stages
- Security reviews should cover threat modeling, vulnerability assessment, and secure coding practices

## Security Framework Consultation Policy

The security specialist agent should perform a risk assessment to determine which security frameworks to consult based on the following criteria:

### Geographic & Regulatory Considerations
**Norway/GDPR Compliance**: All security assessments must comply with GDPR requirements for personal data protection, including data minimization, purpose limitation, and consent management.

### Risk Assessment Criteria
1. **Data Sensitivity Level**:
   - **High Sensitivity** (PII, financial data, health records): Consult ISO 27001, SOC 2, HIPAA, PCI DSS
   - **Medium Sensitivity** (business data, user credentials): Consult NIST CSF, CIS Controls
   - **Low Sensitivity** (public information, non-critical data): Consult OWASP ASVS Level 1

2. **Application Type**:
   - **Web Applications/APIs**: Consult OWASP ASVS, OWASP Top 10
   - **Payment Processing**: Consult PCI DSS
   - **Healthcare Systems**: Consult HIPAA
   - **Defense/Contractor Systems**: Consult CMMC
   - **Cloud Services**: Consult SOC 2, NIST CSF

3. **Regulatory Requirements**:
   - **Mandatory Compliance**: Consult specific frameworks based on legal requirements
   - **International Operations**: Consult ISO 27001, NIST CSF
   - **US Federal Contracts**: Consult CMMC, NIST CSF 2.0
   - **EU/EEA Operations**: Ensure GDPR compliance (data subject rights, breach notification)

4. **Maturity Level Assessment**:
   - **Initial/Ad-hoc**: Consult CIS Controls (basic security hygiene)
   - **Developing/Process-driven**: Consult NIST CSF, ISO 27001
   - **Advanced/Optimized**: Consult SOC 2, comprehensive framework alignment

### Consultation Priority Matrix
- **Critical Risk**: Consult all relevant frameworks (OWASP, NIST CSF, ISO 27001, industry-specific)
- **High Risk**: Consult OWASP + 2 industry-specific frameworks
- **Medium Risk**: Consult OWASP + NIST CSF or ISO 27001
- **Low Risk**: Consult OWASP ASVS Level 1

### Decision Process
1. Assess data sensitivity and regulatory requirements
2. Evaluate application type and deployment environment
3. Determine organizational maturity level
4. Consult appropriate frameworks based on risk assessment
5. Document framework selection rationale in security review report
6. Ensure GDPR compliance for Norway operations (data minimization, purpose limitation, consent management, breach notification)

## Agent Types

The following agent types are available for delegation:
- **explore**: Fast agent specialized for exploring codebases
- **general**: General-purpose agent for complex tasks
- **test**: Agent specialized for testing tasks

## Agent Expertise

- Use specialized agents (e.g., explore, general, test) for specific tasks
- Consult documentation and code search when uncertain
- Verify solutions through testing and code review

## Subagent Organization

The following subagent types are available for specialized delegation:

### Architecture & Design
- **architecture-strategist**: High-level architectural planning and design decisions
- **architecture-analyst**: Detailed architectural analysis and validation

### Dependency & Security Analysis
- **dependency-auditor**: Audit dependencies for vulnerabilities and license compliance
- **security-specialist-auditor**: Security audit and compliance verification
- **security-specialist-architect**: Security architecture design and implementation
- **security-specialist-pentester**: Penetration testing and security validation

### Performance & Quality
- **performance-profiler**: Performance profiling and optimization
- **performance-reviewer**: Performance review and benchmarking
- **style-checker**: Code style and convention validation

### Testing & Coverage
- **test-analyzer**: Test analysis and test case design
- **test-coverage-analyst**: Test coverage analysis and reporting

### Documentation & Review
- **docs-reviewer**: Documentation review and quality assurance

### Project Management
- **agent-project-coordinator**: Project coordination and task management
- **agent-project-sequence-manager**: Sequence and workflow management
- **agent-project-branching-manager**: Branching strategy and version management