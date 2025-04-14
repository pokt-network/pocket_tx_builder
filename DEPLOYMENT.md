# Deployment Guide for Pocket SDK UI

This guide provides instructions for deploying the Pocket SDK UI application to production environments.

## Frontend Deployment (Netlify)

1. **Create a Netlify account** if you don't have one already at [netlify.com](https://www.netlify.com/)

2. **Deploy via Netlify CLI**:
   ```bash
   # Install Netlify CLI if you haven't already
   npm install -g netlify-cli
   
   # Login to your Netlify account
   netlify login
   
   # Navigate to the frontend directory
   cd frontend
   
   # Initialize Netlify site
   netlify init
   
   # Deploy to production
   netlify deploy --prod
   ```

3. **Deploy via Netlify UI**:
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect to your GitHub repository
   - Set build command to `npm run build`
   - Set publish directory to `dist`
   - Click "Deploy site"

4. **Environment Variables**:
   - In the Netlify UI, go to Site settings > Build & deploy > Environment
   - Add the following environment variables:
     - `VITE_API_URL`: URL of your backend API
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_KEY`: Your Supabase anon key

## Backend Deployment (Render)

1. **Create a Render account** if you don't have one already at [render.com](https://render.com/)

2. **Deploy via Render UI**:
   - Go to [dashboard.render.com](https://dashboard.render.com/)
   - Click "New" and select "Web Service"
   - Connect to your GitHub repository
   - Select the backend directory
   - Set build command to `pip install -r requirements.txt`
   - Set start command to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Select an appropriate plan
   - Click "Create Web Service"

3. **Environment Variables**:
   - In the Render UI, go to your web service > Environment
   - Add the following environment variables:
     - `ALPHA_SECRET`: Secret for Alpha network
     - `BETA_SECRET`: Secret for Beta network
     - `MAINNET_SECRET`: Secret for MainNet
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_KEY`: Your Supabase anon key
     - `SUPABASE_JWT_SECRET`: Your Supabase JWT secret

## Backend Deployment (Heroku)

1. **Create a Heroku account** if you don't have one already at [heroku.com](https://www.heroku.com/)

2. **Deploy via Heroku CLI**:
   ```bash
   # Install Heroku CLI if you haven't already
   brew install heroku/brew/heroku
   
   # Login to your Heroku account
   heroku login
   
   # Navigate to the backend directory
   cd backend
   
   # Create a Heroku app
   heroku create pocket-sdk-api
   
   # Push to Heroku
   git subtree push --prefix backend heroku main
   ```

3. **Environment Variables**:
   - In the Heroku UI, go to Settings > Config Vars
   - Add the same environment variables as listed for Render

## Important Considerations

1. **CORS Configuration**:
   - Update the CORS settings in the backend's `main.py` to include your frontend's production URL:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-netlify-app.netlify.app"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Supabase Configuration**:
   - Make sure your Supabase project is properly configured for production
   - Update the allowed redirect URLs in your Supabase authentication settings

3. **pocketd Binary**:
   - Ensure that the `pocketd` binary is available in the production environment
   - You may need to include it in your repository or install it as part of your deployment process

4. **Secrets Management**:
   - Never commit sensitive information to your repository
   - Use environment variables for all secrets
   - Consider using a secrets management service for production

## Verifying Deployment

1. Visit your deployed frontend URL
2. Try logging in with Supabase authentication
3. Test the API endpoints to ensure they're working correctly
4. Check that the environment switching (Alpha, Beta, MainNet) works as expected
