# Supabase Environment Variables Setup Guide

This guide explains how to properly set up and use Supabase environment variables in your Next.js application.

## Required Environment Variables

For Supabase authentication to work properly, you need these two essential environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key (public API key)

## Setting Up Environment Variables

### 1. Local Development

Create a `.env.local` file in your project root with the following content:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

Replace the values with your actual Supabase project details from the Supabase dashboard.

### 2. Production Deployment

When deploying to Vercel or another hosting provider:

1. Go to your project settings in the hosting platform
2. Add the environment variables with the same names and values
3. Redeploy your application to apply the changes

## Verifying Environment Variables

To verify that your environment variables are correctly set up:

1. Use the Environment Checker component we've added to the sign-in page
2. Check the browser console for any environment variable warnings
3. Ensure the variables are accessible in both client and server components

## Troubleshooting

If you encounter issues with environment variables:

### Common Problems

1. **Variables not available in client components**:
   - Ensure they are prefixed with `NEXT_PUBLIC_`
   - Restart your development server after adding variables

2. **JSON parsing errors**:
   - Check that your Supabase URL and key are correct
   - Verify network connectivity to Supabase servers

3. **Authentication failures**:
   - Confirm that your Supabase project has email authentication enabled
   - Check if the user exists in your Supabase authentication tables

### Debugging Steps

1. Use the Environment Checker to confirm variables are available
2. Check network requests in browser developer tools
3. Look for errors in server logs
4. Verify Supabase service status

## Security Considerations

- Never expose your `service_role` key in client-side code
- Only use the `anon` key for client-side operations
- Consider using server-side authentication for sensitive operations

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/installing)
\`\`\`

Let's also create an improved environment checker component:
