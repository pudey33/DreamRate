# DreamRate AI Context Documentation

This directory contains comprehensive documentation for AI coding assistants and developers working on the DreamRate project.

---

## 📚 Documentation Index

### 1. [Project Overview](./project-overview.md)
**Start here if you're new to the project!**

Learn about:
- Project purpose and goals
- Tech stack (SvelteKit, Supabase, TypeScript)
- Core features and planned features
- Project structure
- Development workflow

---

### 2. [Common Subagents](./common-subagents.md)
**Understanding specialized development contexts**

Explore different "agent roles" for organizing development work:
- Database Schema Agent
- Supabase Integration Agent
- Svelte Component Agent
- Type Safety Agent
- API/Query Agent
- UI/UX Agent
- Testing Agent
- Performance Agent
- Authentication & Security Agent
- State Management Agent

Use this to understand how to specialize your focus when working on different aspects of the codebase.

---

### 3. [Database Schema](./database-schema.md)
**Complete database documentation**

Detailed information about:
- Table structures (`dreams`, `reviews`, `users`)
- TypeScript interfaces
- Row Level Security (RLS) policies
- Common queries and SQL examples
- Performance considerations
- Migration guidelines

**When to use**: Working with database, creating queries, understanding data relationships

---

### 4. [API Documentation](./api-documentation.md)
**Query and mutation reference**

Documentation for all data operations:
- Read operations (queries)
- Write operations (mutations)
- Error handling patterns
- Best practices
- Usage examples
- Known issues and TODOs

**When to use**: Implementing data fetching, creating new API functions, debugging data issues

---

### 5. [Components Guide](./components-guide.md)
**Svelte component reference**

Complete guide to all UI components:
- DreamCard, DreamView, Tag, Toast, etc.
- Props and events
- Usage examples
- Svelte 5 patterns (runes)
- Styling conventions
- Accessibility guidelines
- Testing patterns

**When to use**: Building UI, creating new components, understanding component architecture

---

### 6. [Development Guide](./development-guide.md)
**Developer workflow and setup**

Step-by-step guide for:
- Environment setup
- Development workflow
- Code standards (TypeScript, Svelte 5)
- Git workflow
- Debugging techniques
- Performance optimization
- Deployment procedures

**When to use**: Setting up dev environment, following best practices, troubleshooting

---

## 🎯 Quick Start Guide

### For AI Assistants

When receiving a task, follow this workflow:

1. **Understand the Project**
   - Read `project-overview.md` for context
   - Check `common-subagents.md` to identify which "role" fits the task

2. **Gather Technical Details**
   - For database work → `database-schema.md`
   - For data operations → `api-documentation.md`
   - For UI work → `components-guide.md`
   - For setup/workflow → `development-guide.md`

3. **Execute the Task**
   - Follow code standards from `development-guide.md`
   - Reference relevant documentation as needed
   - Maintain consistency with existing patterns

4. **Verify & Document**
   - Test changes thoroughly
   - Update documentation if needed
   - Follow git workflow guidelines

---

### For Human Developers

1. **First Time Setup**
   ```bash
   # Read these in order:
   1. project-overview.md    # Understand the project
   2. development-guide.md   # Set up your environment
   ```

2. **Daily Development**
   ```bash
   # Quick references:
   - components-guide.md     # When building UI
   - api-documentation.md    # When working with data
   - database-schema.md      # When updating database
   ```

3. **Troubleshooting**
   ```bash
   # Check:
   - development-guide.md > Debugging section
   - development-guide.md > Troubleshooting section
   ```

---

## 🗂️ File Organization

```
.ai/
├── README.md                    # This file - navigation guide
├── project-overview.md          # High-level project info
├── common-subagents.md          # AI agent specializations
├── database-schema.md           # Database structure & queries
├── api-documentation.md         # API functions reference
├── components-guide.md          # UI components guide
└── development-guide.md         # Dev workflow & standards
```

---

## 🔄 Keeping Documentation Updated

### When to Update

- **Adding Features**: Update relevant docs (components, API, etc.)
- **Changing Database**: Update `database-schema.md`
- **New Components**: Update `components-guide.md`
- **Workflow Changes**: Update `development-guide.md`
- **Tech Stack Changes**: Update `project-overview.md`

### How to Update

1. Make changes to the appropriate `.md` file
2. Commit with clear message: `docs: update [filename] for [change]`
3. Keep documentation in sync with code

---

## 💡 Pro Tips

### For Maximum Efficiency

1. **Bookmark for Quick Reference**
   - Keep this directory open in your editor
   - Use VS Code's search across files (Ctrl/Cmd + Shift + F)

2. **Use Search**
   - Looking for a specific function? Search `api-documentation.md`
   - Need a component? Search `components-guide.md`
   - Database question? Search `database-schema.md`

3. **Context Switching**
   - Tell your AI assistant which "agent role" to adopt
   - Example: "Act as the Database Schema Agent and help me optimize this query"

4. **Stay Updated**
   - Check git history on these docs to see recent changes
   - Review TODOs in documentation for planned work

---

## 🔗 External Resources

### Official Documentation
- [SvelteKit](https://kit.svelte.dev/docs)
- [Svelte 5](https://svelte.dev/docs/svelte/overview)
- [Supabase](https://supabase.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Community
- [Svelte Discord](https://svelte.dev/chat)
- [Supabase Discord](https://discord.supabase.com/)
- [GitHub Issues](https://github.com/pudey33/DreamRate/issues)

---

## 📝 Documentation Standards

All documentation in this directory follows these standards:

1. **Markdown Format**: Easy to read and version control
2. **Code Examples**: Include practical, working examples
3. **Clear Sections**: Use headers and ToC for navigation
4. **Up-to-Date**: Keep in sync with actual codebase
5. **Searchable**: Use clear, descriptive terms

---

## 🤝 Contributing to Documentation

### Making Improvements

1. Found an error? Fix it!
2. Something unclear? Clarify it!
3. Missing information? Add it!
4. Examples needed? Create them!

### Documentation Pull Request Template

```markdown
## Documentation Update

**Files Changed**: 
- [ ] project-overview.md
- [ ] common-subagents.md
- [ ] database-schema.md
- [ ] api-documentation.md
- [ ] components-guide.md
- [ ] development-guide.md

**Type of Change**:
- [ ] Correction/Fix
- [ ] New Content
- [ ] Clarification
- [ ] Examples Added
- [ ] Restructure

**Description**: 
[Describe what you changed and why]

**Testing**:
- [ ] Verified code examples work
- [ ] Checked for broken links
- [ ] Reviewed formatting
```

---

## 📊 Documentation Coverage

| Area | Document | Status |
|------|----------|--------|
| Project Info | project-overview.md | ✅ Complete |
| AI Contexts | common-subagents.md | ✅ Complete |
| Database | database-schema.md | ✅ Complete |
| API Layer | api-documentation.md | ✅ Complete |
| Components | components-guide.md | ✅ Complete |
| Development | development-guide.md | ✅ Complete |

---

## 🎓 Learning Path

### Recommended Reading Order

**For New Developers:**
1. project-overview.md (30 min)
2. development-guide.md (60 min)
3. database-schema.md (45 min)
4. components-guide.md (45 min)
5. api-documentation.md (30 min)
6. common-subagents.md (optional, 20 min)

**For Experienced SvelteKit Developers:**
1. project-overview.md (15 min)
2. database-schema.md (20 min)
3. api-documentation.md (15 min)
4. Skim others as needed

**For AI Assistants:**
- Load all documents into context
- Reference as needed based on task
- Use common-subagents.md for role clarity

---

## 📞 Need Help?

1. **Check Documentation First**: Search these files
2. **Review Code**: Look at existing implementations
3. **Ask the Team**: Reach out on Discord/Slack
4. **Create an Issue**: Document problems for the team

---

**Last Updated**: December 10, 2025  
**Maintainer**: DreamRate Development Team  
**Version**: 1.0.0
