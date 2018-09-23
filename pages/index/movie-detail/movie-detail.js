var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var movieId = options.id;
    var url = "https://douban.uieee.com/v2/movie/subject/" + movieId;
    this.getMovieInfo(url);
  },

  //获取电影详细信息
  getMovieInfo: function(url) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "content-type": "json"
      },
      success: function(res) {
        var data = res.data;
        if (!data) {
          return;
        }
        var movie = {
          movieImg: data.images ? data.images.large : "",
          country: data.countries[0],
          title: data.title,
          originalTitle: data.original_title,
          wishCount: data.wish_count,
          commentCount: data.comments_count,
          year: data.year,
          generes: data.genres.join("、"),
          stars: util.convertToStarsArray(data.rating.stars),
          score: data.rating.average,
          directors: util.convertToCastString(data.directors),
          casts: util.convertToCastString(data.casts),
          castsInfo: util.convertToCastInfos(data.casts),
          summary: data.summary
        }
        that.setData({
          movie: movie
        });
        wx.setNavigationBarTitle({
          title: data.title
        });
        wx.hideNavigationBarLoading();
      },
      fail: function(error) {
        console.log(error);
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    })
  },

  //预览电影海报
  viewMoviePostImg: function(event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
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