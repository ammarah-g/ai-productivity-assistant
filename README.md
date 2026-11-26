
# AI Workplace Productivity Assistant

A modern, AI-powered productivity dashboard designed to help professionals simplify everyday workplace tasks. The application combines email writing, task planning, and research assistance in one clean and responsive interface.

The design features a calming **dusty rose and sage green** colour palette with a professional SaaS-style dashboard.

## Project Overview

The AI Workplace Productivity Assistant helps professionals improve productivity by using AI to automate common workplace activities.

The application provides tools to:

- Generate professional emails using different tones.
- Create daily and weekly task schedules.
- Prioritise tasks based on urgency and importance.
- Summarise research topics and articles.
- Generate useful insights and recommendations.

The project is designed as a frontend application without a custom backend or database.

## Features Implemented

### 1. Smart Email Generator

- Generate professional email drafts from user input.
- Choose between Formal, Friendly, and Persuasive tones.
- Edit generated email content.
- Copy and regenerate email drafts.

### 2. AI Task Planner

- Generate daily or weekly schedules.
- Organise tasks based on deadlines and priorities.
- Prioritise tasks by urgency and importance.
- Edit generated schedules.

### 3. AI Research Assistant

- Summarise topics and user-provided articles.
- Extract key points and insights.
- Generate recommendations based on research.
- Edit, copy, and regenerate AI responses.

### 4. Modern Dashboard

- Clean and professional SaaS-style interface.
- Sidebar navigation between productivity tools.
- Responsive design for desktop and mobile devices.
- Dusty rose and sage green colour theme.
- Editable AI-generated outputs.
- Responsible AI disclaimer.

## Technologies and Tools Used

- **React** – Building the user interface.
- **Tailwind CSS** – Styling and responsive layouts.
- **JavaScript / TypeScript** – Application logic.
- **Lovable** – AI-assisted application development.
- **AI Integration** – Generating contextual email drafts, task plans, and research summaries.
- **Local Storage** – Optional client-side data persistence.

## Setup Instructions

### Prerequisites

Before running the project, ensure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)

### 1. Clone the Repository

Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your GitHub username and repository name.

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

### 2. Navigate to the Project Directory

```bash
cd YOUR_REPOSITORY
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure AI Integration

If your project requires an AI integration or API key, configure it according to the AI provider's instructions.

For example, create a `.env` file if required:

```env
VITE_AI_API_KEY=your_api_key_here
```

Use the exact environment variable required by your integration.

**Important:** Never expose private API keys in frontend code or public repositories. Environment variables prefixed with `VITE_` are accessible in the browser. Use a secure, managed AI integration or another approach that protects credentials.

### 5. Run the Application

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to view the application.

### 6. Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Responsible AI

AI-generated content may contain errors, inaccuracies, or incomplete information.

Users should review and edit generated emails, schedules, summaries, and recommendations before using them in professional settings.

Avoid submitting confidential or sensitive workplace information unless you are authorised to do so and the AI service's privacy policies are appropriate.

## Project Status

This project is a frontend-focused AI productivity assistant.

AI features require a configured AI integration to generate contextual responses. The application does not require a custom backend or database for its basic frontend functionality.

## Future Improvements

- Save and manage previous AI-generated outputs.
- Add task completion tracking.
- Improve schedule customisation.
- Add export options for emails and task plans.
- Enhance accessibility and user experience.

## License

This project is available for educational and personal use.

A license can be added to the repository if the project is distributed or open-sourced.
