
const https = require('https');

const urls = [
    "https://images.unsplash.com/photo-1588510860548-b4b3c0762bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsaXBzJTIwbWFrZXVwfGVufDB8fHx8MTc2ODgyNzQwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1616790875429-c2b64d3fe2d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwbGlwc3xlbnwwfHx8fDE3Njg4Mjc0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1618580630718-490333d02a9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYW1lcmljYW4lMjBsaXBzfGVufDB8fHx8MTc2ODgyNzQwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1591360236480-949504f7626c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxsaXAlMjB0aW50fGVufDB8fHx8MTc2ODgyNzQwMnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1621202498953-b0e89115a33c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHjaGVtaWNhbCUyMHBlZWx8ZW58MHx8fHwxNzY4Mjg0MjMxfDA&ixlibrb-4.1.0&q=80&w=1080"
];

urls.forEach(url => {
    https.get(url, (res) => {
        console.log(`Status: ${res.statusCode} for ${url}`);
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            console.log(`Redirect to: ${res.headers.location}`);
        }
    }).on('error', (e) => {
        console.error(`Error for ${url}: ${e.message}`);
    });
});
