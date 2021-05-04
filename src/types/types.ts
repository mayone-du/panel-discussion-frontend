export type ALL_TOPICS = {
  allTopics: {
    edges: [
      node: {
        id: string;
        title: string;
        isTalking: boolean;
        isClosed: boolean;
      }
    ];
  };
};
