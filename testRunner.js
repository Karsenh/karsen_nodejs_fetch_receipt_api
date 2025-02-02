import jest from 'jest';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Function used to run all tests before server starts.
 */
export async function runTests() {
    const options = {
        projects: [__dirname],
    };

    try {
        await jest.runCLI(options, options.projects);
        console.log('All tests passed!');
    } catch (error) {
        console.error('Tests failed', error);
        process.exit(1);
    }
}

runTests();