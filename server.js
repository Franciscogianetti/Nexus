import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'dist' directory
const distPath = join(__dirname, 'dist');
console.log(`Serving static files from: ${distPath}`);
app.use(express.static(distPath));

// Health check
app.get('/health', (req, res) => {
    res.send('Server is up and running. Version: REVERT_COLORS_V9_SIZE_CHART');
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    const indexPath = join(distPath, 'index.html');
    console.log(`Routing '*' to: ${indexPath}`);
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error sending index.html:', err);
            res.status(404).send('Error: Built index.html not found in dist/. Please ensure the build process completed.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment PORT: ${process.env.PORT}`);
});
