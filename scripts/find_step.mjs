import fs from 'fs';
import readline from 'readline';

const stream = fs.createReadStream('C:/Users/singh/.gemini/antigravity/brain/0063aef8-c503-4231-b15d-da6b843046f3/.system_generated/logs/transcript_full.jsonl');
const rl = readline.createInterface({ input: stream });

rl.on('line', (line) => {
  if (line.includes('"step_index":2658')) {
    const data = JSON.parse(line);
    fs.writeFileSync('scripts/step2658.txt', data.content, 'utf8');
    console.log('Saved step 2658, length:', data.content.length);
    process.exit(0);
  }
});
rl.on('close', () => {
  console.log('Finished without finding 2658');
});
