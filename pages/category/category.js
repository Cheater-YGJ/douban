var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ComingSoon: {},
    top250: {},
    searchPanelShow: false,
    categoryShow: true,
    searchResult: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var comingSoonUrl = "https://douban.uieee.com/v2/movie/coming_soon" + "?start=0&count=9";
    var top250Url = "https://douban.uieee.com/v2/movie/top250" + "?start=0&count=9";

    wx.showNavigationBarLoading();
    this.getMovieListData(comingSoonUrl, "ComingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣top250");
  },

  getMovieListData: function(url, key, categoryTitle) {
    var _this = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function(res) {
        console.log(res.data);
        _this.loadMovieListData(res.data, key, categoryTitle);
      },
      fail: function(error) {
        console.log(error);
      }
    })
  },

  loadMovieListData: function(data, key, categoryTitle) {
    var movies = [];
    for (var idx in data.subjects) {
      var subject = data.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    var readyData = {};
    readyData[key] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
    wx.hideNavigationBarLoading();
  },

  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '../index/movie-detail/movie-detail?id=' + movieId
    })
  },

  onMoreTap: function(event) {
    var categorytitle = event.currentTarget.dataset.categorytitle;
    console.log(categorytitle);
    wx.navigateTo({
      url: "more-movies/more-movies?categorytitle=" + categorytitle
    })
  },

  onBindFocus: function(event) {
    this.setData({
      categoryShow: false,
      searchPanelShow: true
    })
  },

  onCancelImgTap: function(event) {
    this.setData({
      categoryShow: true,
      searchPanelShow: false,
      searchResult: {},
      inputValue: ''
    })
  },

  onBindConfirm: function(event) {
    var keyWord = event.detail.value;
    var searchUrl = "https://douban.uieee.com/v2/movie/search?q=" + keyWord;
    this.getMovieListData(searchUrl, "searchResult", "");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})