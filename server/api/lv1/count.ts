let counter = 0
export default () => {
  counter++
  return {
      count: counter,
      x: 456
  }
}