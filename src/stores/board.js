import { defineStore } from "pinia";

export const useBoardStore = defineStore("board", {
  state: () => ({
    boardId: "",
  }),
  getters: {
    getBoardId: (state) => state.boardId,
  },
  actions: {
    setBoardId(boardId) {
      this.boardId = boardId;
    },
  },
});
