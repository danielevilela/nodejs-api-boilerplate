import fs from 'fs';
import path from 'path';
import { swaggerSpec } from '../config/swagger';

const outputDir = path.join(__dirname, '../../docs');
const outputFile = path.join(outputDir, 'openapi.json');

// Create docs directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write OpenAPI spec to file
fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2));
console.log(`OpenAPI documentation generated at ${outputFile}`);
