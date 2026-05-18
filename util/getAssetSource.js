/**
 * Returns the appropriate model source URL based on the environment configuration.
 * 
 * @param {string} path - The local path to the model.
 * @returns {string} The full URL to the model.
 */
export default function getAssetSource(
    path,
) {

    const source = process.env.NEXT_PUBLIC_MODEL_SOURCE;

    switch (source) {
        case 'CDN':
            return `${process.env.NEXT_PUBLIC_CDN}games/School Run/public/${path}`;
        case 'Local':
            return `${path}`;
        default:
            console.warn(`Unknown model source: ${source} - defaulting to local model.`);
            return `${path}`;
    }
    
}