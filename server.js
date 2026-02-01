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
    res.send('Server is up and running. Version: COUPON_SYSTEM_V3');
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
    const indexPath = resolve(distPath, 'index.html');
    console.log(`Routing '*' to: ${indexPath}`);
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error sending index.html:', err);
            res.status(404).send('Error: index.html not found. Ensure the project is built correctly.');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment PORT: ${process.env.PORT}`);
});
