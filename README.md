# carousel
引入css: ```<link rel="stylesheet" href="yourpath/css/carousel.css">```

引入js: ```<script src="yourpath/js/carousel.js"></script>```

### put below code in your code

html code as : 
```
  <div class="carousel" data-setting='setting'>
    <ul class="carousel-ul">
      <li class="carousel-item"><a href="#"><img src="./images/0.png" alt=""></a></li>
      <!-- ...lis -->
    </ul>
    <!-- if need arrow use showArrow: true  -->
    <div class="arrow arrow-prev"></div>
    <div class="arrow arrow-next"></div>
    <!-- if need arrow  -->
  </div>
```

初始化 
```
  <script>
    const c = new Carousel(document.querySelector('.carousel'))
    c.init()
  </script>
  ```
## description

// auto 不需要用户设置，用户设置则无效: 被覆盖
 ```
 Setting: {
  width?: number, // carousel'width
  height?: number, // carousel'height
  cardWidth?: number, // carousel-item'width
  cardHeight?: number, // carousel-item'width
  cardScale?: number, // unuse
  duration?: number, // timer = setTimeout(() => {}, duration) (单位: ms)
  vertical?: number, // 相连俩张卡片之间高度差
  horizontal?: number, // 相连俩张卡片之间距离
  horizontalRate?: number, // 每次相连要减少的horizontal, 不应过大
  bottom?: number, // 中心卡片距离底部距离
  // reverse?: boolean, // unuse bug => removed
  autoPlay?: boolean, // 自动播放
  canJump?: boolean, // 能够点击非相连卡片（卡片重合的情况下只能点击箭头，所以无效: vertical: 0 && width = cardWidth && ...）
  showArrow?: boolean, // 是否显示前后箭头
  showCircle?: boolean, // 是否显示circle， 样式未做位置处理
  force?: boolean, // 默认false，false: 中心为中心点，true: 中心为起始点。图片重合轮播的情况下，需设为true
  activeCircleBgColor?: string, // 活跃circle样式, 默认为: '', 显示: 'orange'
  leftKernel?: number, // auto
  rightKernel?: number, // auto
  center?: number, // auto
}
```

default setting: 
```
{
  width: 1044,
  height: 300,
  cardWidth: 340,
  cardHeight: 234,
  duration: 3000,
  vertical: 15,
  horizontal: 100,
  horizontalRate: 0,
  bottom: 0,
  activeCircleBgColor: '',
  showCircle: false,
  canJump: false,
  reverse: false,
  autoPlay: false,
  showArrow: false,
  force: false,
}
```

