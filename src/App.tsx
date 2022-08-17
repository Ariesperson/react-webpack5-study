import React, {lazy,Suspense,useState } from 'react'
import './h1.css'
import './app.scss'
import Class from './components/Class'
import { Demo1, Demo2 } from '@/components'
const LazyDemo = lazy(() => import('@/components/LazyDemo')) // 使用import语法配合react的Lazy动态引入资源
// prefetch
const PreFetchDemo = lazy(() => import(
  /* webpackChunkName: "PreFetchDemo" */
  /*webpackPrefetch: true*/
  '@/components/PreFetchDemo'
))
// preload
const PreloadDemo = lazy(() => import(
  /* webpackChunkName: "PreloadDemo" */
  /*webpackPreload: true*/
  '@/components/PreloadDemo'
 ))

function App() {
  const [ count, setCounts ] = useState('')
  const [ show, setShow ] = useState(false)
  const [ preshow, setPreShow ] = useState(false)
  const onChange = (e: any) => {
    setCounts(e.target.value)
  }
  const onClick = () => {
    setShow(true)
  }
  const preonClick = () => {
    setPreShow(true)
  }
  return(
    <>
    {/* <div className='title'>webpack5+react+ts</div> */}
      <Demo1 />
      <p>受控组件</p>
      <input type="text" value={count} onChange={onChange} />
      <br />
      <p>非受控组件</p>
      <input type="text" />
      <div className='smallImg'></div>
      <div className='bigImg'></div>
      <h2 onClick={onClick}>展示</h2>
      { show && <Suspense fallback={null}><LazyDemo /></Suspense> }
      <h2 onClick={preonClick}>pre展示</h2>
      { preshow && (
        <>
          <Suspense fallback={null}><PreloadDemo /></Suspense>
          <Suspense fallback={null}><PreFetchDemo /></Suspense>
        </>
      ) }

    </>
  )
}
export default App