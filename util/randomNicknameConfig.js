
import generateRandomNickname from '@articles-media/articles-dev-box/generateRandomNickname';

const randomNicknameConfig = {
  type: 'Basic',
  parts: [
    [
      "Bubbly", "Shiny", "Striped", "Spotted", "Tiny",
      "Giant", "Swift", "Glittering", "Blue", "Golden",
      "Sandy", "Coral", "Deepsea", "Wavy", "Silvery"
    ],
    [
      "Minnow", "Guppy", "Tuna", "Salmon", "Trout",
      "Angler", "Clownfish", "Snapper", "Mackerel", "Bass",
      "Flounder", "Swordfish", "Marlin", "Puffer", "Betta"
    ]
  ]
};

export default () => generateRandomNickname(randomNicknameConfig);