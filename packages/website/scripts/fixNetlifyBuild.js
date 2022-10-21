import { rmdirSync, writeFileSync } from 'fs';

// This script fixes the Netlify build for an SPA by removing the functions
// directory and redirecting each route to the index.html file
rmdirSync('./netlify/functions', { recursive: true });
writeFileSync('./netlify/_redirects', '/*    /index.html    200', 'utf-8');
