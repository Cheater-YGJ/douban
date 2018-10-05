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

  //加载正在热映电影
  loadInTheatersMovies: function(data) {
    var inTheatersMovies = [];
    var swiperImages = [];
    var randomArray = util.getRandom(5, 20);
    console.log(data);
    for (var idx in data.subjects) {
      var subject = data.subjects[idx];
      var title = subject.title;
      var temp = {
        title: title,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars),
        score: subject.rating.average,
        directors: util.convertToCastString(subject.directors),
        casts: util.convertToCastString(subject.casts)
      }
      inTheatersMovies.push(temp);
      for (var index in randomArray) {
        if (idx == randomArray[index]) {
          var swiperTemp = {
            title: title,
            coverageUrl: subject.images.large,
            movieId: subject.id
          }
          swiperImages.push(swiperTemp);
          break;
        }
      }
    }
    this.setData({
      inTheatersMovies: inTheatersMovies,
      swiperImages: swiperImages
    });
  },

  failCallBack: function() {
    wx.showToast({
      title: '加载失败',
      icon: 'none'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var url = "https://douban.uieee.com/v2/movie/in_theaters";
    this.data.baseUrl = url;
    util.http(url, this.loadInTheatersMovies, this.failCallBack);
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
    util.http(this.data.baseUrl, this.loadInTheatersMovies, this.failCallBack);
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