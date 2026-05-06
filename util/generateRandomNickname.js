
const arcticAdjectives = [
    'Frosty', 'Icy', 'Snowy', 'Chilly', 'Blizzard', 'Polar', 'Glacial', 'Shivering',
    'Frozen', 'Crystal', 'Aurora', 'Shimmering', 'Silent', 'Brisk', 'Windy', 'Bright',
    'Northern', 'Arctic', 'Cool', 'White', 'Blue', 'Sparkling', 'Wintery', 'Misty',
    'Dazzling', 'Gentle', 'Peaceful', 'Quiet', 'Crisp', 'Twinkling'
];

const arcticNouns = [
    'Penguin', 'PolarBear', 'Igloo', 'Seal', 'Walrus', 'Narwhal', 'Snowfox', 'SnowyOwl',
    'Caribou', 'Husky', 'Aurora', 'Iceberg', 'Glacier', 'Blizzard', 'MuskOx', 'Ptarmigan',
    'ArcticHare', 'Snowflake', 'Floe', 'Sled', 'Puffin', 'Wolf', 'Moose', 'Tundra',
    'Lemming', 'Reindeer', 'Yeti', 'Snowman', 'Comet', 'Frostbite'
];


/**
 * Generates a random arctic-themed nickname.
 * @returns {string} A random nickname like "FrostyPenguin" or "IcyIgloo".
 */
const generateRandomNickname = () => {
    const adj = arcticAdjectives[Math.floor(Math.random() * arcticAdjectives.length)];
    const noun = arcticNouns[Math.floor(Math.random() * arcticNouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
};

export default generateRandomNickname;