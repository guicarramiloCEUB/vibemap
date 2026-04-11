
## 🌿 Git Flow Strategy

Usamos **Git Flow** para gerenciar branches e releases. Entenda bem:

```
main (Produção)
  ↑
  └─ Merge quando pronto para usar
  
develop (Staging/Integração)
  ↑
  └─ Merge das features aqui
  
feature/nova-funcionalidade
  └─ Cria uma feature, faz PR para develop
```

### Branches:

| Branch | Propósito | Baseado em | Merge em |
|--------|-----------|-----------|----------|
| **main** | Produção/Release | - | - |
| **develop** | Integração contínua | main | main (quando pronto) |
| **feature/\*** | Novas features | develop | develop (via PR) |
| **fix/\*** | Bug fixes | develop | develop (via PR) |
| **hotfix/\*** | Bugs críticos em prod | main | main + develop |

---

## 🚀 Setup Inicial

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/vibemap.git
cd vibemap

# Importante: Você pode estar em 'develop' ou 'main'
# Garanta que está em develop
git checkout develop
git pull origin develop
```

### 2. Ative o Ambiente

```bash
# Ativar venv
source .venv/bin/activate

# Ou se usar Makefile
make docker-up      # Inicia PostgreSQL, Redis, Adminer
make install        # Instala dependências
make migrate        # Aplica migrations
make run-django     # Inicia servidor

# Em outro terminal
make run-celery     # Inicia Celery (opcional)
```

### 3. Confirme que Tá Funcionando

```bash
curl http://localhost:8000/admin/
# Deveria retornar página do Django
```

---

## 📝 Criando uma Feature

### 1. Certifique-se de estar na branch correta

```bash
# Vir para develop
git checkout develop

# Atualizar com últimas mudanças
git pull origin develop
```

### 2. Criar nova branch de feature

```bash
# Para novas funcionalidades
git checkout -b feature/descricao-da-feature

# Exemplos:
git checkout -b feature/user-profile
git checkout -b feature/event-map
git checkout -b feature/real-time-notifications

# Para bug fixes
git checkout -b fix/nome-do-bug
git checkout -b fix/websocket-connection-error
```

**Nomenclatura importa!**
- ✅ `feature/user-authentication`
- ✅ `fix/api-timeout-issue`
- ❌ `my-feature` (muito vago)
- ❌ `test` (muito genérico)

### 3. Trabalhe normalmente

```bash
# Editar arquivos
# Testar localmente
# Fazer commits
git add .
git commit -m "feat: descrição clara do que foi feito"

# Mais commits se necessário
git add .
git commit -m "test: adicionar testes da feature"

# Fazer push
git push -u origin feature/descricao-da-feature
```

---

## 🔄 Abrindo um Pull Request

### 1. Vá ao GitHub e abra um PR

```
Branch padrão agora é 'develop'
Certifique-se que o PR é:
    De: feature/sua-feature
    Para: develop
```

### 2. Preencha bem o template


## 🎯 Tipo de Mudança

- [ ] Bugfix (correção que quebrou algo)
- [x] Feature (nova funcionalidade)
- [ ] Breaking change (pode quebrar algo)




### 3. Espere por review

Se houver comentários:
```bash
# Fazer mudanças locais
git add .
git commit -m "review: address feedback from @reviewer"
git push origin feature/sua-feature

# GitHub atualiza PR automaticamente
```

---

## ✅ Merge e Cleanup

Após aprovação:

### Opção 1: Merge via GitHub (RECOMENDADO)

```
1. Clique no botão verde "Merge pull request"
2. Selecione "Squash and merge" OU "Create a merge commit"
3. Confirme
```

### Opção 2: Merge Local

```bash
# Atualizar local
git fetch origin

# Estar em develop
git checkout develop
git pull origin develop

# Fazer merge
git merge feature/sua-feature

# Fazer push
git push origin develop

# Deletar branch local
git branch -d feature/sua-feature

# Deletar branch remoto
git push origin --delete feature/sua-feature
```

---

## 🎯 Regras Importantes

### ✅ FAÇA:

- ✅ Sempre partir de `develop` para features
- ✅ Fazer commits pequenos e bem descritos
- ✅ Testar localmente antes de fazer PR
- ✅ Manter branches sincronizadas com develop
- ✅ Usar nomes de branch descritivos
- ✅ Fazer PR mesmo para mudanças pequenas (review = qualidade)

### ❌ NÃO FAÇA:

- ❌ Nunca fazer commit direto em `main` ou `develop`
- ❌ Nunca fazer PR para `main` (exceto releases)
- ❌ Não mergear sua própria PR (sem review)
- ❌ Não trabalhar em código antigo sem `git pull` antes
- ❌ Não commitar credenciais, senhas ou `.env`
- ❌ Não fazer commits gigantes (múltiplas features no mesmo commit)

---

## 🚨 Conflitos de Merge

Se houver conflito após `git push`:

```bash
# GitHub vai avisar: "This branch has conflicts that must be resolved"

# Opção 1: Resolver via web UI (mais fácil)
# Clique em "Resolve conflicts" no GitHub

# Opção 2: Resolver local
git fetch origin
git checkout feature/sua-feature
git merge origin/develop

# Git vai mostrar arquivo com conflito:
# <<<<<<< HEAD
# seu código
# =======
# código de develop
# >>>>>>> origin/develop

# Editar arquivo, deixar correto
git add arquivo-corrigido.py
git commit -m "fix: resolver conflito de merge"
git push origin feature/sua-feature

# GitHub vai atualizar PR
```


### Migrations

Se modificou models:

```bash
# Criar migration
python backend/manage.py makemigrations

# Aplicar migration
python backend/manage.py migrate

# Commitar arquivo de migration
git add backend/*/migrations/
git commit -m "migrations: adicionar novo modelo"
```

---

## 🎯 Release (Merge develop → main)

Quando `develop` está estável:

### Passo 1: Criar Release Branch

```bash
git checkout develop
git pull origin develop
git checkout -b release/1.1.0
```

### Passo 2: Atualizar versão

```bash
# Editar version em arquivos-chave
# Por exemplo, em requirements.txt ou setup.py
echo "1.1.0" > VERSION

# Atualizar CHANGELOG.md
cat >> CHANGELOG.md << 'EOF'

## v1.1.0 - YYYY-MM-DD

### Features
- Nova feature X
- Nova feature Y

### Fixes
- Corrigido bug A
- Corrigido bug B
EOF

git add VERSION CHANGELOG.md
git commit -m "chore: bump version to 1.1.0"
```

### Passo 3: Merge em main

```bash
git checkout main
git pull origin main
git merge release/1.1.0
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main
git push origin v1.1.0
```

### Passo 4: Merge de volta em develop

```bash
git checkout develop
git merge release/1.1.0
git push origin develop
```

### Passo 5: Cleanup

```bash
git branch -d release/1.1.0
git push origin --delete release/1.1.0
```

---

## 🚨 Hotfix (Emergency Fix em main)

Se houver bug crítico em produção:

```bash
# 1. Partir de main (não de develop!)
git checkout main
git pull origin main

# 2. Criar hotfix
git checkout -b hotfix/critical-issue

# 3. Fixar
git add .
git commit -m "hotfix: corrigir bug crítico"

# 4. Merge em main
git checkout main
git merge hotfix/critical-issue
git tag -a v1.1.1 -m "Hotfix v1.1.1"
git push origin main
git push origin v1.1.1

# 5. Merge em develop
git checkout develop
git merge hotfix/critical-issue
git push origin develop

# 6. Cleanup
git branch -d hotfix/critical-issue
git push origin --delete hotfix/critical-issue
```


---

## 🆘 Problemas Comuns

### "Fiz commit em main por acidente"

```bash
# Desfazer último commit (mantendo mudanças)
git reset HEAD~1

# Mudar para develop
git checkout develop
git add .
git commit -m "feat: sua feature"
```

### "Preciso atualizar minha feature com mudanças de develop"

```bash
# Estar em sua feature
git checkout feature/sua-feature

# Fazer rebase
git rebase origin/develop

# Se houver conflitos, resolver, depois:
git add .
git rebase --continue

# Fazer push (force)
git push -f origin feature/sua-feature
```

### "Minha branch ficou muito atrás de develop"

```bash
git checkout feature/sua-feature
git fetch origin
git merge origin/develop

# Resolver conflitos se houver
# Fazer push
git push origin feature/sua-feature
```

