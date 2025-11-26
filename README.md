# PageSwap - Frontend Engineering Challenge

> **Note:** This company, product, and roadmap are all fictitious. PageSwap is designed to create a realistic scenario that helps guide your technical decisions. None of your work will be used outside of this assessment. **AI usage is not permitted for this assessment.**

---

## 📖 The Product

**PageSwap** is a peer-to-peer book lending platform that enables users to list pre-owned books for others to borrow and discover titles available in their community.

---

## 🏢 Context: Where We're At

PageSwap is in its infancy. The team was only recently assembled.

### The Team (Today)

- **Founder/CEO** - Former librarian with product vision
- **CTO** - Backend engineer who built the API and started the frontend, but realized they lacked the frontend expertise to execute to a high standard
- **Designer** - Completed the design system and handoffs
- **You** - Engineer #3, first frontend hire

### The Situation

The founder requested the **User Management** feature be implemented first so they could begin onboarding friends and family. The CTO attempted to implement it based on the designer's specs but became overwhelmed and couldn't execute the foundational components to the required standard.

**Your role:** PageSwap will be hiring 2-3 more frontend engineers once the foundation is established. **Your patterns will be their blueprint.** Code quality, architecture decisions, and component composition matter greatly.

---

## 🛠 The Stack

The CTO (primarily a backend engineer) made these technology choices:

| Technology                | Rationale                                   |
| ------------------------- | ------------------------------------------- |
| **React 19 + TypeScript** | Modern, type-safe, massive talent pool      |
| **Vite**                  | Fast iteration, great DX                    |
| **CSS Modules**           | Scoped styling (CTO doesn't like CSS-in-JS) |
| **Radix UI**              | Accessible primitives, easy to customize    |
| **TanStack Table**        | Stable, production-ready table solution     |

### What Already Exists

- ✅ Design system (designed but not yet fully implemented)
- ✅ Basic navigation shell (sidebar, routing)
- ✅ User Management page (partially implemented by CTO)
- ✅ Data layer using Repository pattern with Context API
- ✅ IndexedDB setup for local data persistence

### Working with Repositories

The application uses a **Repository pattern** to abstract data operations. Repositories are accessed via React Context hooks:

**Available Hooks:**

- `useUserRepository()` - Returns `IUserRepository` interface with methods:
    - `get(id: string): Promise<IUser | undefined>` - Get a single user by ID
    - `getAll(skip: number, take: number): Promise<IUser[]>` - Get all users with pagination
    - `add(user: IUser): Promise<string>` - Add or update a user
    - `delete(id: string): Promise<void>` - Delete a user by ID

- `useImageRepository()` - Returns `IImageRepository` interface with methods:
    - `get(resource: string): Promise<string>` - Get an image URL by resource name

**Example Usage:**

```tsx
import { useUserRepository, useImageRepository } from '../repositories';

function MyComponent() {
  const userRepository = useUserRepository();
  const imageRepository = useImageRepository();

  // Load users
  const users = await userRepository.getAll(0, 100);

  // Add a new user
  await userRepository.add({ id: '123', firstName: 'John', lastName: 'Doe', age: 30, avatarId: 'avatar1' });

  // Load an avatar image
  const avatarUrl = await imageRepository.get('avatar1.jpg');
}
```

---
## 🎫 Your Task: Complete Ticket 1

### **Ticket 1: Add User Dialog**

**Priority:** High

#### Description

Implement a dialog that allows admins to create new users. The dialog should follow the design system and use reusable, composable components.

Access the Figma design file here (requires free Figma account to view paddings, fonts, colours, icons etc.):
[**View Design in Figma**](https://www.figma.com/design/Ncj9MxMsaVAw7SwC2WBmWf/Frontend-Take-Home-Assignment?node-id=0-1&p=f&t=F9NuiR1tlxhKoA3M-0)
#### Requirements

- Use Radix Dialog primitive (or alternative if better justified)
- Form fields:
    - `firstName` (text input, required)
    - `lastName` (text input, required)
    - `age` (number input, required)
    - Avatar picker (grid of selectable avatars)
- Load avatar images using `imageRepository.get(id)` from `useImageRepository()` hook
- Avatar grid should match the design (selectable, visual feedback for selection)
- Form validation:
    - All fields required
    - Age must be a positive number greater than 0
    - Show inline error messages
- Save user via `userRepository.add(user)` from `useUserRepository()` hook
- Loading states:
    - Show loading indicator during save
    - Disable form inputs while saving
- Success/error handling:
    - Show success feedback on successful save
    - Show error message if save fails
    - Close dialog on success

#### Acceptance Criteria

- [ ] Implementation matches Figma design
- [ ] Dialog opens when "Add User" button is clicked
- [ ] All form fields are present and match design specs
- [ ] Avatar grid displays all avatars from `src/repositories/avatars.ts`
- [ ] User can select exactly one avatar (visual selection state)
- [ ] Validation errors display inline when fields are invalid
- [ ] Form cannot be submitted when validation fails
- [ ] Loading state is visible during save operation
- [ ] Success message appears after successful save
- [ ] Error message appears if save fails
- [ ] Dialog closes automatically on success
- [ ] New user appears in the table after creation
- [ ] Form resets when dialog is closed and reopened

#### Technical Notes

- Avatar data is available in `src/repositories/avatars.ts` (exports `AVATAR_IDS` array)
- Use the `useImageRepository()` hook to access image loading: `imageRepository.get(id)` resolves avatar URLs
- Use the `useUserRepository()` hook to access user operations: `userRepository.add(user)` saves users
- Consider extracting reusable form components (Input, Select, etc.)
- Dialog should be keyboard accessible (ESC to close, focus management)

## 🎯 Evaluation Criteria

### Design Implementation

- **Attention to detail:** Does it match the Figma design exactly?
- **Design system adherence:** Uses design tokens consistently

### Architecture & Reusability

- **Component composition:** How well do components work together?
- **Reusability:** Could the interfaces, patterns and components you implement for Ticket 1 be leveraged in future work?
- **Abstraction level:** Right balance between DRY and over-engineering

### Decision Making & Communication

- **Justification:** Can you explain your architectural decisions?
- **Trade-offs:** Do you understand what you optimized for?
- **PR description:** Clear explanation of what was completed and why
- **Code comments:** Appropriate documentation for complex logic

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/en/download))
- **Git** configured with SSH or HTTPS access
- **Figma account** (free) to view designs

### Setup Instructions

1. **Fork the repository**
    - Navigate to https://github.com/Clear21Public/PageSwap
    - Click Fork -> Create a new fork
    - This will Fork the repository to your personal GitHub account

2. **Clone the repository**
    - In your local dev environment open a command prompt and navigate to a development directory.

   ```bash
    cd C:\Development\
   ```

   ```bash
   git clone git@github.com:{GITHUBUSER}/PageSwap.git
   # OR if you use HTTPS
   git clone https://github.com/{GITHUBUSER}/PageSwap.git
   ```

3. **Create your feature branch**

   ```bash
   cd PageSwap
   git checkout -b john-smith
   # Use your actual name: firstname-lastname
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Generate seed data**

   ```bash
   npm run seed 100
   # This creates fake user data in public/users.json
   # You can adjust the number (e.g., npm run seed 5000)
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open the app**
    - Navigate to `http://localhost:5173` (or the URL shown in terminal)
    - Click "Users" in the sidebar to view the User Management page

### Understanding the Dev Utilities

You'll notice **"Dev Utilities"** buttons at the bottom of the sidebar. These are **NOT part of the design** and are included only for development convenience:

- **Clear Users:** Wipes all users from IndexedDB
- **Import Users:** Loads users from `public/users.json` into IndexedDB

The app uses **IndexedDB** (browser-based database) for data persistence. Use these utilities to reset to a clean state during development.

---

## 📦 Submission Instructions

### Before Submitting

1. **Test your implementation**
    - Test add user flows
    - Test error cases (validation, network failures)
    - Test with 0 users, 100 users, 5000 users
    - Verify no console errors

2. **Run linting**

   ```bash
   npm run lint
   ```

3. **Verify build succeeds**
   ```bash
   npm run build
   ```

### Submission Process

1. **Commit your work**

   ```bash
   git add .
   git commit -m "feat: implement add user dialog"
   # Use conventional commit messages
   ```

2. **Push your branch**

   ```bash
   git push origin john-smith --set-upstream
   ```

3. **Create a Pull Request**
    - Navigate to https://github.com/{GITHUBUSER}/PageSwap ( Your fork of the project )
    - Click "Compare & pull request"
    - Ensure your name is the title of the description e.g John Smith
    - **Write a detailed PR description:**
        - What architectural decisions did you make?
        - What trade-offs did you consider?
        - What would you do differently with more time?
        - Any known issues or limitations?

4. **Deadline**
    - Submit by **11:59 PM the day before your interview**
    - Example: Interview on Dec 12 at 11am → Submit by Dec 11 at 11:59pm

---

## 📞 Questions?

If you encounter blockers or have questions about requirements:

- **Technical issues:** Reach out to joshua.sinclair@clear21.com

---

**Good luck! We're excited to see how you approach this challenge.**
