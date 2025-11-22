Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    description: {
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
