export default function fn(): void {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const x = (): void => {}
  console.log(x)
  const xx = [].map<number>(() => {
    return 1
  })
  return void xx
}
