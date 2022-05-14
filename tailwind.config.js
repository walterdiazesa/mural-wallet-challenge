module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xmd: "840px",
      },
      minWidth: {
        screen: "100vw",
      },
      maxWidth: {
        screen: "100vw",
      },
      colors: {
        dodo: {
          "pineapple-clear": "#ffe324",
          "pineapple-end": "#ffb533",
          "blueelectric-clear": "#5581f1",
          "blueelectric-end": "#1153fc",
          "greenflow-clear": "#2afeb7",
          "greenflow-end": "#08c792",
          "mint-clear": "#00f7a7",
          "mint-end": "#04f5ed",
          "barney-clear": "#c165dd",
          "barney-end": "#5c27fe",
          "strawberry-clear": "#facd68",
          "strawberry-end": "#fc76b3",
          "peach-clear": "#ffcb52",
          "peach-end": "#ff7b02",
          mainsky: "#1de5e2",
          mainspace: "#b588f7",
          void: "#464a62" /* #3c3e4c */,
          "void-light": "#8f96bd" /* #3c3e4c */,
          "void-dark": "#373a4c",
          "void-black": "#1d1f28",
        },
      },
    },
  },
  plugins: [],
};
