Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    description: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: ''
    }
  },
  methods: {
    onTap() {
      ;(this as any).triggerEvent('tap')
    }
  }
})
