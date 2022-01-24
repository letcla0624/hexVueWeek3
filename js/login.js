const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      pwd: 1,
      isLoading: false,
      showErr: false,
      errTitle: "",
      errMsg: "",
      imgUrl:
        "https://images.unsplash.com/photo-1614145121029-83a9f7b68bf4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80",
    };
  },
  methods: {
    login() {
      this.isLoading = true;
      axios
        .post("https://vue3-course-api.hexschool.io/v2/admin/signin", this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `token=${token}; expires=${new Date(expired)};`;
          this.isLoading = false;
          window.location = "crud.html";
        })
        .catch((err) => {
          this.isLoading = false;
          // 登入失敗跳出 modal 訊息
          this.showErr = true;
          this.errTitle = err.response.data.message;
          this.errMsg = err.response.data.error.message;
        });
    },
    // 顯示 or 隱藏密碼
    showPwd() {
      this.pwd = !this.pwd;
      if (password.type === "password") {
        password.type = "text";
      } else {
        password.type = "password";
      }
    },
    // 關閉登入失敗 modal 訊息
    closeErr() {
      this.showErr = false;
    },
  },
})
  .use(VueLoading.Plugin)
  .component("loading", VueLoading.Component)
  .mount("#app");
