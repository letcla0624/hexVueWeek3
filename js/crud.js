const { createApp } = Vue;
let prodModal = "";
let delModal = "";
const app = createApp({
  data() {
    return {
      api_url: "https://vue3-course-api.hexschool.io/v2",
      api_path: "letcla",
      temp: {},
      showErr: false,
      del: false,
      errTitle: "",
      delSuccess: true,
      isLoading: false,
      isNew: true,
      categories: ["蛋糕", "甜甜圈", "馬卡龍"],
      products: [],
      newTemp: {},
    };
  },
  methods: {
    // 切換商品圖片
    changeImg(e) {
      this.temp.imageUrl = e.target.currentSrc;
    },
    // 驗證 token
    checkLogin() {
      axios
        .post(`${this.api_url}/api/user/check`)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          this.isLoading = false;
          // 驗證失敗跳出 modal 訊息
          this.showErr = true;
          this.errTitle = err.response.data.message;
        });
    },
    // 取得商品
    getData() {
      axios
        .get(`${this.api_url}/api/${this.api_path}/admin/products/all`)
        .then((res) => {
          this.isLoading = false;
          this.products = res.data.products;
        })
        .catch((err) => {
          this.isLoading = false;
          console.dir(err);
        });
    },
    // 刪除商品按鈕
    delProdBtn(prodId) {
      this.isLoading = true;
      axios
        .delete(`${this.api_url}/api/${this.api_path}/admin/product/${prodId}`)
        .then((res) => {
          this.successMsg(res);
          delModal.hide();
          this.temp = this.products;
        })
        .catch((err) => {
          this.errorMsg();
        });
    },
    // 新增／更新商品按鈕
    upProdBtn() {
      this.isLoading = true;
      let api = `${this.api_url}/api/${this.api_path}/admin/product`;
      let httpMethod = "post";

      if (!this.isNew) {
        api = `${this.api_url}/api/${this.api_path}/admin/product/${this.newTemp.id}`;
        httpMethod = "put";
      }
      axios[httpMethod](api, { data: this.newTemp })
        .then((res) => {
          this.successMsg(res);
          prodModal.hide();
        })
        .catch((err) => {
          this.errorMsg(err);
        });
    },
    // modal 裡新增其餘圖片
    addPics() {
      this.newTemp.imagesUrl.push("");
    },
    // modal 裡刪除其餘圖片
    delPics(key) {
      this.newTemp.imagesUrl.splice(key, 1);
    },
    // 開啟 modal
    openModal(txt, item) {
      if (txt === "create") {
        this.isNew = true;
        this.newTemp = {};
        prodModal.show();
      } else if (txt === "edit") {
        this.isNew = false;
        this.newTemp = { ...item };
        prodModal.show();
      } else {
        this.isNew = false;
        this.newTemp = { ...item };
        delModal.show();
      }
    },
    // 關閉 modal 訊息
    closeDel() {
      this.del = false;
      this.getData();
    },
    // 跳出成功 modal 訊息
    successMsg(res) {
      this.isLoading = false;
      this.del = true;
      this.delSuccess = res.data.success;
      this.errTitle = res.data.message;
      this.getData();
      this.temp = {};
    },
    // // 跳出失敗 modal 訊息
    errorMsg(err) {
      this.isLoading = false;
      this.del = true;
      this.delSuccess = err.response.data.success;
      this.errTitle = err.response.data.message;
    },
    // 關閉驗證失敗 modal 訊息，並重新導回登入頁
    closeErr() {
      this.showErr = false;
      window.location = "login.html";
    },
  },
  created() {
    this.isLoading = true;
    // 取得 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkLogin();
  },
  mounted() {
    // 取得 modal
    prodModal = new bootstrap.Modal(document.querySelector("#prodModal"));
    delModal = new bootstrap.Modal(document.querySelector("#delModal"));
  },
})
  .use(VueLoading.Plugin)
  .component("loading", VueLoading.Component)
  .mount("#app");
