/* eslint-disable @typescript-eslint/no-empty-function */
import './fn'
import React, { useState } from 'react'

if (React) {
  console.log(1)
} else {
  console.log(2)
}

export default class X extends React.Component {
  static yyy = 3

  static y2yy = 3

  static ff() {
    console.log(1)
  }

  xd = 1

  get ppp() {
    return 1
  }

  constructor(props: any) {
    super(props)
  }

  componentWillMount() {}

  x() {}

  mounted() {
    class Cc {}
    console.log(new Cc())
    try {
      const x = 1
      console.log(x == 1)
      console.log(x && String(x))
    } catch (e) {}
  }

  // dd
  /** ddkk */
  handleFF() {}

  renderTTd() {}

  renderTT() {}

  render() {
    return (
      <div>
        <span />
        <span id='dd' onClick={() => {}}>
          hello
          {[1, 2].map(x => (
            <div key={x} className='dd' id='dd'>
              {x}
            </div>
          ))}
          <div />
        </span>
        <div>hello</div>
      </div>
    )
  }
}

export function Test() {
  const r = useState()
  return r
}
