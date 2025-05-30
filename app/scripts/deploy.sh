
#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration variables
DEPLOYMENT_ENV=${1:-"production"}
VERCEL_ORG="commune-team"
AWS_S3_BUCKET="commune-${DEPLOYMENT_ENV}"
CLOUDFRONT_DISTRIBUTION_ID="E1A2B3C4D5E6F7"

# Print banner
echo -e "${BLUE}${BOLD}"
echo "╔═══════════════════════════════════════════╗"
echo "║               DHUB DEPLOYER               ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}Starting deployment process for commune to ${BOLD}${DEPLOYMENT_ENV}${NC}${YELLOW} environment...${NC}"

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: ${1} is not installed. Please install it to continue.${NC}"
        exit 1
    fi
}

# Check for required tools
echo -e "${BLUE}Checking dependencies...${NC}"
check_command node
check_command npm
check_command git

# Check if working directory is clean
if [[ $(git status --porcelain) ]]; then
    echo -e "${YELLOW}Warning: You have uncommitted changes.${NC}"
    read -p "Continue with deployment? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Deployment aborted.${NC}"
        exit 1
    fi
fi

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies. Please check the errors above.${NC}"
    exit 1
fi

# Run tests
echo -e "${BLUE}Running tests...${NC}"
npm test

if [ $? -ne 0 ]; then
    echo -e "${RED}Tests failed. Please fix the issues before deploying.${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Deployment aborted.${NC}"
        exit 1
    fi
fi

# Build the application
echo -e "${BLUE}Building the application...${NC}"
NEXT_PUBLIC_API_URL="https://api.commune.io/${DEPLOYMENT_ENV}" npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Please check the errors above.${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully!${NC}"

# Deploy based on environment
echo -e "${BLUE}Deploying to ${DEPLOYMENT_ENV}...${NC}"

case $DEPLOYMENT_ENV in
    "production")
        # Deploy to Vercel
        echo -e "${YELLOW}Deploying to Vercel production environment...${NC}"
        npx vercel --prod --yes --org $VERCEL_ORG
        
        # Also update AWS resources for CDN
        echo -e "${YELLOW}Updating AWS resources...${NC}"
        aws s3 sync .next s3://$AWS_S3_BUCKET/ --delete
        aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
        ;;
        
    "staging")
        # Deploy to staging environment
        echo -e "${YELLOW}Deploying to Vercel staging environment...${NC}"
        npx vercel --org $VERCEL_ORG
        ;;
        
    "local")
        # Just build for local testing
        echo -e "${YELLOW}Local deployment completed. Run 'npm start' to test locally.${NC}"
        ;;
        
    *)
        echo -e "${RED}Unknown deployment environment: ${DEPLOYMENT_ENV}${NC}"
        echo -e "${YELLOW}Supported environments: production, staging, local${NC}"
        exit 1
        ;;
esac

# Update deployment record
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_HASH=$(git rev-parse --short HEAD)
DEPLOYER=$(git config user.name)

echo -e "${BLUE}Recording deployment details...${NC}"
echo "$TIMESTAMP | $DEPLOYMENT_ENV | $COMMIT_HASH | $DEPLOYER" >> deployments.log

# Post-deployment tasks
echo -e "${BLUE}Running post-deployment tasks...${NC}"

# Notify team on Slack
if [ "$DEPLOYMENT_ENV" == "production" ]; then
    echo -e "${YELLOW}Sending notification to team...${NC}"
    # Uncomment and configure when ready to use
    # curl -X POST -H 'Content-type: application/json' \
    #     --data "{\"text\":\"commune has been deployed to ${DEPLOYMENT_ENV} by ${DEPLOYER} (${COMMIT_HASH})\"}" \
    #     https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
fi

echo -e "${GREEN}${BOLD}Deployment completed successfully!${NC}"
echo -e "${YELLOW}Deployment environment: ${BOLD}${DEPLOYMENT_ENV}${NC}"
echo -e "${YELLOW}Commit: ${COMMIT_HASH}${NC}"
echo -e "${YELLOW}Deployed by: ${DEPLOYER}${NC}"
echo -e "${YELLOW}Timestamp: ${TIMESTAMP}${NC}"

if [ "$DEPLOYMENT_ENV" == "production" ]; then
    echo -e "${YELLOW}Don't forget to verify your deployment at https://commune.io${NC}"
elif [ "$DEPLOYMENT_ENV" == "staging" ]; then
    echo -e "${YELLOW}Don't forget to verify your deployment at https://staging.commune.io${NC}"
fi

exit 0
