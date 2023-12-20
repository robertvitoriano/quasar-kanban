import { defineStore } from "pinia";
import { api } from "src/boot/axios";
export const useBoardStore = defineStore("board", {
  state: () => ({
    boardId: "",
    cardBeingDragged: {},
    projectLists: [],
  }),
  getters: {
    getBoardId: (state) => state.boardId,
    getprojectLists: (state) => state.projectLists,
  },
  actions: {
    setBoardId(boardId) {
      this.boardId = boardId;
    },
    loadBoard() {
      return new Promise(async (resolve, reject) => {
        try {
          const projectsResponse = await api.get(`/boards/${this.boardId}`);
          this.projectLists = [...projectsResponse.data.data.project_lists];
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
  },
});
