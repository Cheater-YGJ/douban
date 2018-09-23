var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheatersMovies: [],
    swiperImages: []
  },

  //跳转到详情界面
  onTapToDetail: function(event) {
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  },

  //加载最近热映电影
  getMovieListData: function(isRefresh) {
    var that = this;
    wx.request({
      url: "https://douban.uieee.com/v2/movie/in_theaters",
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        console.log(res.data);
        that.loadInTheatersMovies(res.data);
      },
      fail: function(error) {
        console.log(error);
        if (!isRefresh) {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '刷新失败',
            icon: 'none'
          })
        }
      },
      complete: function() {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
      }
    });
  },
  loadInTheatersMovies: function(data) {
    var inTheatersMovies = [];
    var swiperImages = [];
    for (var idx in data.subjects) {
      var subject = data.subjects[idx];
      var title = subject.title;
      var temp = {
        title: title,
        coverageUrl: subject.images.medium,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars),
        score: subject.rating.average,
        directors: util.convertToCastString(subject.directors),
        casts: util.convertToCastString(subject.casts)
      }
      var swiperTemp = {
        coverageUrl: subject.images.large,
        movieId: subject.id,
      }
      inTheatersMovies.push(temp);
      if (idx < 5) {
        swiperImages.push(swiperTemp);
      }
    }
    this.setData({
      inTheatersMovies: inTheatersMovies,
      swiperImages: swiperImages
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMovieListData();
    wx.showLoading({
      "title": "加载中",
      mask: true
    });
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
    this.getMovieListData(true);
    wx.showNavigationBarLoading();
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