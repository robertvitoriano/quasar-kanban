const isLoggedInd =
  localStorage.getItem("token") && JSON.parse(localStorage.getItem("token"));

const routes = [
  {
    path: "/",
    component: () =>
      isLoggedInd
        ? import("layouts/MainLayout.vue")
        : import("layouts/EmptyLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          isLoggedInd
            ? import("pages/HomePage.vue")
            : import("pages/LoginSignUpPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
