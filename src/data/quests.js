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
    title: 'Destroy Ganon',
    requestor: 'King Rhoam',
    location: 'Great Plateau',
    description: [
      'The ghost of King Rhoam told you that Hyrule is on the brink of annihilation.',
      '\n',
      'Princess Zelda is currently fighting to contain <span class="al-highlight">Calamity Ganon</span> inside Hyrule Castle, but her power cannot keep him at bay forever. Eventually Ganon will regain his full strength and destory the world.',
      '\n',
      'Your ulimate task is to aid Princess Zelda in defeating Ganon before that can happen.'
    ],
    state: 'complete'
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