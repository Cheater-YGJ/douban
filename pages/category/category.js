var util = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: []
  },

  getMovieListData: function(url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        console.log(res.data);
        var data = res.data;
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
            coverageUrl: subject.images.medium,
            movieId: subject.id
          }
          movies.push(temp);
        }
        var totalMovies = [];
        totalMovies = that.data.movies.concat(movies);
        that.setData({
          movies: totalMovies
        });
      },
      fail: function(error) {
        console.log(error);
      },
      complete: function() {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      }
    });
  },

  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '../index/movie-detail/movie-detail?id=' + movieId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var url = "https://douban.uieee.com/v2/movie/top250";
    this.data.requestUrl = url;
    this.getMovieListData(url + "?star=0&count=21");
    wx.showNavigationBarLoading();
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
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=21";

    //刷新页面后将页面所有初始化参数恢复到初始值
    this.data.movies = [];
    this.getMovieListData(refreshUrl);
    //显示loading状态
    wx.showNavigationBarLoading();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var totalCount = this.data.movies.length;
    //拼接下一组数据的URL
    var nextUrl = this.data.requestUrl +
      "?start=" + totalCount + "&count=21";
    this.getMovieListData(nextUrl);
    //显示loading状态
    wx.showNavigationBarLoading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})