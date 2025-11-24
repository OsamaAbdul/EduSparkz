
# Supabase Migration Guide

This project has been migrated to a serverless architecture using Supabase. Follow these steps to complete the setup.

## 1. Supabase Project Setup

1.  Create a new Supabase project at [https://supabase.com](https://supabase.com).
2.  Go to **Project Settings > API** and copy the `URL` and `anon` public key.
3.  Update your `.env` file in the `client` directory (or create one) with these values:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

## 2. Database Schema

1.  Go to the **SQL Editor** in your Supabase dashboard.
2.  Open the `supabase/schema.sql` file in this project.
3.  Copy the entire content of `supabase/schema.sql` and paste it into the SQL Editor.
4.  Run the SQL script to create the tables, policies, and functions.

## 3. Edge Functions

The quiz generation logic has been moved to a Supabase Edge Function.

1.  Install the Supabase CLI if you haven't already: [https://supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli)
2.  Login to Supabase CLI:
    ```bash
    npx supabase login
    ```
3.  Link your project:
    ```bash
    npx supabase link --project-ref your_project_ref
    ```
4.  Deploy the `generate-quiz` function:
    ```bash
    npx supabase functions deploy generate-quiz
    ```
5.  Set the OpenAI API Key for the function:
    ```bash
    npx supabase secrets set OPENAI_API_KEY=sk-...
    ```

## 4. Run the Client

1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 5. Verify Migration

-   **Register/Login**: Try creating a new account. Check the `auth.users` and `public.profiles` tables in Supabase.
-   **Generate Quiz**: Upload a PDF or text file. This will trigger the `generate-quiz` Edge Function. Check the `quizzes` table.
-   **Take Quiz**: Complete a quiz. Check the `quiz_results` table.
-   **History/Leaderboard**: Verify that your past results show up in History and Leaderboard.

## Notes

-   The original `backend` folder is no longer used and can be archived or deleted.
-   Ensure you have enabled **Email Auth** in Supabase Authentication settings.

## 6. Retention Algorithm

This application includes an intelligent retention algorithm that helps students retain knowledge:

- **How it works:** When students fail a quiz (score < 70%), the system will inject random questions from that failed quiz into future quizzes
- **Forced retake:** If a student fails a retention question, they must retake the original quiz before continuing
- **Configuration:** See `RETENTION_ALGORITHM.md` for detailed documentation and customization options

The retention algorithm is automatically enabled once the database schema is deployed.
