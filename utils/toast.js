export default function showToast(title, icon = 'none', duration = 1000) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration
  })
}

