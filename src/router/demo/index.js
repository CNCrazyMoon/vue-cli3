/**
 * demo 相关路由
 */
export default [
  {
    path: "/transition",
    name: "transition",
    component: resolve => {
      require.ensure(
        ["@/views/demo/transition.vue"],
        () => {
          resolve(require("@/views/demo/transition.vue"));
        },
        "transition"
      );
    },
    meta: {
      docTitle: "动画组件",
      keepAlive: false
    }
  },
  {
    path: "/cell",
    name: "cell",
    component: resolve => {
      require.ensure(
        ["@/views/demo/cell.vue"],
        () => {
          resolve(require("@/views/demo/cell.vue"));
        },
        "cell"
      );
    },
    meta: {
      docTitle: "单元格组件",
      keepAlive: false
    }
  },
  {
    path: "/switch",
    name: "switch",
    component: resolve => {
      require.ensure(
        ["@/views/demo/switch.vue"],
        () => {
          resolve(require("@/views/demo/switch.vue"));
        },
        "switch"
      );
    },
    meta: {
      docTitle: "开关组件",
      keepAlive: false
    }
  },
  {
    path: "/step",
    name: "step",
    component: resolve => {
      require.ensure(
        ["@/views/demo/step.vue"],
        () => {
          resolve(require("@/views/demo/step.vue"));
        },
        "step"
      );
    },
    meta: {
      docTitle: "步骤条组件",
      keepAlive: false
    }
  }
];
