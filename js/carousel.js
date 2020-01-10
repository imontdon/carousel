var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * @author imontdon
 * plugin carousel
 *
 */
var defaultSet = {
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
    force: false
};
var timer = null;
var Carousel = /** @class */ (function () {
    // private stackNumber: number
    function Carousel(element, setting) {
        if (setting === void 0) { setting = defaultSet; }
        this.element = element;
        this.setting = __assign({}, setting);
        this.childItems = [];
        // this.stackNumber = -1
    }
    Carousel.prototype.setCard = function () {
        var itemArr = this.element.querySelectorAll('.carousel-item');
        try {
            if (itemArr.length === 0) {
                console.error('plugin need children class: "carousel-tiem"');
                return;
            }
        }
        catch (e) {
            console.error('plugin need children class: "carousel-tiem"');
            return;
        }
        // this.stackNumber = itemArr.length - 1
        this.setting.center = Math.floor((itemArr.length - 1) / 2);
        this.current = this.setting.force ? 0 : this.setting.center;
        // itemArr[this.setting.center].setAttribute('class', `${itemArr[this.setting.center].className} center`)
        for (var i = 0; i < itemArr.length; i++) {
            var child = new CarouselItem(itemArr[i], this.setting, i);
            this.childItems.push(child);
        }
        if (this.setting.force) {
            this.carouselItemClick(this.childItems[0], 0, this.setting.center, 'left');
        }
        this.listener();
    };
    /**
     * 监听函数
     */
    Carousel.prototype.listener = function () {
        var _this = this;
        var _loop_1 = function (i) {
            var child = this_1.childItems[i];
            child.element.onclick = function () {
                if (timer) {
                    clearTimeout(timer);
                }
                var direction = child.index > _this.setting.center ? 'right' : child.index < _this.setting.center ? 'left' : 'stop';
                if (direction !== 'stop') {
                    var step = _this.setting.canJump ? Math.abs(child.index - _this.setting.center) : 1;
                    _this.carouselItemClick(child, i, step, direction);
                }
                if (_this.setting.autoPlay) {
                    _this.play();
                }
            };
        };
        var this_1 = this;
        for (var i = 0; i < this.childItems.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * @description autoPlay控制播放
     */
    Carousel.prototype.play = function () {
        var _this = this;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            for (var k = 0; k < _this.childItems.length; k++) {
                _this.translate(_this.childItems[k], true, 1, 'right');
            }
            if (_this.setting.autoPlay) {
                _this.play();
            }
        }, this.setting.duration);
    };
    /**
     * @description - 位移函数 @function translateLeft @function translateRight - 实现
     * @param { CarouselItem } child - ele
     * @param { Boolean } passive - 主动还是被动移动
     * @param { Number } step = 位移
     * @param { String } direction - 方向 - 点击右边向左移
     *
     * */
    Carousel.prototype.translate = function (child, passive, step, direction) {
        if (step === void 0) { step = 1; }
        // distance: number = 1
        if (!passive) { // 主动
            this.current = child.fixedPosition;
            if (child.index > this.setting.center) { // 点击了中心右边的图片--正常向左移
                // if (this.setting.reverse) {
                //   this.translateLeft(child, step)
                // } else {
                //   this.translateRight(child, step)
                // }
                this.translateLeft(child, step);
            }
            else if (child.index < this.setting.center) {
                // if (this.setting.reverse) {
                //   this.translateRight(child, step)
                // } else {
                //   this.translateLeft(child, step)
                // }
                this.translateRight(child, step);
            }
        }
        else { // 被动
            if (direction === 'right') {
                // if (this.setting.reverse) {
                //   this.translateLeft(child, step)
                // } else {
                //   this.translateRight(child, step)
                // }
                this.translateLeft(child, step);
            }
            else {
                // if (this.setting.reverse) {
                //   this.translateRight(child, step)
                // } else {
                //   this.translateLeft(child, step)
                // }
                this.translateRight(child, step);
            }
        }
        child.zIndex = (this.setting.center * 2 + 1) - Math.abs(child.index - this.setting.center);
        // console.log(tempIndex, child)
        child.init();
    };
    /**
     * @description 左位移
     * @param child - ele
     * @param step - 位移步数
     */
    Carousel.prototype.translateLeft = function (child, step) {
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
        child.index = child.index - step < 0 ? this.childItems.length - (step - child.index) : child.index - step;
    };
    /**
     * @description 右位移
     * @param child - ele
     * @param step - 位移步数
     */
    Carousel.prototype.translateRight = function (child, step) {
        // if (child.index === this.stackNumber)  {
        //   child.index = 0
        // } else {
        //   child.index = child.index + 1
        // }
        child.index = (child.index + step) % (this.childItems.length);
    };
    /**
     * @description 用户设置获取setting的某些属性值
     * @return { Setting } setting - 用户设置
     */
    Carousel.prototype.getSetting = function () {
        var userSetting = JSON.parse(this.element.getAttribute('data-setting'));
        var setting = __assign({}, userSetting, { leftKernel: (userSetting.width / 2) - (userSetting.cardWidth / 2), rightKernel: (userSetting.width / 2) + (userSetting.cardWidth / 2) });
        return setting;
    };
    /**
     * @description - 向左向右走
     * @param { String} type - 向左向右看齐
     */
    Carousel.prototype.step = function (type) {
        if (timer) {
            clearTimeout(timer);
        }
        // console.log(type)
        if (type === 'right') {
            this.current = (this.current + 1) % (this.childItems.length);
        }
        else {
            this.current = this.current - 1 < 0 ? this.childItems.length - (1 - this.current) : this.current - 1;
        }
        for (var k = 0; k < this.childItems.length; k++) {
            this.translate(this.childItems[k], true, 1, type);
        }
        if (this.setting.showCircle) {
            this.resetCircle();
        }
        if (this.setting.autoPlay) {
            this.play();
        }
    };
    /**
     * @description 初始化
     */
    Carousel.prototype.init = function () {
        this.setting = __assign({}, this.setting, this.getSetting());
        this.element.style.cssText = "width: " + this.setting.width + "px; height: " + this.setting.height + "px; overflow: hidden;";
        this.setCard();
        if (this.setting.autoPlay) { // 自动播放
            this.play();
        }
        else {
            if (timer) {
                clearTimeout(timer);
            }
        }
        if (this.setting.showArrow) { // 箭头
            this.handleArrow();
        }
        if (this.setting.showCircle) { // 圆点
            this.initCircle();
        }
    };
    /**
     * @description - item点击事件
     * @param child - item / 想要移动的item
     * @param index - item'下标 / 想要移动的item'下标
     * @param step - 位移
     * @param direction - 方向
     */
    Carousel.prototype.carouselItemClick = function (child, index, step, direction) {
        // 第二次用到相同代码
        this.translate(child, false, step);
        for (var k = 0; k < this.childItems.length; k++) {
            if (k !== index) {
                this.translate(this.childItems[k], true, step, direction); // 被动动画
            }
        }
        if (this.setting.showCircle) {
            this.resetCircle();
        }
    };
    /**
     * 处理箭头事件
     */
    Carousel.prototype.handleArrow = function () {
        var _this = this;
        var prevArrow = this.element.querySelector('.arrow-prev');
        var nextArrow = this.element.querySelector('.arrow-next');
        if (prevArrow === undefined || nextArrow === undefined || prevArrow === null || nextArrow === null) {
            console.error("Attribute showArrow need element calssName as 'arrow' && ('arrow-prev' || 'arrow-next') ");
            return;
        }
        prevArrow.onclick = function () {
            _this.step('left');
        };
        nextArrow.onclick = function () {
            _this.step('right');
        };
    };
    /**
     * 初始化circle
     */
    Carousel.prototype.initCircle = function () {
        var _this = this;
        var fragment = document.createDocumentFragment();
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'list-ul');
        this.childItems.forEach(function (child, index) {
            var li = document.createElement('li');
            li.setAttribute('class', "list-li__item " + (index === _this.current ? 'active' : 'normal'));
            if (index === _this.current && _this.setting.activeCircleBgColor !== '') {
                li.style.cssText += "; background: " + _this.setting.activeCircleBgColor + ";";
            }
            ul.appendChild(li);
        });
        fragment.appendChild(ul);
        this.element.appendChild(fragment);
        this.circleClick();
    };
    /**
     * 重置circle样式，类
     */
    Carousel.prototype.resetCircle = function () {
        var lis = this.element.querySelectorAll('.list-ul li');
        for (var i = 0; i < lis.length; i++) {
            lis[i].setAttribute('class', "list-li__item " + (i === this.current ? 'active' : 'normal'));
            if (this.setting.activeCircleBgColor !== '') {
                if (i === this.current) {
                    lis[i].style.cssText += "; background: " + this.setting.activeCircleBgColor + ";";
                }
                else {
                    lis[i].style.cssText = ';';
                }
            }
        }
    };
    /**
     * circle点击事件
     */
    Carousel.prototype.circleClick = function () {
        var _this = this;
        var lis = this.element.querySelectorAll('.list-ul li');
        var _loop_2 = function (i) {
            lis[i].onclick = function () {
                if (timer) {
                    clearTimeout(timer);
                }
                var direction = _this.childItems[i].index > _this.setting.center ? 'right' : _this.childItems[i].index < _this.setting.center ? 'left' : 'stop';
                if (direction !== 'stop') {
                    var step = Math.abs(_this.childItems[i].index - _this.setting.center);
                    _this.carouselItemClick(_this.childItems[i], i, step, direction);
                }
                if (_this.setting.autoPlay) {
                    _this.play();
                }
            };
        };
        for (var i = 0; i < lis.length; i++) {
            _loop_2(i);
        }
    };
    return Carousel;
}());
var CarouselItem = /** @class */ (function (_super) {
    __extends(CarouselItem, _super);
    function CarouselItem(element, setting, index) {
        var _this = _super.call(this, element, setting) || this;
        _this.index = index;
        // this.left = index <= setting.center ? 
        //   setting.leftKernel - (setting.horizontal - 20 * Math.abs(index - setting.center)) * Math.abs(setting.center - index)  :
        //   setting.rightKernel + (setting.horizontal - 20 * Math.abs(index - setting.center)) * Math.abs(index - setting.center) - setting.cardWidth
        // this.bottom =  Math.abs(index - setting.center) * setting.vertical
        _this.left = 0;
        _this.bottom = 0;
        _this.fixedPosition = index;
        _this.zIndex = (setting.center * 2 + 1) - Math.abs(index - setting.center);
        _this.init();
        return _this;
    }
    CarouselItem.prototype.init = function () {
        this.initData();
    };
    CarouselItem.prototype.initData = function () {
        this.left = this.index <= this.setting.center ?
            this.setting.leftKernel - (this.setting.horizontal - this.setting.horizontalRate * Math.abs(this.index - this.setting.center)) * Math.abs(this.setting.center - this.index) :
            this.setting.rightKernel + (this.setting.horizontal - this.setting.horizontalRate * Math.abs(this.index - this.setting.center)) * Math.abs(this.index - this.setting.center) - this.setting.cardWidth;
        this.bottom = Math.abs(this.index - this.setting.center) * this.setting.vertical + this.setting.bottom;
        if (this.index === this.setting.center) {
            this.element.classList.add('current');
            // this.element.style.cssText += `; ${}`  
        }
        else {
            this.element.classList.remove('current');
        }
        this.element.style.cssText += "; \n      width: " + this.setting.cardWidth + "px;\n      height: " + this.setting.cardHeight + "px;\n      left: " + this.left + "px; \n      z-index: " + this.zIndex + "; \n      bottom: " + this.bottom + "px;\n    ";
    };
    return CarouselItem;
}(Carousel));
