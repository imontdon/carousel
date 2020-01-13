interface Setting {
  width?: number,
  height?: number,
  cardWidth?: number,
  cardHeight?: number,
  cardScale?: number,
  duration?: number,
  vertical?: number,
  horizontal?: number, 
  horizontalRate?: number,
  bottom?: number,
  reverse?: boolean,
  autoPlay?: boolean,
  canJump?: boolean,
  showArrow?: boolean,
  showCircle?: boolean,
  force?: boolean,
  activeCircleBgColor?: string,
  rective?: boolean,
  leftKernel?: number, // auto
  rightKernel?: number, // auto
  center?: number, // auto
  // stackNumber?: number, // auto
}

/**
 * @author imontdon
 * plugin carousel
 * 
 */

const defaultSet: Setting = {
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
  rective: false,
  autoPlay: false,
  showArrow: false,
  force: false,
}
var timer: number = null
class Carousel {
  public element: HTMLElement
  public setting: Setting
  private childItems: CarouselItem[]
  private current: number
  public index: number
  // private stackNumber: number
  constructor(element: HTMLElement, setting: Setting = defaultSet) {
    this.element = element
    this.setting = { ...setting }
    this.childItems = []
    // this.stackNumber = -1
  }
  setCard() { // 设置carousel-item
    const itemArr = this.element.querySelectorAll('.carousel-item') as NodeListOf<HTMLElement>
    try {
      if (itemArr.length === 0) {
        console.error('plugin need children class: "carousel-tiem"')
        return
      }
    } catch(e) {
      console.error('plugin need children class: "carousel-tiem"')
      return
    }
    // this.stackNumber = itemArr.length - 1
    this.setting.center = Math.floor((itemArr.length - 1) / 2)
    this.current = this.setting.force ? 0 : this.setting.center
    // itemArr[this.setting.center].setAttribute('class', `${itemArr[this.setting.center].className} center`)
    for (let i = 0; i < itemArr.length; i++) {
      const child = new CarouselItem(itemArr[i], this.setting, i)
      this.childItems.push(child)
    }
    if (this.setting.force) {
      this.carouselItemClick(this.childItems[0], 0, this.setting.center, 'left')
    }
    this.listener()
  }
  /**
   * 监听函数
   */
  listener() {
    for (let i = 0; i < this.childItems.length; i++) {
      const child: CarouselItem = this.childItems[i]
      child.element.onclick = () => {
        if (timer) { clearTimeout(timer) }
        const direction = child.index > this.setting.center ? 'right' : child.index < this.setting.center ? 'left' : 'stop'
        if (direction !== 'stop') {
          const step =  this.setting.canJump ? Math.abs(child.index - this.setting.center) : 1
          this.carouselItemClick(child, i, step, direction)
        }
        if (this.setting.autoPlay) {
          this.play()
        }
      }
    }
  }
  /**
   * @description autoPlay控制播放
   */
  play() {
    if (timer) { clearTimeout(timer) }
    timer = setTimeout(() => {
      for (let k = 0; k < this.childItems.length; k++) {
        this.translate(this.childItems[k], true, 1, 'right')
      }
      if (this.setting.autoPlay) {
        this.play()
      }
    }, this.setting.duration)
  }
  /**
   * @description - 位移函数 @function translateLeft @function translateRight - 实现
   * @param { CarouselItem } child - ele
   * @param { Boolean } passive - 主动还是被动移动
   * @param { Number } step = 位移
   * @param { String } direction - 方向 - 点击右边向左移
   * 
   * */
  translate(child: CarouselItem, passive: boolean, step: number = 1, direction?: string) {
    // distance: number = 1
    if (!passive) { // 主动
      this.current = child.fixedPosition
      if (child.index > this.setting.center) { // 点击了中心右边的图片--正常向左移
        // if (this.setting.reverse) {
        //   this.translateLeft(child, step)
        // } else {
        //   this.translateRight(child, step)
        // }
        this.translateLeft(child, step)
      } else if (child.index < this.setting.center) {
        // if (this.setting.reverse) {
        //   this.translateRight(child, step)
        // } else {
        //   this.translateLeft(child, step)
        // }
        this.translateRight(child, step)
      }
    } else { // 被动
      if (direction === 'right') {
        // if (this.setting.reverse) {
        //   this.translateLeft(child, step)
        // } else {
        //   this.translateRight(child, step)
        // }
        this.translateLeft(child, step)
      } else {
        // if (this.setting.reverse) {
        //   this.translateRight(child, step)
        // } else {
        //   this.translateLeft(child, step)
        // }
        this.translateRight(child, step)
      }
    }
    child.zIndex = (this.setting.center * 2 + 1) - Math.abs(child.index - this.setting.center)
    // console.log(tempIndex, child)
    child.init()
  }
  /**
   * @description 左位移
   * @param child - ele
   * @param step - 位移步数
   */
  translateLeft(child: CarouselItem, step: number) {
    // if (child.index === 0) {
    //   child.index = this.stackNumber
    // } else {
    //   child.index = child.index - 1
    // }
    /**
     * const length = 7
     * ——————————————————————————————
     * |step \index| 0 | 1 | 2 | 3 |
     * |     1     | 6 | 0 | 1 | 2 |
     * |     2     | 5 | 6 | 0 | 1 |        ==\\    index - step < 0 => length - Math.abs(index - step) = length - (step - index)
     * |     3     | 4 | 5 | 6 | 0 |        ==//    index - step >= 0 => index - step
     * |     4     | 3 | 4 | 5 | 6 |
     * |     5     | 2 | 3 | 4 | 5 |
     */
    child.index = child.index - step < 0 ? this.childItems.length - (step - child.index) : child.index - step
  }
  /**
   * @description 右位移
   * @param child - ele
   * @param step - 位移步数
   */
  translateRight(child: CarouselItem, step: number) {
    // if (child.index === this.stackNumber)  {
    //   child.index = 0
    // } else {
    //   child.index = child.index + 1
    // }
    child.index = (child.index + step) % (this.childItems.length)
  }
  /**
   * @description 用户设置获取setting的某些属性值
   * @return { Setting } setting - 用户设置
   */
  getSetting() {
    const userSetting: Setting = JSON.parse(this.element.getAttribute('data-setting'))
    if (userSetting.rective) {
      const clientWidth: number = document.documentElement.clientWidth
      let rate:number = 1
      rate = userSetting. width / clientWidth
      userSetting.width = clientWidth
      userSetting.height = userSetting.height / rate
      userSetting.cardWidth = userSetting.cardWidth / rate
      userSetting.cardHeight = userSetting.cardHeight / rate
    }
    const setting = {
      ...userSetting,
      leftKernel: (userSetting.width / 2) - (userSetting.cardWidth / 2),
      rightKernel: (userSetting.width / 2) + (userSetting.cardWidth / 2),
    }
    return setting
  }
  /**
   * @description - 向左向右走
   * @param { String} type - 向左向右看齐
   */
  step(type: string) {
    if (timer) { clearTimeout(timer) }
    // console.log(type)
    if(type === 'right') {
      this.current = (this.current + 1) % (this.childItems.length)
    } else {
      this.current = this.current - 1 < 0 ? this.childItems.length - (1 - this.current) : this.current - 1
    }
    for (let k = 0; k < this.childItems.length; k++) {
      this.translate(this.childItems[k], true, 1, type )
    }
    if (this.setting.showCircle) {
      this.resetCircle()
    }
    if (this.setting.autoPlay) {
      this.play()
    }
  }
  /**
   * @description 初始化
   */
  public init() {
    this.setting = { ...this.setting, ...this.getSetting() }
    this.element.style.cssText = `width: ${this.setting.width}px; height: ${this.setting.height}px; overflow: hidden;`
    this.setCard()
    if (this.setting.autoPlay) { // 自动播放
      this.play()
    } else {
      if (timer) { clearTimeout(timer) }
    }
    if (this.setting.showArrow) { // 箭头
      this.handleArrow()
    }
    if (this.setting.showCircle) { // 圆点
      this.initCircle()
    }
  }
  /**
   * @description - item点击事件
   * @param child - item / 想要移动的item
   * @param index - item'下标 / 想要移动的item'下标
   * @param step - 位移
   * @param direction - 方向
   */
  carouselItemClick(child: CarouselItem, index: number, step: number, direction: string) {
    // 第二次用到相同代码
    this.translate(child, false, step)
    for (let k = 0; k < this.childItems.length; k++) {
      if (k !== index) {
        this.translate(this.childItems[k], true, step, direction) // 被动动画
      }
    }
    if (this.setting.showCircle) {
      this.resetCircle()
    }
  }
  /**
   * 处理箭头事件
   */
  handleArrow() {
    const prevArrow = <HTMLElement>this.element.querySelector('.arrow-prev')
    const nextArrow = <HTMLElement>this.element.querySelector('.arrow-next')
    if (prevArrow === undefined || nextArrow === undefined || prevArrow === null || nextArrow === null) {
      console.error("Attribute showArrow need element calssName as 'arrow' && ('arrow-prev' || 'arrow-next') ")
      return
    }
    prevArrow.onclick = () => {
      this.step('left')
    }
    nextArrow.onclick = () => {
      this.step('right')
    }
  }
  /**
   * 初始化circle
   */
  initCircle() {
    const fragment = document.createDocumentFragment()
    const ul = document.createElement('ul')
    ul.setAttribute('class', 'list-ul')
    this.childItems.forEach((child: CarouselItem, index: number) => {
      const li = document.createElement('li')
      li.setAttribute('class', `list-li__item ${index === this.current ? 'active' : 'normal'}`)
      if (index === this.current && this.setting.activeCircleBgColor !== '') {
        li.style.cssText += `; background: ${this.setting.activeCircleBgColor};`
      }
      ul.appendChild(li)
    })
    fragment.appendChild(ul)
    this.element.appendChild(fragment)
    this.circleClick()
  }
  /**
   * 重置circle样式，类
   */
  resetCircle() {
    const lis = <NodeListOf<HTMLElement>>this.element.querySelectorAll('.list-ul li')
    for(let i = 0; i < lis.length; i++) {
      lis[i].setAttribute('class', `list-li__item ${i === this.current ? 'active' : 'normal'}`)
      if (this.setting.activeCircleBgColor !== '') {
        if (i === this.current) {
          lis[i].style.cssText += `; background: ${this.setting.activeCircleBgColor};`
        } else {
          lis[i].style.cssText = ';'
        }
      }
    }
  }
  /**
   * circle点击事件
   */
  circleClick() {
    const lis = <NodeListOf<HTMLElement>>this.element.querySelectorAll('.list-ul li')
    for(let i = 0; i < lis.length; i++) {
      lis[i].onclick = (): void => {
        if (timer) { clearTimeout(timer) }
        const direction = this.childItems[i].index > this.setting.center ? 'right' : this.childItems[i].index < this.setting.center ? 'left' : 'stop'
        if (direction !== 'stop') {
          const step = Math.abs(this.childItems[i].index - this.setting.center)
          this.carouselItemClick(this.childItems[i], i, step, direction)
        }
        if (this.setting.autoPlay) {
          this.play()
        }
      }
    }
  }
}

class CarouselItem extends Carousel{
  public index: number
  public left: number
  public bottom: number
  public zIndex: number
  public readonly fixedPosition: number
  constructor(element: HTMLElement, setting: Setting, index: number) {
    super(element, setting)
    this.index = index
    // this.left = index <= setting.center ? 
    //   setting.leftKernel - (setting.horizontal - 20 * Math.abs(index - setting.center)) * Math.abs(setting.center - index)  :
    //   setting.rightKernel + (setting.horizontal - 20 * Math.abs(index - setting.center)) * Math.abs(index - setting.center) - setting.cardWidth
    // this.bottom =  Math.abs(index - setting.center) * setting.vertical
    this.left = 0
    this.bottom = 0
    this.fixedPosition = index
    this.zIndex = (setting.center * 2 + 1) - Math.abs(index - setting.center)
    this.initSize()
    this.init()
  }
  init() {
    this.initData()
  }
  initSize() {
    this.element.style.cssText += `; 
      width: ${this.setting.cardWidth}px;
      height: ${this.setting.cardHeight}px;
    `
  }
  initData() {
    this.left = this.index <= this.setting.center ? 
      this.setting.leftKernel - (this.setting.horizontal - this.setting.horizontalRate * Math.abs(this.index - this.setting.center)) * Math.abs(this.setting.center - this.index)  :
      this.setting.rightKernel + (this.setting.horizontal - this.setting.horizontalRate * Math.abs(this.index - this.setting.center)) * Math.abs(this.index - this.setting.center) - this.setting.cardWidth
    this.bottom =  Math.abs(this.index - this.setting.center) * this.setting.vertical + this.setting.bottom
    if (this.index === this.setting.center) {
      this.element.classList.add('current')
      // this.element.style.cssText += `; ${}`  
    } else {
      this.element.classList.remove('current')
    }
    this.element.style.cssText += `; 
      left: ${this.left}px; 
      z-index: ${this.zIndex}; 
      bottom: ${this.bottom}px;
    `
  }
}