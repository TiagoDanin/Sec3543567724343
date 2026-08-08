---
description: Commita apenas as mudanças da sessão, com mensagem em Conventional Commits
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git rev-parse:*), Bash(git add:*), Bash(git reset:*), Bash(git commit:*)
---

## Contexto

- Branch: !`git rev-parse --abbrev-ref HEAD`
- Estado: !`git status --short`
- Já staged: !`git diff --cached --stat`
- Commits recentes: !`git log --format='%s' -10`

## Tarefa

Commite **somente o que foi feito nesta sessão**. Se `$ARGUMENTS` trouxer caminhos, restrinja o commit a eles.

### 1. Selecionar os arquivos

O working tree pode conter mudanças alheias à sessão. Nunca use `git add -A`, `git add .` nem `git commit -a`: liste os caminhos que você mesmo criou ou editou nesta conversa e adicione só esses. Se algo já staged não pertence à sessão, dê `git reset` nele.

Sem conseguir distinguir o que é da sessão — num contexto retomado, por exemplo — pergunte em vez de adivinhar. Se nada da sessão restou, diga isso e pare.

Leia `git diff --cached` antes de escrever a mensagem: ela descreve o patch, não a intenção.

### 2. Escrever a mensagem

Uma linha, em **inglês**, no formato `type(scope): description`.

Tipos: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`, `perf`, `build`, `ci`, `revert`, `version`, `sec`, `deps`, `llm`. Entre eles, quatro que não são óbvios:

- `version` — bump de versão do projeto/pacote/app, com o número novo: `version: bump to 1.4.0`
- `sec` — correção ou endurecimento de segurança
- `deps` — dependência adicionada, atualizada ou removida
- `llm` — config `.claude`, skills, prompts ou arquivos de agente

**Escopo é obrigatório**, nunca um `type:` pelado. Nesta ordem de prioridade:

1. id de issue/ticket do nome do branch — padrões como `oc-2120`, `hub-434`, `g-110`, `#433`, em minúsculas e sem `#`;
2. nome de feature flag visível no patch;
3. módulo/componente afetado, tirado dos caminhos alterados;
4. último segmento do nome do branch.

Trabalho igual ao de commits recentes mantém o escopo deles.

Regras rígidas: 72 caracteres, tipo minúsculo, imperativo, sem ponto final, sem aspas, sem markdown, sem travessão, e **nunca** mencionar IA, Claude, agentes ou ferramentas. Exatamente **uma linha** — sem corpo, rodapé ou trailer `Co-Authored-By`/`Claude-Session`.

### 3. Commitar

`git add` nos caminhos escolhidos, `git commit -m` com a linha. Sem push. Ao fim, informe hash, mensagem e o que ficou de fora.
