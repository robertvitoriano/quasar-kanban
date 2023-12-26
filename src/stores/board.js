import { defineStore } from "pinia";
import { api } from "src/boot/axios";
export const useBoardStore = defineStore("board", {
  state: () => ({
    boardId: "",
    cardBeingDragged: {},
    projectLists: [],
    title: "",
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
          this.title = projectsResponse.data.data.title;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
  },
});
