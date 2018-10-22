var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectedMovies: [],
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  //跳转到详情界面
  onTapToDetail: function(event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: '../index/movie-detail/movie-detail?id=' + movieId,
    })
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
    var movieIds = util.getAllCollectedMovies();
    if (this.data.collectedMovies.length > 0) {
      var ids = [];
      for (var idx in this.data.collectedMovies) {
        ids[idx] = this.data.collectedMovies[idx].movieId;
      }
      if (ids.toString() == movieIds.toString()) {
        return;
      }
    }
    this.data.collectedMovies = [];
    this.data.count = 0;
    if (movieIds.length > 0) {
      for (var idx in movieIds) {
        var url = "https://douban.uieee.com/v2/movie/subject/" + movieIds[idx];
        this.http(url, this.getMovieInfo, idx, movieIds.length);
      }
    } else {
      this.setData({
        collectedMovies: []
      });
    }
  },

  http: function(url, callBack, idx, length) {
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function(res) {
        callBack(res.data, idx, length);
      },
      fail: function(error) {
        console.log(error);
      }
    })
  },

  getMovieInfo: function(data, idx, length) {
    if (!data) {
      return;
    }
    var collectedMovie = {
      title: data.title,
      coverageUrl: data.images.large,
      movieId: data.id,
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      directors: util.convertToCastString(data.directors),
      casts: util.convertToCastString(data.casts)
    }
    this.data.collectedMovies[idx] = collectedMovie;
    this.data.count++;
    if (this.data.count == length) {
      this.setData({
        collectedMovies: this.data.collectedMovies,
      });
    }
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