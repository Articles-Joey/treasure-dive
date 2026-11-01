import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

// 1. Point both outputs to the transformed subfolder
const INPUT_FOLDER = path.join(PROJECT_ROOT, "public/models/Fishing");
const TRANSFORMED_FOLDER = path.join(INPUT_FOLDER, "transformed");

// Ensure the transformed directory exists
if (!fs.existsSync(TRANSFORMED_FOLDER)) {
    fs.mkdirSync(TRANSFORMED_FOLDER, { recursive: true });
}

// 2. Read and filter files
fs.readdir(INPUT_FOLDER, (err, files) => {
    if (err) {
        console.error(`❌ Error reading directory: ${err.message}`);
        return;
    }

    const glbFiles = files.filter(
        (file) => path.extname(file).toLowerCase() === ".glb",
    );

    if (glbFiles.length === 0) {
        console.log(
            "⚠️ No .glb files found in the root of the Fishing directory.",
        );
        return;
    }

    console.log(`🚀 Found ${glbFiles.length} files. Running pipeline...`);

    glbFiles.forEach((file) => {
        const filenameNoExt = path.parse(file).name;
        const inputFilePath = path.join(INPUT_FOLDER, file);

        // Internal path injected directly into the useGLTF() hook inside the file
        const internalAssetPath = `models/Fishing/transformed/${filenameNoExt}-transformed.glb`;

        // BOTH files (.glb and .jsx) are now written explicitly inside the transformed folder
        const outputJsxPath = path.join(
            TRANSFORMED_FOLDER,
            `${filenameNoExt}.jsx`,
        );

        console.log(`\n📦 Processing: ${file}...`);

        try {
            // Execute standard CLI command targeting the transformed directory layout
            execSync(
                `npx gltfjsx "${inputFilePath}" -T --path "${internalAssetPath}" --output "${outputJsxPath}"`,
                {
                    cwd: PROJECT_ROOT,
                    stdio: "inherit",
                },
            );

            // Post-Processing step: Rename the default functional component inside the generated file
            let jsxContent = fs.readFileSync(outputJsxPath, "utf8");

            const pascalName = filenameNoExt
                .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
                .replace(/^(.)/, (c) => c.toUpperCase());

            const customComponentName = `Model${pascalName}`;

            // Swaps the default "export function Model(" string with the custom naming pattern
            jsxContent = jsxContent.replace(
                /export\s+function\s+Model\s*\(/g,
                `export function ${customComponentName}(`,
            );

            fs.writeFileSync(outputJsxPath, jsxContent, "utf8");

            // Relocate the output transformed binary asset into the transformed subfolder
            const defaultTransformedGlbPath = path.join(
                INPUT_FOLDER,
                `${filenameNoExt}-transformed.glb`,
            );
            const targetTransformedGlbPath = path.join(
                TRANSFORMED_FOLDER,
                `${filenameNoExt}-transformed.glb`,
            );

            if (fs.existsSync(defaultTransformedGlbPath)) {
                fs.renameSync(
                    defaultTransformedGlbPath,
                    targetTransformedGlbPath,
                );
            }

            console.log(
                `✅ Successfully generated component "${customComponentName}" and optimized asset in the transformed folder.`,
            );
        } catch (error) {
            console.error(`❌ Failed to convert ${file}:`, error.message);
        }
    });

    console.log("\n🎉 Pipeline operations completed!");
});
