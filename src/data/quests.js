// Manually typed quests data
export const quests = [
  {
    id: 'quest-1',
    title: 'Add a new recipe',
    requestor: 'Zelda',
    location: 'Hateno Village',
    description: [
      'After saving Hyrule from Calamity Ganon, Zelda moves in with you. Upon visiting the Hateno Ancient Tech Lab, Purah updates your Sheikah Slate so that you can store <span class="al-highlight">recipes.</span>',
      '\n',
      'Since you have less off your plate, Zelda asks you to share your favorite meals with her.',
      '\n',
      'Purah\'s words echo in your memory. To access your recipes use the right arrow key or press r...'
    ],
    state: 'active' // 'active', 'hidden', 'complete'
  },
  {
    id: 'quest-2',
    title: 'Master the Sheikah Slate',
    requestor: 'Purah',
    location: 'Hateno Ancient Tech Lab',
    description: [
      'The Sheikah Slate is a powerful tool that can store recipes, take pictures, and much more. Learn to use all its features to become a true master of ancient technology.',
      'Visit the tech lab to receive training on advanced Sheikah Slate operations.'
    ],
    state: 'active'
  },
  {
    id: 'quest-3',
    title: 'Collect rare ingredients',
    requestor: 'Impa',
    location: 'Kakariko Village',
    description: [
      'The village elder Impa has requested rare ingredients for traditional Sheikah recipes. These ingredients can only be found in the most remote corners of Hyrule.',
      'Search the mountains, forests, and ancient ruins for these precious materials.'
    ],
    state: 'hidden'
  }
];

// Helper functions to work with quests
export function getActiveQuests() {
  return quests.filter(quest => quest.state === 'active');
}

export function getHiddenQuests() {
  return quests.filter(quest => quest.state === 'hidden');
}

export function getCompletedQuests() {
  return quests.filter(quest => quest.state === 'complete');
}

export function getQuestById(id) {
  return quests.find(quest => quest.id === id);
}

export function updateQuestState(id, newState) {
  const quest = quests.find(q => q.id === id);
  if (quest && ['active', 'hidden', 'complete'].includes(newState)) {
    quest.state = newState;
    return true;
  }
  return false;
} 