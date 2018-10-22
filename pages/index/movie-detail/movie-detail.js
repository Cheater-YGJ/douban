var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    autoplay: true,
    backgroundSrc: "/images/icon/nowplaying_bar_play_n.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var movieId = options.id;
    var url = "https://douban.uieee.com/v2/movie/subject/" + movieId;
    util.http(url, this.getMovieInfo, this.failCallBack);
    wx.showNavigationBarLoading();
  },

  //获取电影详细信息
  getMovieInfo: function(data) {
    if (!data) {
      return;
    }
    console.log(data);
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      movieId: data.id,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      bloopers: data.bloopers,
      trailers: data.trailers,
      directors: util.convertToCastString(data.directors),
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary,
      alt: data.alt
    }
    this.setData({
      movie: movie
    });
    this.setData({
      isCollected: util.getCollectionStatus(data.id)
    });
    wx.setNavigationBarTitle({
      title: data.title
    });
  },

  failCallBack: function(error) {
    wx.showToast({
      title: '加载失败',
      icon: 'none'
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

  onTapPlay: function() {
    this.setData({
      backgroundSrc: "/images/icon/nowplaying_bar_play_p.png"
    })
  },

  onTapPlayEnd: function(event) {
    var id = event.currentTarget.dataset.id;
    var split = id.split('-');
    switch (split[0]) {
      case 'trailer':
        wx.navigateTo({
          url: 'video/video?title=' + this.data.movie.trailers[split[1]].title + '&resource_url=' + this.data.movie.trailers[split[1]].resource_url
        });
        break;
      case 'blooper':
        wx.navigateTo({
          url: 'video/video?title=' + this.data.movie.bloopers[split[1]].title + '&resource_url=' + this.data.movie.bloopers[split[1]].resource_url
        });
    }
    this.setData({
      autoplay: false,
      backgroundSrc: "/images/icon/nowplaying_bar_play_n.png"
    })
  },

  collectTap: function() {
    if (this.data.isCollected != null) {
      var movieId = this.data.movie.movieId;
      util.collectMovie(movieId);
      this.setData({
        isCollected: util.getCollectionStatus(movieId)
      });
      wx.showToast({
        title: this.data.isCollected ? '收藏成功' : '取消成功',
        icon: 'success',
        mask: true
      })
    }
  },

  onTapToDouban: function() {
    var url = this.data.movie.alt;
    wx.navigateTo({
      url: 'douban-web/douban-web?url=' + url,
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
    this.setData({
      autoplay: true
    })
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