import CloseIcon from './close-icon'
export default {
  name: 'vu-modal',
  componentName: 'vu-modal',
  props: {
    title: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    headerClassName: {
      type: String,
      default: ''
    },
    footerClassName: {
      type: String,
      default: ''
    },
    bodyClassName: {
      type: String,
      default: ''
    },
    isScroll: {
      type: Boolean,
      default: false
    },
    escapable: {
      type: Boolean,
      default: false
    },
    dismissable: {
      type: Boolean,
      default: true
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    isTop: {
      type: Boolean,
      default: false
    },
    isBottom: {
      type: Boolean,
      default: false
    },
    isLeft: {
      type: Boolean,
      default: false
    },
    isRight: {
      type: Boolean,
      default: false
    },
    center: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md'
    },
    bodyPadding: {
      type: Boolean,
      default: true
    },
    contentHeight: {
      type: String,
      default: null
    },
  },
  mounted() {
    if(this.$el.focus) {
      this.$el.focus()
    }
  },
  computed: {
    propsData() {
      return (this.$parent.$vnode.data.props && this.$parent.$vnode.data.props.vModal) ? this.$parent.$vnode.data.props.vModal : this.$props
    }
  },
  render(h) {
    const { dismissable, title, isScroll, fullscreen, isTop, isBottom, isLeft, isRight, center, size, className, headerClassName, footerClassName, bodyClassName, bodyPadding, contentHeight } = this.propsData

    const closeBtn = dismissable 
      ? h('div', {
            class: 'vu-modal__close-btn',
            on: {
              click: () => {this.$modals.dismiss()}
            }
        }, [h(CloseIcon)])
      : null

    const headerContent = this.$slots.header 
      ? this.$slots.header
      : title 
        ? h('span', {class: ['vu-modal__cmp-header-title']}, title)
        : null

    const header = headerContent 
      ? h('div', { 
          class: ['vu-modal__cmp-header', headerClassName]
        }, [ headerContent ]) 
      : null

    let bodyStyle = {
      overflowY: isScroll ? 'auto' : null,
      padding: bodyPadding ? '1em' : 0
    };
    if(!!contentHeight) {
      bodyStyle['height'] = contentHeight;
      bodyStyle['min-height'] = contentHeight;
      bodyStyle['max-height'] = contentHeight;
    }
    const body = h('div', { 
      class: ['vu-modal__cmp-body', bodyClassName], 
      style: bodyStyle
      }, [ this.$slots.default ])

    const footer = this.$slots.footer 
      ? h('div', { 
          class: ['vu-modal__cmp-footer', footerClassName]
        }, [ this.$slots.footer ]) 
      : null

    let style = {}
    let translateX = '-50%'
    let translateY = '0'
    if(center) {
        translateX = '-50%'
        translateY = '-50%'
    }
    if(isRight || isLeft) {
        translateX = '0%'
    }

    if((isTop || isBottom) && !isScroll && !center) {
        translateY = '0%'
    }
    style.transform = `translate(${translateX}, ${translateY})`

    return h('div', { 
      style,
      attrs: { tabindex: -1},
      class: ['vu-modal__cmp', {
          'vu-modal__cmp--is-fullscreen': fullscreen,
          'vu-modal__cmp--is-center': center,
          'vu-modal__cmp--is-top': isTop && !isScroll && !center,
          'vu-modal__cmp--is-bottom': isBottom && !isScroll && !center,
          'vu-modal__cmp--is-left': isLeft,
          'vu-modal__cmp--is-right': isRight
        }, 
        isScroll && fullscreen && 'vu-modal__cmp--is-scroll-fullscreen',
        isScroll && !fullscreen && 'vu-modal__cmp--is-scroll',
        !fullscreen && `vu-modal__cmp--${size}`,
        className 
      ],
      on: {click: (event) => {event.stopPropagation()}}
    }, [
      closeBtn,
      header,
      body,
      footer
    ])
  }
};
